---
title: "RustedZip: Because Windows shouldn't take minutes to archive"
description: 'Windows zipping is painfully slow. So I built a Rust tool to fix it.'
date: 2026-03-01
updatedDate: 2026-11-26
tags: ['rust', 'productivity', 'windows', 'rustedzip']
faqs:
  - question: 'What is RustedZip?'
    answer: 'RustedZip is an open-source, multi-threaded Windows archiving CLI and right-click Explorer utility written in Rust by Kenil Sudani to compress folders with many files in seconds instead of minutes.'
  - question: 'Why is RustedZip faster than built-in Windows Explorer zipping?'
    answer: 'Unlike the sequential, UI-bound built-in Windows compression flow, RustedZip uses Rayon to read files across CPU cores in parallel, BufReader and BufWriter for buffered I/O, and release LTO compiler optimizations.'
  - question: 'Where can I download RustedZip?'
    answer: 'The source code and Windows installation script (Install-RustedZip.ps1) are open source on GitHub at https://github.com/Super-Kenil/rustedzip.'
---

**RustedZip** is an open-source, multi-threaded Rust archiving tool built for Windows by [Kenil Sudani](/about). By combining `rayon` parallelism, buffered file I/O, and Windows Explorer right-click integration, it compresses multi-gigabyte folders of small files in seconds instead of the minutes built-in Windows Explorer often takes.

If you've ever used a Mac or Linux, you know zipping a folder is basically instant. You hit compress, and it's done. Then I moved to Windows for a project and reality hit me: zipping a few gigs of data through the built-in Explorer tool took minutes and sometimes hung completely.

## Why Default Windows Zipping Feels Slow

The built-in Windows Explorer compression flow runs conservatively on I/O and UI progress updates. When a folder contains thousands of small source files or assets, sequential file reads and shell overhead dominate the runtime.

## How RustedZip Is Engineered

| Optimization Layer | Implementation | Purpose |
|---|---|---|
| **Parallelism** | `rayon` crate | Reads multiple files into memory concurrently across CPU cores |
| **Buffered I/O** | `BufReader` &amp; `BufWriter` | Reduces tiny syscall overhead during archive reads/writes |
| **Release Binary Profile** | `opt-level = 3`, `lto = true`, `codegen-units = 1` | Maximizes throughput and keeps the compiled executable compact |
| **Shell Integration** | PowerShell + `Microsoft.Win32.Registry` | Adds right-click `"Rusted ZIP: Compress"` directly in Explorer |

### 1. Parallelism with Rayon
Instead of processing one file at a time, `rayon` reads multiple files concurrently across available CPU cores.

### 2. Buffered I/O
Using `BufReader` and `BufWriter` batches disk operations instead of issuing tiny unbuffered reads and writes for every small chunk.

### 3. Release Optimization
The `Cargo.toml` release profile enables Link Time Optimization (`lto = true`), single codegen unit, and `opt-level = 3`:

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
```

## Windows Explorer Right-Click Integration

A CLI tool only saves time if it fits your daily workflow. I wrote a PowerShell script (`Install-RustedZip.ps1`) using .NET `Microsoft.Win32.Registry` APIs to add RustedZip directly to the Windows Explorer right-click context menu.

## How to Set Up RustedZip on Windows

1. **Place the binary:** Copy your compiled `rustedzip.exe` to `C:\Tools\rustedzip\`.
2. **Install the context menu:** Run the PowerShell installer script as an Administrator:

```powershell
# Run as Administrator
.\Install-RustedZip.ps1
```

Once installed, right-click any folder in Explorer to compress it without opening a terminal.

## Open Source Repository

RustedZip is an experimental open-source tool. You can inspect the Rust code or grab releases on GitHub: [github.com/Super-Kenil/rustedzip](https://github.com/Super-Kenil/rustedzip), or explore other utilities on the [projects page](/project).

## My Practical Result

On my own multi-gigabyte project folders on Windows, archiving dropped from 5–15 minutes in Explorer down to roughly 2–3 seconds—keeping my workflow moving without waiting on the OS.
