---
title: 'RAG is just a fetch call before your prompt'
description: 'Retrieval Augmented Generation sounds complex, but for JS devs, it is just a fetch call before your prompt.'
date: 2026-03-22
tags: ['ai', 'rag', 'llm', 'javascript']
---

Everyone is talking about RAG (Retrieval Augmented Generation) like it is some dark magic. But if you are a JavaScript dev, you can think of it as a simple "middleware" for your AI prompts.

The problem with LLMs like GPT or Claude is that they have a cutoff date. They don't know about your private files, your new database entries, or what happened ten minutes ago.

RAG fixes this by giving the AI a temporary "brain" before it answers.

## How it works (The JS perspective)

Imagine you are building a support bot for your company. Instead of just sending the user's question to the AI, you do this:

1. **The Search:** You take the user's question and search your own database (usually a vector DB like Pinecone or pgvector) for relevant docs.
2. **The Context:** You grab the text from those docs.
3. **The Prompt:** You send a massive string to the AI that looks like this:
   *"Use this info: [Your Docs] to answer this question: [User Question]"*

It is basically a `fetch()` call for context before you hit the AI endpoint.

## The Three Main Steps

### 1. The Retrieval
This is just a similarity search. But instead of searching for keywords, we use "embeddings" which basically turn text into an array of numbers (vectors). It allows you to search for the *meaning* of a sentence.

### 2. The Augmentation
You take the search results and "augment" your prompt. You are literally just concatenating strings.

### 3. The Generation
The AI takes your soup of context and generates a response. Since it has the "facts" right there in the prompt, it is much less likely to hallucinate (make stuff up).

## Why you should care

*   **No Retraining:** You don't need to fine-tune a model (which is expensive and slow).
*   **Up-to-date:** If you update your database, the AI "knows" immediately because it fetches that info on every request.
*   **Privacy:** You can keep your private data on your own servers and only send specific parts to the AI when needed.

RAG is basically just turning an AI into a researcher who reads your project's docs before opening their mouth. If you can handle strings and API calls, you can build a RAG pipeline.
