---
title: Physical Cores v/s vCPUs (and the Noisy Neighbour Problem)
slug: physical-cores-vs-vcpus-and-the-noisy-neighbour-problem
description: What a "vCPU" actually is on AWS and Hetzner, why your neighbours can slow your server down, and how burstable CPU credits are calculated — with the maths worked out.
tags:
  - cloud
  - aws
  - hetzner
  - infrastructure
added: 2026-10-22T00:00:00.000Z
---

Every cloud pricing page lists a number next to the word **vCPU**, and most of us read it as "cores". Two vCPUs, two cores, done.

It isn't that simple. Depending on the provider and the instance family, a vCPU can be a full physical core, half of one, or a *slice of time* on a core that a dozen other customers are also using. Two servers that both say "2 vCPU" on the label can differ in real CPU capacity by 5x or more.

This post covers what a vCPU actually maps to, why neighbours on the same host can slow you down, and how AWS's burstable credits and Hetzner's shared plans work, with the arithmetic done for you.

***

## Starting from the hardware: cores and threads

A **physical core** is an actual execution unit on the CPU die, with its own pipeline, registers and L1/L2 cache.

Most Intel Xeon and AMD EPYC chips also support **SMT** (Simultaneous Multi-Threading, branded *Hyper-Threading* by Intel). SMT lets one physical core present itself to the OS as two **hardware threads**. The two threads share the core's execution units and caches. When one thread stalls (say, waiting on memory), the other can use the idle parts of the core.

```plaintext
┌──────────────── Physical core ────────────────┐
│     execution units · L1 · L2 (shared)        │
│                                               │
│   Hardware thread 0       Hardware thread 1   │
└─────────┬───────────────────────┬─────────────┘
          │                       │
        vCPU 0                  vCPU 1
```

The catch is that **two threads are not two cores**. SMT typically adds somewhere around 15–30% extra throughput over a single thread, depending on the workload, not 100%. For CPU-heavy work that already saturates the core (compression, video encoding, tight numeric loops), the second thread adds very little.

On most x86 clouds, **a vCPU is one hardware thread**. So a "2 vCPU" x86 instance is usually *one physical core* with both of its threads.

***

## What a vCPU means on AWS

AWS publishes the exact core and thread layout for every instance type, so you don't have to guess. Picking a few `.large` (2 vCPU) instances:

| Instance | CPU | vCPUs | Physical cores | Threads per core |
| --- | --- | --- | --- | --- |
| `m7i.large` | Intel Xeon (Sapphire Rapids) | 2 | **1** | 2 |
| `m8i.large` | Intel Xeon (Granite Rapids) | 2 | **1** | 2 |
| `t3.large` | Intel Xeon | 2 | **1** | 2 |
| `m7a.large` | AMD EPYC (Genoa) | 2 | **2** | 1 |
| `m8a.large` | AMD EPYC (Turin) | 2 | **2** | 1 |
| `m7g.large` | AWS Graviton3 (Arm) | 2 | **2** | 1 |

So `m7i.large` and `m7a.large` have the same vCPU count and similar prices, but the AMD one gives you **two full physical cores** while the Intel one gives you **one core with two threads**. That's because AWS turned SMT off on its 7th and 8th generation AMD instances, and Graviton (Arm) chips don't have SMT at all.

For single-threaded work the difference is small. For anything that keeps both vCPUs busy, like a build server, a Postgres instance under load, or image processing, the core-per-vCPU instances are noticeably faster for the same "2 vCPU" label.

You can check what you're actually running on from inside the instance:

```shell
lscpu | grep -E "^(CPU\(s\)|Thread|Core|Socket|Model name)"
```

```plaintext
CPU(s):                2
Model name:            Intel(R) Xeon(R) Platinum 8488C
Thread(s) per core:    2
Core(s) per socket:    1
Socket(s):             1
```

`Thread(s) per core: 2` means your vCPUs are hyperthreads of the same core. A caveat: inside a VM, `lscpu` shows whatever topology the hypervisor *chooses* to present. On AWS that matches reality; on other providers treat it as a hint, not proof.

***

## The noisy neighbour problem

