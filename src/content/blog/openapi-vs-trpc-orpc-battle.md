---
title: 'OpenAPI vs. The Ecosystem: Why oRPC is Chasing the tRPC Crown'
description: "Type safety shouldn't mean sacrificing standards. tRPC gave us the DX, but oRPC is bringing the spec. A no-nonsense breakdown of the four ways we fetch data today and why the 'o' in oRPC is a game changer."
date: 2026-03-15
tags: ['typescript', 'trpc', 'orpc', 'openapi', 'web-development', 'api-design', 'react-query', 'backend']
---

Fetching data used to be simple but now there are so many ways people tell you to do it. I was watching a video about this recently and it really cleared things up.

Here is the breakdown so you don't have to watch it or read those long boring corporate blogs.

## 1. Raw API Requests
This is the old school way. You use fetch or TanStack Query and manually write your TypeScript types on the client side.

Pros:
* Complete control over your URLs
* You can choose HTTP methods and response payloads exactly how you want

Cons:
* No automatic type safety between frontend and backend
* If the backend changes something your frontend breaks and you wont know until it crashes
* You have to manually set up auth and validation with things like Zod

## 2. Server Functions
This is the framework specific magic stuff like createServerFunction. You write backend logic right inside your frontend code.

Pros:
* End to end type safety happens automatically
* Makes SSR data fetching really simple
* Built in validation

Cons:
* Zero control over what the URL actually looks like
* You are locked into that framework. Nextjs stuff wont work in TanStack

## 3. tRPC
This one is huge right now. It is built on top of React Query and gives you end to end type safety.

Pros:
* Amazing type safety routing from server to client
* Great parameter validation and protected procedures for auth
* Easy to share types across a monorepo for things like React Native

Cons:
* Does not follow external standards like OpenAPI out of the box so you can't easily share your API with other teams

## 4. oRPC
This is the newer competitor to tRPC and it focuses heavily on standardization.

Pros:
* Full control over URLs and methods
* Built in Zod integration for input validation
* Native OpenAPI support

With oRPC you can automatically generate an openapi.json file. You can put that right into Postman to test or use it to generate clients for Go or Rust. That is massive if you have external API clients.

## Final Verdict
What should you actually use?

* Raw APIs if you need maximum control
* Server Functions if you just want simplicity and are locked to a framework anyway
* tRPC for robust internal apps where you want type safety everywhere
* oRPC if you need type safety but also need OpenAPI compliance for external clients

Pick the one that fits your project and start building.
