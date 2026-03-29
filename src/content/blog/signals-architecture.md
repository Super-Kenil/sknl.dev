---
title: 'Signals: The end of the "re-render everything" era'
description: 'Every framework is moving to signals. Here is why you should care and how they actually work.'
date: 2026-03-28
tags: ['javascript', 'signals', 'reactivity', 'frontend']
---

If you have spent any time with React, you know the pain of `useState` and the constant battle against unnecessary re-renders. You change one tiny string and suddenly your entire component tree is recalculating.

Signals are here to fix that. They are the biggest shift in how we handle state since hooks arrived.

## What is a Signal?

Think of a Signal as a supercharged variable. It doesn't just hold a value; it knows exactly who is looking at it.

In a traditional setup, when a value changes, the framework has to guess what needs to be updated. With Signals, the value *tells* the specific part of the UI to update. No diffing overhead here.

## The Two Main Parts

Signals architecture is basically just two things:

1. **The Signal:** This is your data. It has a getter and a setter. When you read it, it remembers you.
2. **The Effect:** This is a function that runs whenever the data changes. It could be a DOM update or a console log.

It is a clever version of the "Observer" pattern. When an Effect runs, it signs up as a subscriber to any Signal it touches. When the Signal updates, it just pings its subscribers and says "hey, I changed, run your function again."

## Why this is better than useState

*   **Fine-grained updates:** If you have a signal inside a `<div>`, only that `<div>` updates. Not the parent, not the children, just that one spot.
*   **No Dependency Arrays:** Say goodbye to `[prop1, prop2]` in your `useEffect`. Signals track dependencies automatically. If you use it, it is tracked.
*   **Use it anywhere:** You don't have to be inside a component to use a Signal. You can define your state in a separate file and share it across your whole app effortlessly.

## The Future is Signal based

Angular, Vue, SolidJS, and Preact have already jumped on this. There is even a proposal to make Signals a built-in part of the JavaScript language (TC39).

Most frameworks are moving away from "re-render everything" and toward "only update what changed." If you are a JS dev, you are going to be seeing a lot more of these in the next year.

It is simpler code, faster apps, and a lot less debugging of memoization bugs.
