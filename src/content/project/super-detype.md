---
order: 1
title: 'super-detype'
description: 'Strips out TS definitions and syntax from your WHOLE project'
image: '../../assets/images/npm.png'
url: 'https://super-detype.superkenil.com'
gitUrl: 'https://github.com/Super-Kenil/super-detype'
techStack: 'Typescript,fs,Babel,Esbuild'
---

Ever had to create JavaScript examples from a TypeScript project? You know the pain. Manually stripping types, removing interfaces, dealing with type assertions scattered everywhere. I got tired of doing this repeatedly, so I built a tool that does it for me.

super-detype is a CLI tool that transpiles your entire TypeScript project to JavaScript. Not just individual files - your whole project, preserving the directory structure. It's powered by Babel and esbuild under the hood, so the output is clean and reliable.

I mainly built this for creating JS examples from my TS codebases. Documentation sites, tutorials, quick demos - sometimes you just need vanilla JS versions. It handles React, Next.js, Remix, and Vite projects without breaking a sweat.

Install it globally via npm and run it from anywhere. Two arguments: source directory and output directory. That's it. No config files, no complex setup. Just works.
