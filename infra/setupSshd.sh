#!/usr/bin/env bash
set -o errexit; set -o nounset; set -o pipefail

yum install -y -q augeas
augtool set /files/etc/ssh/sshd_config/ChallengeResponseAuthentication no
augtool set /files/etc/ssh/sshd_config/PasswordAuthentication no
systemctl restart sshd
curl -s https://github.com/p8952.keys >> ~/.ssh/authorized_keys
awk '!a[$0]++' ~/.ssh/authorized_keys