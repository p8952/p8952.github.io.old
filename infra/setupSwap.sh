#!/usr/bin/env bash
set -o errexit; set -o nounset; set -o pipefail

if [[ ! -f /swap.img ]]; then
  fallocate -l 2G /swap.img
  chmod 600 /swap.img
  mkswap /swap.img
  echo '/swap.img   none    swap    sw    0    0' >> /etc/fstab
  swapon -a
fi