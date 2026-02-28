---
title: "RustedZip: Because Windows shouldn't take minutes to archive"
description: 'Windows zipping is painfully slow. So I built a Rust tool to fix it.'
date: 2026-03-01
tags: ['rust', 'productivity', 'windows', 'rustedzip']
---

If you've ever used a Mac or Linux, you know zipping a folder is basically instant. You hit compress, and it's done.

Then I moved to Windows for a project and reality hit me. Zipping a few gigs of data through the built-in Explorer tool? Minutes. Sometimes it straight up hangs. It's a complete productivity killer.

I couldn't stand it anymore. So I vibe-coded a high-performance tool in Rust to handle it properly.

## Why Windows is Slow

The default Windows zip utility seems to run on a single thread and handles I/O very conservatively. When you have thousands of small files, the overhead of the UI and the sequential processing just kills the speed.

## The Solution: Rusted ZIP

I designed the architecture and let AI help me fill in the heavy Rust lifting. The goal was simple: use every CPU core I have and stop wasting time on slow I/O.

### 1. Parallelism with Rayon
Instead of zipping one file at a time, I used `rayon`. It reads multiple files into memory across all my CPU cores simultaneously. This alone makes it 3-5x faster than the default tool.

### 2. Buffered I/O
I used `BufReader` and `BufWriter` everywhere. Reading and writing in chunks instead of tiny individual calls saves a massive amount of system overhead.

### 3. Release Optimization
I tuned the `Cargo.toml` for maximum performance. Using `lto = true` (Link Time Optimization) and `codegen-units = 1` makes the binary tiny and incredibly fast.

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
```

## The "Vibe" Integration

A tool is only useful if it's easy to use. I didn't want to open a terminal every time I needed to zip a folder.

I wrote a PowerShell script that edits the Windows Registry to add "Rusted ZIP" directly to the right-click context menu. Now I just right-click a folder, hit "Rusted ZIP: Compress" and it's done in seconds.

The script uses .NET calls (`Microsoft.Win32.Registry`) to bypass the usual PowerShell registry bugs. It's clean and it works.

## How to Set It Up

If you want to try it, here is the setup:

1. **Place the binary:** Copy your compiled `rustedzip.exe` to `C:\Tools\rustedzip\`.
2. **Install the Menu:** Run the `Install-RustedZip.ps1` script as an Administrator.

```powershell
# Run as Administrator
.\Install-RustedZip.ps1
```

Once installed, restart Explorer or just right-click something. You'll see the new options.

## Try it yourself

RustedZip is fully open-source. You can grab the code or the binary from the repository here: [github.com/Super-Kenil/rustedzip](https://github.com/Super-Kenil/rustedzip)

## Still an Experiment

This is still very much an experimental project. It's not a final "product" yet, and I'll be improving it over time to make it a solid alternative to the existing tools.


## The Result

I went from waiting 5-15 minutes for a zipping to under 2-3 seconds.

It's not just about the seconds saved. It's about not breaking your "flow" state because your operating system is decidely slow.

Your OS should work for you, not the other way around.
