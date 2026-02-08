---
title: 'I Stopped Using Lodash (Mostly)'
description: 'Native JavaScript has come a long way. Here is what I replaced.'
date: 2026-01-10
tags: ['javascript']
---

Lodash was my safety blanket for years. Need to deep clone? Lodash. Debounce? Lodash. Check if something is empty? You guessed it.

Then I realized I was importing 70KB for functions JavaScript already has.

## What I Replaced

### Array Methods

```js
// Before
import { map, filter, find } from 'lodash';
const result = filter(users, u => u.active);

// After - just use native
const result = users.filter(u => u.active);
```

Native `map`, `filter`, `find`, `some`, `every`, `reduce` - they've been around forever. No import needed.

### Object Spread Instead of Merge

```js
// Before
import { merge } from 'lodash';
const config = merge({}, defaults, userConfig);

// After
const config = { ...defaults, ...userConfig };
```

For shallow merges, spread works fine. For deep merges... okay, sometimes I still use Lodash.

### Optional Chaining Instead of Get

```js
// Before
import { get } from 'lodash';
const city = get(user, 'address.city', 'Unknown');

// After
const city = user?.address?.city ?? 'Unknown';
```

Optional chaining (`?.`) and nullish coalescing (`??`) are built into JavaScript now. Use them.

### Object.entries Instead of forEach/Object

```js
// Before
import { forEach } from 'lodash';
forEach(obj, (value, key) => console.log(key, value));

// After
Object.entries(obj).forEach(([key, value]) => console.log(key, value));
```

## What I Still Use Lodash For

- `debounce` and `throttle` - The native ones are messier
- `cloneDeep` - When I actually need deep cloning
- `groupBy` - Native `Object.groupBy` exists but browser support is still catching up

## The Point

It's not about hating Lodash. It's about not importing a utility library for things your language already does.

Check what you're actually using. You might be surprised how much you can drop.

Your bundle size will thank you.
