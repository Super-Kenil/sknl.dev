---
title: 'Lazy Load Without Killing Your UX'
description: "Clicking a button shouldn't feel like a chore. Discover how to eliminate 'ghost delays' in your React apps by decoupling dialog state from content loading for a buttery-smooth, high-performance interface."
date: 2026-04-05
tags: ['react', 'architecture', 'performance', 'ux']
---

The problem with lazy loading dialogs is simple: code splitting ruins UX. You click a button, nothing happens for 200ms, then the dialog pops up. Users hate that delay.

But if you pre-load everything, you defeat the purpose of lazy loading.

So how do you get the best of both worlds?

The answer: open the dialog instantly, then load the content while it's opening.

## The Pattern

Here's the core idea. You have a **stateless dialog layer** powered by a state manager (Zustand, Redux, Jotai, Context, whatever you use). When a user clicks a button, you just update a store. The dialog opens immediately. Meanwhile, the content is being fetched and rendered inside.

```typescript
// src/stores/use-dialogs.ts
import { create } from 'zustand'
import { startTransition } from 'react'

type DialogStoreType = {
  dialogName: string | null
  open: (name: string) => void
  close: () => void
}

export const useDialogs = create<DialogStoreType>((set) => ({
  dialogName: null,
  open: (name) => { 
    startTransition(() => {
      set({ dialogName: name })
    })
  },
  close: () => {
    startTransition(() => {
      set({ dialogName: null })
    })
  }
}))
```

That's it. No extra state, no flags. Just the dialog name.

Now the container:

```typescript
// components/dialogs-root.tsx
'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useDialogs } from '@/stores/use-dialogs'
import { Dialog, DialogContent } from '@/ui/dialog'

const FirstDialog = dynamic(() => import('./first-dialog'))
const SecondDialog = dynamic(() => import('./second-dialog'))

export function DialogsRoot() {
  const { dialogName, close } = useDialogs()

  return (
    <Dialog open={!!dialogName} onOpenChange={close}>
      <Suspense fallback={<DialogContent>Loading...</DialogContent>}>
        {dialogName === 'first' && <FirstDialog />}
        {dialogName === 'second' && <SecondDialog />}
      </Suspense>
    </Dialog>
  )
}
```

The magic is the `Suspense` boundary. When you open the dialog, the Dialog component renders instantly with the animation. While that animation is happening, React is loading the actual dialog content in the background.

## In Your Component

Usage is dead simple:

```typescript
const openDialog = useDialogs((store) => store.open)

return (
  <button onClick={() => openDialog('first')}>
    Open Dialog
  </button>
)
```

Click happens → store updates → dialog opens immediately → content loads while animating.

## Why This Works

1. **Instant UI feedback:** The dialog pops up right away. Users know their click worked.
2. **The animation buys time:** By the time the dialog animation finishes (usually 200-300ms), the content is already loaded. Users see a smooth experience.
3. **Lazy loading still works:** You're only downloading dialog bundle when it's needed.
4. **Handles slow networks:** If content takes longer than the animation, the Suspense fallback shows a loading state. Users aren't left confused.

The key insight: **don't show loading until there's actually something to load**. Most of the time, the content arrives before the animation ends anyway.

## The Fallback

When you do need a loading indicator, keep it minimal:

```typescript
<Suspense fallback={
  <DialogContent>
    <div className='flex items-center justify-center min-h-80'>
      <Spinner />
    </div>
  </DialogContent>
}>
  {/* dialogs here */}
</Suspense>
```

Users only see this if the network is genuinely slow. On a normal connection, it's invisible.

## The Real Win: Pages With Many Dialogs

Here's the thing that really matters at scale. If you have a page with 10 dialogs, forms, or confirmation dialogs, you don't want to download the code for all 10 upfront.

With this pattern, you only download what the user actually opens. If they never touch the "Advanced Settings" dialog, that bundle never gets downloaded. Same with "Delete Confirmation", "Invite User", whatever else you've got.

On a page with 10+ dialogs, this can easily save 50-100KB of JavaScript. That's real time on mobile networks.

The user doesn't wait for code they'll never use. The page loads faster. And when they do click a button, the dialog opens instantly while that specific dialog loads.

It's code splitting at its best.

## One More Thing

If you have a dialog that needs its own internal state (like a form), those still work fine. Just handle the state inside the dialog component itself. The stateless part is just about which dialog is active, not how it works internally.

This pattern scales. I have 10+ dialogs in production using this exact approach. No friction, no performance hit, and users think everything loads instantly.
