#!/usr/bin/env bash
set -o errexit; set -o nounset; set -o pipefail

IFACE="$1"

systemctl stop firewalld
systemctl mask firewalld
yum install -y -q iptables-services
systemctl enable iptables
systemctl start iptables
iptables -F
iptables -A INPUT -m comment --comment "ACCEPT ESTABLISHED TRAFFIC" -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A INPUT -p icmp -m comment --comment "ACCEPT ICMP TRAFFIC" -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 22 -m comment --comment "ACCEPT SSH TRAFFIC" -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 80,443 -m comment --comment "ACCEPT HTTP/S TRAFFIC" -j ACCEPT
iptables -A INPUT -p tcp -s 127.0.0.1/32 -m comment --comment "ACCEPT LOCAL TRAFFIC" -j ACCEPT
iptables -A INPUT -p tcp -s 172.17.0.1/16 -m comment --comment "ACCEPT DOCKER TRAFFIC" -j ACCEPT
iptables -t nat -A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -m comment --comment "MASQUERADE DOCKER TRAFFIC" -j MASQUERADE
iptables -A FORWARD -i docker0 -o "$IFACE" -m comment --comment "FORWARD FROM DOCKER" -j ACCEPT
iptables -A FORWARD -i "$IFACE" -o docker0 -m comment --comment "FORWARD TO DOCKER" -j ACCEPT
iptables -A INPUT -m comment --comment "DROP ALL OTHER TRAFFIC" -j DROP
service iptables save