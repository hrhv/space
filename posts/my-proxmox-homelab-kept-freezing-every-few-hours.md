---
title: My Proxmox Homelab Kept Freezing Every Few Hours
slug: my-proxmox-homelab-kept-freezing-every-few-hours
description: How I debugged and fixed intermittent Proxmox freezes caused by the e1000e driver's Energy Efficient Ethernet feature.
tags:
  - homelab
  - proxmox
  - nginx-proxy-manager
  - dokploy
added: 2026-05-23T00:00:00.000Z
coverImage: /assets/2c62aa07-7b50-4b58-a720-66c496454606.webp
---

I run a small homelab on an Intel NUC — Proxmox as the hypervisor, a couple of VMs handling things like Jellyfin, AdGuard, Nginx Proxy Manager, and Dokploy. Nothing fancy, but it's always on and I rely on it.

For weeks, it would just... stop. Not crash, not reboot — *freeze*. Services unreachable, SSH dead, the whole machine dark. The only fix was a hard reboot. It happened every few hours like clockwork, and I had absolutely no idea why.

This is the story of figuring it out.

***

## The first clue: checking logs from the *previous* boot

The tricky thing about intermittent freezes is that by the time you can investigate, you've already rebooted and the moment of failure is gone. Unless, of course, you know where to look.

`journalctl` on Linux (and by extension, Proxmox) can show you logs from previous boots, not just the current one. Running this after a freeze:

```shell
journalctl -k -b -1 | tail -100
```

...immediately showed something interesting. Repeating, every two seconds, right before the machine became unreachable:

```plaintext
kernel: e1000e 0000:00:19.0 nic0_wired: Detected Hardware Unit Hang
```

There it was. Not a memory issue. Not a disk issue. Not a runaway process. **The network card had hung.**

***

## What is a Hardware Unit Hang?

The `e1000e` is the kernel driver for Intel's built-in ethernet controllers — the ones you'll find on virtually every Intel NUC, ThinkCentre, Dell OptiPlex, and similar hardware made in the last decade or so.

When this hang happens, the NIC's transmit queue gets stuck. The driver keeps pushing packets to the tail of the queue (TDT), but the hardware stops processing them — the head (TDH) just sits frozen. The kernel detects this after a timeout and logs the hang. At that point the NIC is effectively dead, and since on Proxmox *all* traffic from all VMs flows through the physical NIC via a bridge (`vmbr0`), the entire machine goes dark. It's not a system crash — it just becomes completely unreachable, which feels identical to a freeze from the outside.

***

## The root cause: Energy Efficient Ethernet (EEE)

**EEE**, standardised as IEEE 802.3az, is a feature added to ethernet around 2010. The idea is straightforward: ethernet links are binary — either fully active or completely idle — so why not add a low-power idle state (called LPI, Low Power Idle) that the NIC and switch negotiate to enter during quiet periods?

When traffic pauses, both sides agree to sleep. When traffic resumes, they wake up. On paper, this saves a fraction of a watt per port. Useful at datacentre scale. Completely irrelevant at home.

Here's why it breaks things on the `e1000e`:

1. Your NIC is mid-burst, sending a stream of packets (say, Jellyfin streaming a movie)
2. There's a tiny gap between bursts — microseconds
3. The EEE logic decides *"it's quiet, time for LPI"* and starts powering down the transmit circuitry
4. The driver has already queued the *next* burst and is writing to the transmit ring, assuming hardware is ready
5. The hardware is mid-sleep and doesn't process the queue
6. The driver waits... and waits... the kernel eventually logs a **Hardware Unit Hang**
7. The NIC is now dead until the system resets it — which only happens on a full reboot

It's a race condition between the hardware's power management state machine and the driver's assumption that the transmit path is always available. This bug has existed in various forms in the `e1000e` driver for over a decade and affects a large swath of Intel consumer hardware. It's well-documented on the Proxmox forums, Red Hat Bugzilla, Ubuntu Launchpad, and the Linux kernel mailing list — search `e1000e Hardware Unit Hang` on any of those and you'll find years of people hitting exactly this.

The reason it showed up so reliably on my setup specifically: Proxmox bridges all VM traffic through the one physical NIC. Jellyfin streaming, AdGuard handling DNS queries, Nginx proxying requests — all generating traffic at different rhythms, creating exactly the kind of irregular bursty pattern that confuses EEE's idle detection the most.

***

## The fix

Disabling EEE on the NIC is a one-liner:

```shell
ethtool --set-eee nic0_wired eee off
```

Verify it worked:

```shell
ethtool --show-eee nic0_wired
# Should show: EEE status: disabled
```

To make it survive reboots, add it as a `post-up` hook in `/etc/network/interfaces`:

```plaintext
iface nic0_wired inet manual
    post-up ethtool --set-eee nic0_wired eee off
    post-up ethtool -K nic0_wired tso off gso off gro off
```

The `tso/gso/gro off` lines disable a few other hardware offloading features that can cause similar (though less severe) issues with this driver. Disabling them has no meaningful performance impact at home — you'd need to be routing 10Gbps+ to notice a difference.

**Are there any side effects?** Not really. Your NIC will draw marginally more power (\~0.5W) since it no longer sleeps between packets. On a machine that's already drawing 15–35W, this is immeasurable on your electricity bill. Throughput and latency are completely unaffected — EEE only does anything during idle periods, and when traffic is flowing it's out of the picture entirely.

***

## Going further: a full system audit

Once the root cause was clear, I wanted to make sure there wasn't anything *else* lurking that could cause downtime. So I made Claude write a bash script that audits the entire Proxmox setup in one shot — disk health (SMART), ZFS pool status, memory allocation across VMs, thermal sensors, NIC configuration, EEE status, pending package updates, backup job existence, recent crash history, and more.

You can find it here: **\[**[audit-proxmox.sh](https://gist.github.com/hrhv/66e175d8a47d3bf0bf582344e80e80ca) **— GitHub Gist]**

Run it as root:

```shell
bash audit-proxmox.sh 2>&1 | tee audit-output.txt
```

A few things it caught on my machine beyond the NIC issue:

* **Ceph was running and consuming \~450MB RAM** despite having no pools configured. It had been initialised during Proxmox setup and never actually used. Masking those services freed the memory immediately.
* `vm.swappiness` **was set to 60**, which is too aggressive for a hypervisor — it starts swapping out host processes even when RAM is plentiful, causing VM jitter. Dropping it to 10 is the standard recommendation for Proxmox hosts.
* **No backup jobs were configured** — always a risk on a machine you depend on.

The script is safe to run on any Proxmox install — it's entirely read-only (aside from optionally installing `smartmontools` and `lm-sensors` if they're missing) and contains nothing environment-specific.

***

## Takeaway

If your Proxmox homelab freezes periodically and only a hard reboot fixes it, run this first:

```shell
journalctl -k -b -1 | grep -i "hang\|e1000e\|error"
```

If you see `Detected Hardware Unit Hang` in the output, you've found your culprit. Disable EEE, add the `post-up` line to your network config, and you're done.

The fix is two commands and a config line. The frustrating part is having no idea it existed until you know where to look.

***

*Have questions or ran into something similar? Find me on* *[Twitter](https://twitter.com/harshitbudhraja)* *or leave a comment below.*
