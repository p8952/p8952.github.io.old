#!/usr/bin/env bash
set -o errexit; set -o nounset; set -o pipefail

if [[ ! -f /docker.img ]]; then
  yum install -y -q lvm2
  fallocate -l 10G /docker.img
  losetup /dev/loop0 /docker.img
  pvcreate /dev/loop0
  vgcreate docker /dev/loop0
  lvcreate --wipesignatures y -n thinpool docker -l 95%VG
  lvcreate --wipesignatures y -n thinpoolmeta docker -l 2%VG
  lvconvert -y --zero n -c 512K --thinpool docker/thinpool --poolmetadata docker/thinpoolmeta
fi

yum install -y -q yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum makecache fast
yum install -y -q docker-ce
mkdir -p /etc/systemd/system/docker.service.d/
echo '[Service]' > /etc/systemd/system/docker.service.d/override.conf
echo 'ExecStartPre=' >> /etc/systemd/system/docker.service.d/override.conf
echo 'ExecStartPre=-/usr/sbin/losetup /dev/loop0 /docker.img' >> /etc/systemd/system/docker.service.d/override.conf
echo 'ExecStart=' >> /etc/systemd/system/docker.service.d/override.conf
echo 'ExecStart=/usr/bin/dockerd --iptables=false --dns=8.8.8.8 --dns=8.8.4.4 --storage-driver=devicemapper --storage-opt=dm.thinpooldev=/dev/mapper/docker-thinpool --storage-opt=dm.use_deferred_removal=true --storage-opt=dm.use_deferred_deletion=true' >> /etc/systemd/system/docker.service.d/override.conf
systemctl daemon-reload
systemctl enable docker
systemctl restart docker