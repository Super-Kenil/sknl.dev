---
title: 'Ship It. Fix It Later.'
description: 'Why shipping fast beats shipping perfect, and why that unshipped feature is worthless.'
date: 2026-02-08
tags: ['productivity', 'shipping']
---

I spent three weeks perfecting a feature no one asked for.

The code was beautiful. Types everywhere. Edge cases handled. Error messages that would make any developer weep with joy.

Then I shipped it. No one used it.

## Perfection Is a Lie You Tell Yourself

Here's the uncomfortable truth: that "perfect" version in your head doesn't exist. It's a moving target. Every time you get close, you'll find something else to fix.

- "Just one more refactor"
- "Let me handle this edge case"
- "The animation could be smoother"
- "What if the user does X?"

Meanwhile, your users are waiting. Or worse, they've moved on.

## The Feature That Ships Wins

An imperfect feature in production is infinitely more valuable than a perfect feature in your local branch.

Why? Because:

1. **You can't get feedback on something no one has used.** All your assumptions about what users want are just that—assumptions. Ship it, watch what happens, then adjust.

2. **Real users break things in ways you never imagined.** That edge case you spent two days on? Never happens. That thing you thought was fine? Crashes for everyone.

3. **Done is a feature.** Shipping gives you momentum. It gives your users something to react to. It moves the project forward.

## The Unshipped Feature Is Worthless

I need you to really internalize this: **code that hasn't shipped has zero value.**

It doesn't matter how clean it is. It doesn't matter how many tests you wrote. If it's sitting in a branch, it's not helping anyone. It's not generating feedback. It's not solving problems.

It's just bytes on a disk.

## Ship First, Polish Later

Here's the workflow that actually works:

1. Build the simplest version that solves the problem
2. Ship it
3. Watch how people use it (or don't)
4. Fix what's actually broken
5. Repeat

Notice step 4: fix what's *actually* broken. Not what you *think* might break. Not what *could theoretically* go wrong. What's actually broken, based on real usage.

## But What About Quality?

I'm not saying ship garbage. I'm saying ship *good enough*.

- Does it work? Ship it.
- Is it secure? Ship it.
- Will it crash the production database? Maybe don't ship that.

The bar isn't perfection. The bar is "does this solve the user's problem well enough that they can give me feedback?"

## The 80/20 of Shipping

80% of the value comes from 20% of the effort. That last 20% of polish? It takes 80% of the time and delivers diminishing returns.

Ship at 80%. Get feedback. Then decide if that remaining 20% even matters.

Most of the time, it doesn't.

## Your Users Will Tell You What to Fix

Stop guessing. Stop polishing in the dark. Ship it, put it in front of real humans, and let them tell you what's wrong.

They'll surprise you. The thing you thought was critical? They don't care. The thing you almost skipped? They can't live without it.

You can't learn this from your IDE. You learn it by shipping.

## The Takeaway

Perfection is a delusion. Shipping is the goal.

That feature sitting in your branch? It's not helping anyone. Push it. Deploy it. Get it in front of users.

You can always fix it later. But you can't get feedback on something no one has ever seen.

Ship it.
