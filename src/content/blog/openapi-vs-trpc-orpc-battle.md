---
title: 'OpenAPI vs. The Ecosystem: Why oRPC is Chasing the tRPC Crown'
description: "Type safety shouldn't mean sacrificing standards. tRPC gave us the DX, but oRPC is bringing the spec. A no-nonsense breakdown of the four ways we fetch data today and why the 'o' in oRPC is a game changer."
date: 2026-03-15
updatedDate: 2026-11-26
tags: ['typescript', 'trpc', 'orpc', 'openapi', 'web-development', 'api-design', 'react-query', 'backend']
faqs:
  - question: 'What is the main difference between tRPC and oRPC?'
    answer: 'Both tRPC and oRPC provide end-to-end TypeScript type safety from backend to frontend, but oRPC also gives you native OpenAPI specification generation and explicit URL/HTTP method control for external or multi-language API consumers.'
  - question: 'When should you choose oRPC over Server Functions or raw fetch?'
    answer: 'Choose oRPC when you want TypeScript type safety and Zod validation while still needing standard REST/OpenAPI endpoints for Postman testing, third-party integrations, or non-TypeScript clients such as Go or Rust.'
  - question: 'When is tRPC still the better choice?'
    answer: 'tRPC remains a great fit for TypeScript monorepos (such as Next.js plus React Native) where every API consumer lives inside your own codebase and you do not need to publish an external OpenAPI specification.'
---

**Quick answer:** Use **raw `fetch`** when you want full manual HTTP control, **Server Functions** for simple framework-coupled SSR, **tRPC** for internal TypeScript monorepos, and **oRPC** when you want end-to-end TypeScript safety **plus** native OpenAPI spec generation for external or multi-language clients.

Fetching data used to be simple, but modern TypeScript apps now pick between four main approaches. Here is the practical breakdown without the corporate fluff.

## Comparison: Raw API vs. Server Functions vs. tRPC vs. oRPC

| Approach | End-to-End Type Safety | OpenAPI Support | URL &amp; Method Control | Framework Lock-In | Best For |
|---|---|---|---|---|---|
| **Raw API (`fetch` / TanStack Query)** | Manual | Optional (manual) | Full | None | Custom REST/GraphQL APIs |
| **Server Functions** | Automatic | None | None | High (Next.js / TanStack) | Simple full-stack framework apps |
| **tRPC** | Automatic | Third-party plugins only | RPC conventions | Low (TS ecosystems) | Internal TypeScript monorepos |
| **oRPC** | Automatic (with Zod) | Native (`openapi.json`) | Full | Low | Type-safe APIs needing OpenAPI specs |

## 1. Raw API Requests
This is the classic approach: use `fetch` or TanStack Query and maintain your request/response TypeScript types on the client.

**Pros:**
* Complete control over your URLs
* Full choice over HTTP methods and response payloads

**Cons:**
* No automatic type safety between frontend and backend
* Backend changes can silently break the frontend until runtime
* Requires wiring up auth and schema validation manually (for example with Zod)

## 2. Server Functions
Framework-coupled helpers such as `createServerFunction` let you write server logic right alongside frontend code.

**Pros:**
* Automatic end-to-end type safety
* Straightforward SSR data fetching
* Built-in input validation patterns

**Cons:**
* Little to no control over generated endpoint URLs
* Tightly coupled to a specific framework (Next.js patterns do not port directly to TanStack)

## 3. tRPC
tRPC pairs naturally with React Query to give TypeScript teams instant client-to-server type inference.

**Pros:**
* Strong type safety from router procedures to React hooks
* Clean parameter validation and protected middleware procedures for auth
* Easy type sharing across a monorepo (including React Native)

**Cons:**
* Does not follow external standards like OpenAPI out of the box, making it harder to expose the API to external teams or non-JS clients

## 4. oRPC
oRPC targets the same developer experience as tRPC while prioritizing HTTP and OpenAPI standards.

**Pros:**
* Full control over REST-style URLs and HTTP methods
* Built-in Zod integration for input and output validation
* Native OpenAPI support out of the box

With oRPC, you can generate an `openapi.json` document directly from your procedures and import it into Postman or generate typed clients for Go, Rust, or Python. That is a major advantage once external clients enter the picture.

## Final Verdict: Which Should You Choose?

* **Raw APIs** if you need maximum custom HTTP control
* **Server Functions** if you want simplicity inside one full-stack framework
* **tRPC** for internal TypeScript monorepos where every consumer shares types
* **oRPC** if you want tRPC-grade TypeScript DX while staying OpenAPI-compliant for external or multi-language clients

Pick the one that matches who consumes your API and start shipping.
