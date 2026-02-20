---
title: "Your AI isn't bad, your context is"
description: 'Stop fighting your AI. Start engineering it. Here is how I 2x my productivity.'
date: 2026-02-15
tags: ['ai', 'productivity', 'antigravity']
---

I used to spend half my day refactoring what AI wrote in my codebase. It would suggest patterns I hated, hallucinate libraries, or dive into my code before it even understood what I wanted.

Then I stopped treating it like a magic wand and started treating it like an intern that needs a handbook. My productivity literally doubled.

Here is how I fixed it.

## 1. Thinking Before Building (Plan Mode)

The biggest mistake is letting an AI touch your code the second you hit enter.

[Antigravity's Planning Mode](https://antigravity.google/docs/agent-modes-settings) changed everything. It forces the agent to explore the codebase and write a plan *before* it edits a single file.

Its specially useful for long running jobs or complex tasks. It splits the job into smaller tasks and it separates the "thinking" from the "building.". No more "wait, why did you delete that file?" moments.

## 2. Framework DNA (Skills)

You can't expect an LLM to know your specific project conventions out of the box.

I started adding framework-specific knowledge via [Skills from skills.sh](https://skills.sh/). These are reusable knowledge packs for Next.js, React, or Astro.

I especially like using `vercel-labs/agent-skills/web-design-guidelines` when working with UI, cause I don't want AI to generate common violet gradients everytime.

With this, instead of generic "internet code," I get code that follows the exact performance optimizations and conventions of the framework I'm actually using. It's like giving the AI a custom brain for the tech stack.

## 3. The Unsung Rules (Workflows)

Every project has "unsung rules." The things you just *know* not to do, but aren't in the product docs.

I codified these into [Rules and Workflows](https://antigravity.google/docs/rules-workflows). Now, the AI knows exactly:
- How I handle error states.
- Where specific components go.
- Which libraries are banned.
- My specific project structure.

## The Strategy

Beyond tools, I use five practices to stop AI slop and build bug-free apps:

1. **Guard Rails:** Scaffold with Shadcn. It gives the AI a foundation. No more guessing themes or UI patterns.
2. **Persistent Memory:** Use Antigravity Rules. Store project goals, tech stack, and API details. These act as long-term memory for your agent.
3. **Plan First:** This is the most important one. Use "Plan Mode" to think before building. Separate reasoning from execution. Alignment saves hours of debugging.
4. **Skill Packs:** Install framework Knowledge from [skills.sh](https://skills.sh/). Never code in a vacuum.
5. **Git Checkpoints:** Commit after every success. If the AI breaks it? Revert. Don't debug the AI just reset it.

## The Point

Your AI is a reflection of the context you provide. Garbage in, garbage out. Give it rules, skills, and a solid plan, and it becomes a force multiplier.