In the cloud, your VM is one tenant on a physical machine shared with other people's VMs. You don't know who they are, and you don't control what they run. A **noisy neighbour** is another tenant whose workload degrades yours.

It shows up in a few different ways:

1. **Fighting for CPU time.** On shared-CPU plans, more vCPUs are sold than there are hardware threads on the host. If your neighbours are all busy at the same moment, the hypervisor has to make your VM wait for a turn. Your process is ready to run, but nothing is executing it.
2. **Fighting for the same core.** If your vCPU is a hyperthread and the sibling thread on that core belongs to someone else's busy VM, you're sharing execution units and L1/L2 cache with them. (Outside the burstable T family, AWS doesn't let two instances share a physical core at the same time, which is one reason its x86 sizes start at 2 vCPUs.)
3. **Fighting for the shared stuff.** Even with dedicated cores, every VM on the socket shares the **L3 cache** and **memory bandwidth**. A neighbour streaming through gigabytes of memory can evict your cache lines and slow you down, and no hypervisor setting fully isolates this.
4. **Disk and network.** Local NVMe and the host's NIC are shared too. That's a topic for another post.

The first one is the most common and the easiest to see, because Linux measures it directly as **steal time**.

Here's a toy model of that first one. The host below has 2 cores with 2 threads each, and every VM on it has 2 vCPUs. Each time slice, the hypervisor hands the 4 threads to whichever vCPUs have work, giving priority to whoever has had the least CPU so far. When your vCPU has work but all 4 threads are taken, it waits, and that wait is steal time. Add neighbours, make them busier, then flip to a dedicated plan and compare. Hover over the timeline to see who's running where.

```embed
/embeds/cpu-time-slicing.html
```

### Measuring steal time

Steal time (`st`) is the percentage of time your vCPU *wanted to run* but the hypervisor was running something else. On a quiet, dedicated machine it sits at 0.

```shell
vmstat 1 5
```

```plaintext
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  0      0 412340  51200 913400    0    0     0    12  880 1450 61  6  4  0 29
 2  0      0 412100  51200 913400    0    0     0     8  910 1502 58  7  5  0 30
```

That last column says **29–30% of the time this VM was ready to work, it was waiting on the host**. You'll see the same number as `st` in `top`'s header line, or per-vCPU with `mpstat -P ALL 1` (from the `sysstat` package).

Rough rule of thumb:

* **0–2%** — normal, nothing to worry about.
* **5–10% sustained** — you're feeling it; tail latencies will be worse than they should be.
* **20%+** — either the host is badly oversubscribed or (on AWS T instances) you've run out of CPU credits. More on that next.

A second, simpler signal: run the same CPU benchmark at different times of day.

```shell
sysbench cpu --threads=$(nproc) --time=30 run | grep "events per second"
```

On dedicated cores the number is nearly identical every run. On a shared plan with busy neighbours, a 20–40% swing between morning and evening is not unusual.

***

## Shared CPUs on AWS: the burstable T family

AWS's answer to "most servers are idle most of the time" is the **burstable performance** family: `t2`, `t3`, `t3a`, `t4g` and the newer `t8i`. Instead of giving you a vCPU you can use 100% of the time, AWS gives you a **baseline** percentage of each vCPU, plus a bank of **CPU credits** for bursting above it.

### The CPU credit

AWS defines it precisely:

> **1 CPU credit = 1 vCPU running at 100% for 1 minute.**

Equivalently, one vCPU at 50% for two minutes, or two vCPUs at 25% for two minutes. It's just vCPU-minutes.

Every T instance **earns** credits continuously at a fixed rate and **spends** them based on how busy it is. Both are tracked at millisecond resolution, so a quick 200ms spike costs a tiny fraction of a credit.

```plaintext
credits earned per hour  = baseline % × vCPUs × 60
credits spent per minute = vCPUs × CPU utilisation
```

Unspent credits pile up in a balance, capped at **24 hours' worth of earnings**.

### The numbers

Here are the current-generation sizes (T3, T3a and T4g share the same table; T8i matches for the sizes it has):

| Size | vCPUs | Baseline per vCPU | Credits earned / hour | Max credit balance |
| --- | --- | --- | --- | --- |
| `nano` | 2 | 5% | 6 | 144 |
| `micro` | 2 | 10% | 12 | 288 |
| `small` | 2 | 20% | 24 | 576 |
| `medium` | 2 | 20% | 24 | 576 |
| `large` | 2 | 30% | 36 | 864 |
| `xlarge` | 4 | 40% | 96 | 2304 |
| `2xlarge` | 8 | 40% | 192 | 4608 |

One useful way to read this: **baseline × vCPUs is the amount of CPU you're actually paying for on a sustained basis.**

* `t3.micro` → 2 × 10% = **0.2 of a vCPU**
* `t3.medium` → 2 × 20% = **0.4 of a vCPU** (you're mostly paying for the 4 GB of RAM)
* `t3.2xlarge` → 8 × 40% = **3.2 vCPUs**

And keep in mind that on `t3`/`t3a`/`t8i` those vCPUs are hyperthreads, while on `t4g` (Graviton) each one is a full core.

### Worked example: how long can a `t3.micro` burst?

A `t3.micro` earns 12 credits/hour, which is **0.2 credits/minute**. Suppose it has a full balance of 288 credits.

**Both vCPUs pinned at 100%** (a parallel build, say):

```plaintext
spend = 2 vCPUs × 100% = 2.0 credits/min
earn  =                  0.2 credits/min
net   =                  1.8 credits/min drained

288 ÷ 1.8 = 160 minutes of full burst
```

**One vCPU pinned at 100%** (a single-threaded Node.js process stuck in a hot loop):

```plaintext
spend = 1 vCPU × 100% = 1.0 credits/min
net   =                 0.8 credits/min drained

288 ÷ 0.8 = 360 minutes (6 hours)
```

**Sitting at 4% average** (a typical idle web server):

```plaintext
spend = 2 × 4% = 0.08 credits/min
net   = +0.12 credits/min  → refills from empty in 40 hours
```

What happens when the balance hits zero depends on the **credit mode**.

### Standard mode: you get throttled

In **Standard** mode, once the credits are gone the instance is held to its baseline: 10% of each vCPU on a `t3.micro`. AWS ramps it down gradually rather than hitting a wall, but the end state is a server running at a fifth of a single vCPU.

From inside the VM, that throttling shows up as **steal time**. Your `top` will show something like `us 10%, st 90%`, which is exactly the pattern people misdiagnose as "a noisy neighbour" when it's really an empty credit balance. Check the `CPUCreditBalance` metric in CloudWatch before blaming the host.

T2 is the only family that defaults to Standard. It also gets a small pool of **launch credits** so a fresh instance can boot quickly, and it **loses its whole credit balance** whenever the instance is stopped. T3, T3a, T4g and T8i keep their balance for 7 days after a stop.

### Unlimited mode: you get billed

T3, T3a, T4g and T8i default to **Unlimited** mode. When the earned balance runs out, the instance keeps running at full speed by spending **surplus credits**, which are effectively a loan.

When the CPU drops back below baseline, newly earned credits pay that loan off first. AWS settles up over a **rolling 24-hour window**: if your *average* utilisation over 24 hours is at or below the baseline, you pay nothing extra. If it's above, the surplus is billed at a flat rate:

**$0.05 per vCPU-hour** for Linux instances.

Here's how that adds up for a `t3.micro` (about $7.60/month on-demand in `us-east-1`) running flat out on both vCPUs all day:

```plaintext
credits spent in 24h  = 2 vCPUs × 100% × 60 × 24 = 2,880
credits earned in 24h = 12 × 24                   =   288
surplus               = 2,880 − 288               = 2,592 credits
                      = 2,592 ÷ 60                = 43.2 vCPU-hours

cost = 43.2 × $0.05 = $2.16/day  ≈ $65/month
```

That's **more than 8x the price of the instance itself**, for a server whose two vCPUs are one hyperthreaded core. If a T instance is running hot all the time, Unlimited mode isn't saving you money. It's telling you to move to a fixed-performance instance.

### The middle ground: Flex instances

AWS also sells **Flex** instances (`m7i-flex`, `c7i-flex` and their successors). These don't use credits at all. Each vCPU gets a **40% baseline**, and AWS lets it scale up to full performance most of the time when the host has spare capacity. You pay a bit less than the equivalent non-flex instance and never get a credit bill. The trade-off is that the "scale up" part isn't guaranteed, so they suit web and app servers that idle most of the time, and not batch jobs that need 100% for hours.

***

## Shared CPUs on Hetzner: no credits, just neighbours

Hetzner Cloud takes a simpler approach. There's **no credit system and no baseline percentage**. A shared vCPU can use the whole thread whenever it's free. In Hetzner's own docs, the hypervisor "distributes usage rights of CPU resources among several virtual servers". Your real performance depends entirely on how busy your neighbours are at that moment.

The current lineup splits into three plan families:

| Family | Plans | vCPU type | CPU | Notes |
| --- | --- | --- | --- | --- |
| **Cost-Optimized** | CX23 – CX53 | Shared | Intel / AMD x86, older generation | Cheapest x86; stock is often limited |
| **Cost-Optimized** | CAX11 – CAX41 | Shared | Ampere Altra (Arm64), older generation | No SMT on Ampere, so each vCPU is a whole core |
| **Regular Performance** | CPX02 – CPX62 | Shared | AMD EPYC, latest generation | Faster cores, still shared |
| **General Purpose** | CCX13 – CCX63 | **Dedicated** | AMD EPYC, latest generation | Your vCPUs are reserved for you |

At the time of writing, shared plans start at around **€6/month** (excl. VAT), and dedicated ones at about **€43/month** for a CCX13 with 2 dedicated vCPUs and 8 GB of RAM. Hetzner's prices have changed several times recently, so check the pricing page for current numbers.

A few practical notes:

* **Hetzner's own guidance** is that shared plans are designed for variable usage, not sustained high CPU. They're aimed at dev environments, personal sites and low-to-moderate traffic apps. If you peg a shared vCPU at 100% around the clock, you're both the noisy neighbour *and* exposed to everyone else's noise.
* **Steal time is your only meter.** There's no `CPUCreditBalance` metric to look at. If `st` regularly climbs on a CX or CPX box, that's your cue to move to CCX.
* **"Dedicated vCPU" still doesn't mean "dedicated core".** It means your vCPUs aren't time-shared with other tenants. You still share L3 cache and memory bandwidth with the rest of the host.

If you want actual physical cores with nobody else on the machine, Hetzner's **dedicated root servers** (the AX/EX lines, plus the Server Auction for used hardware) are the next step. You get bare metal, no hypervisor, and zero steal time, which is often cheaper per core than CCX if you can handle managing the hardware yourself.

***

## AWS vs Hetzner, side by side

| Option | Guaranteed CPU | Bursting | When you overuse it |
| --- | --- | --- | --- |
| **AWS T family** | Baseline only (5–40% per vCPU) | Credit-based | Throttled (Standard) or billed (Unlimited) |
| **AWS Flex** | 40% per vCPU | Best-effort, no credits | Falls back toward baseline |
| **AWS fixed (M/C/R)** | 100% | n/a | Nothing |
| **Hetzner CX / CAX / CPX** | None | Best-effort, no credits | Slowed by contention, visible as steal time |
| **Hetzner CCX** | 100% | n/a | Nothing |

***

## So which one should you pick?

* **Mostly idle, occasionally busy** (personal site, small API, cron box, staging): shared/burstable is the right call. A `t4g.small` or a Hetzner CX/CAX will do fine, and you'll never notice the neighbours.
* **Steady, moderate load** (a production web app that's always serving something): look at AWS Flex, or Hetzner CPX, and **watch steal time** for the first few weeks.
* **Sustained high CPU** (CI runners, databases under constant load, video/image processing, game servers): pay for dedicated. On AWS, prefer a family where a vCPU is a full core (`m7a`/`m8a`, `c7a`, Graviton). On Hetzner, go CCX or bare metal.
* **Latency-sensitive** (anything where p99 matters more than average): dedicated, always. Steal time hits tail latency hardest, because a request that lands while your vCPU is waiting for the host just sits there.

And when comparing prices, don't compare vCPU counts across providers or families. Compare **how much of a physical core you're guaranteed**, then decide how much of the rest you're willing to share.

***

*Have questions or ran into something similar? Find me on* *[Twitter](https://twitter.com/harshitbudhraja)* *or leave a comment below.*
