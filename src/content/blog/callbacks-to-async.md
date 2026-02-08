---
title: 'From Callback Hell to Async/Await'
description: 'The journey every JavaScript developer takes eventually.'
date: 2026-01-03
tags: ['javascript', 'async']
---

If you've been writing JavaScript long enough, you've lived through three eras of async code. Let me walk you through my journey.

## Era 1: Callback Hell

My first real project had code like this:

```js
getUser(userId, function(err, user) {
  if (err) handleError(err);
  getOrders(user.id, function(err, orders) {
    if (err) handleError(err);
    getOrderDetails(orders[0].id, function(err, details) {
      if (err) handleError(err);
      // Finally, do something with the data
      // But we're already 4 levels deep
    });
  });
});
```

The infamous pyramid of doom. Error handling everywhere. Logic buried under indentation.

## Era 2: Promises

Then Promises came and it felt revolutionary:

```js
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => {
    // Do something with details
  })
  .catch(handleError);
```

Flat! Chainable! One error handler! This felt like the future.

But chaining got messy when you needed values from earlier in the chain:

```js
getUser(userId)
  .then(user => {
    // I need 'user' later, but the next .then only gets 'orders'
    return getOrders(user.id).then(orders => ({ user, orders }));
  })
  .then(({ user, orders }) => {
    // Now I have both, but this is getting ugly again
  });
```

## Era 3: Async/Await

Then came the game changer:

```js
async function loadUserData(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);

    // All values available, reads like sync code
    return { user, orders, details };
  } catch (err) {
    handleError(err);
  }
}
```

It's just... readable. Variables are available where you need them. Error handling is clean. It looks like the synchronous code we all learned first.

## Tips From Experience

### Don't Forget It's Still Promises

`async/await` is syntactic sugar. Under the hood, it's promises. You can mix them:

```js
const results = await Promise.all([
  fetchUsers(),
  fetchProducts(),
  fetchOrders()
]);
```

### Parallel vs Sequential

```js
// Sequential - slower
const a = await fetchA();
const b = await fetchB();

// Parallel - faster
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

Only await sequentially when you need to.

### Error Handling Matters

```js
// Option 1: try/catch blocks
try {
  const data = await fetchData();
} catch (err) {
  // Handle it
}

// Option 2: .catch() on the promise
const data = await fetchData().catch(err => defaultValue);
```

Pick what reads best for your use case.

## The Point

Each era solved real problems. Callbacks were fine until they weren't. Promises fixed chaining. Async/await fixed readability.

Write async code that future you can understand. Usually that means async/await.
