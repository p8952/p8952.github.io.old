#!/usr/bin/env bash
set -o errexit; set -o nounset; set -o pipefail

yum install -y -q ntp
systemctl enable ntpd
systemctl start ntpd