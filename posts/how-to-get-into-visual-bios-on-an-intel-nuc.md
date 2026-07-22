---
title: How to get into Visual BIOS on an Intel NUC that won't output video signals
slug: how-to-get-into-visual-bios-on-an-intel-nuc
description: Blank screen while trying to get into BIOS on an Intel NUC5i5MYBE with Mini DisplayPort? Use the Power Button Menu to boot straight into Visual BIOS without racing the display.
tags:
  - homelab
  - intel-nuc
  - bios
  - proxmox
added: 2026-07-23T00:00:00.000Z
---

If you run an **Intel NUC5i5MYBE** in a homelab, you've probably hit this: the machine POSTs and boots your OS just fine, but the moment you actually need to get into BIOS, the screen stays completely blank. No splash logo, no signal, nothing — even though the same monitor and cable show your OS shell perfectly once it's booted.

***

## The setup

- **Model:** Intel NUC5i5MYBE
- **Display output:** No HDMI or VGA port on this board — only **two Mini DisplayPort outputs**
- **Symptom:** Blank/no-signal screen during POST and BIOS, but the display comes up normally once Proxmox (or any OS) finishes booting
- **Behavior:** Intermittent, not a hard failure — it would occasionally work, which ruled out a dead port or bad cable

***

## Why this happens

This is a POST-stage video initialization issue tied to how DisplayPort link-training works. Mini DP requires a negotiation handshake between the GPU and the monitor before anything can be displayed. Early in POST, before OS/GPU drivers are loaded, that handshake window is short and timing-sensitive. If the monitor hasn't fully "woken" its DP input in time, BIOS's video output gets missed entirely — even though the port and cable are otherwise fine, which is exactly why the OS-level display works consistently but BIOS doesn't.

Swapping cables, swapping ports, and even swapping monitors won't reliably fix this, because the root cause is the timing of DP link-training at POST, not the physical connection.

***

## The fix: use the Power Button Menu, skip the display race entirely

Since you can't rely on catching the BIOS video output in time, the workaround is to bypass needing to *see* anything during the timing-sensitive part of POST:

1. **Power off the NUC completely.**
2. **Press and hold the power button for about 3 seconds**, until the power LED turns **orange/amber** (on some units this is accompanied by 3 beeps).
3. At this point, even though the screen is still showing nothing, **press F2** on your keyboard.
4. The NUC boots directly into **Visual BIOS** — and once it's loaded, the display reliably shows up, since Visual BIOS doesn't have the same tight link-training window as early POST.

This works because the Power Button Menu waits indefinitely for input rather than requiring a precisely-timed keypress during the standard POST video window — so you don't need to see anything on screen to trigger it correctly.

***

## A note on keyboards

If you're using a wireless keyboard (like an MX Keys Mini with a USB dongle), be aware that some NUCs have a narrow legacy USB initialization window during early POST, which can make F-key presses unreliable at that exact moment. The Power Button Menu method sidesteps this too, since it isn't racing against the same narrow window.

***

## Recap

| Problem | Fix |
|---|---|
| No video signal during POST/BIOS over Mini DP | Don't rely on timing — use the Power Button Menu |
| Hold power button 3s until LED turns orange | Then press **F2** blind, on the invisible screen |
| Display comes back once Visual BIOS loads | Confirms it's a POST-stage DP link-training issue, not a hardware fault |

If your NUC has no HDMI port and only Mini DP outputs, keep this sequence handy — it's the most reliable way in without needing a hard-timed keypress during a screen that isn't showing anything yet.
