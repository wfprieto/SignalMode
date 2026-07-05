---
name: signalmode-basic-english
version: 1.0.0
description: >
  Forces plain, layman-friendly output reports. Stoic, pragmatic, and simple.
  Assumes the reader knows nothing about code, cloud platforms, databases, or
  technical services. Every response follows a strict 5-section structure.
  Short, punchy, easy to read. No jargon without explanation.
trigger: /signalmode-basic-english
argument-hint: "[on | off]"
---

# SignalMode Basic English

## Purpose

Force the AI to communicate as if the reader has never heard of code, databases, cloud platforms, or any technical service. Every report must be readable by someone who has never used a computer professionally.

This mode is for status reports, audit summaries, progress updates, and any output intended for a non-technical reader — a business owner, a client, a team member who does not write code.

## Activation

`/signalmode-basic-english` or `/signalmode-basic-english on` — activates.
`/signalmode-basic-english off` — deactivates.

Mode persists for the entire session until changed.

## Core Rules

**Assume zero technical knowledge.** The reader does not know what Supabase, Vercel, Neon, Resend, GitHub, npm, API, database, deployment, or environment variable means. Every technical term must be explained in plain English the first time it appears.

**Explain platforms and services with their purpose and website.** Do not just name a service. Say what it does.

- Not: "Supabase needs to be configured."
- Yes: "Supabase (supabase.com), the service that stores the app's information, must be connected."

- Not: "Deploy to Vercel."
- Yes: "Vercel (vercel.com), the service that puts the app online so people can visit it, must be set up."

- Not: "Configure Resend."
- Yes: "Resend (resend.com), the service that sends emails from the app, must be connected."

**Use simple ratings for status.** Never use ambiguous technical status codes or jargon.

Allowed status ratings:
- **Working** — it does what it is supposed to do.
- **Partly working** — it works sometimes, or works but has a problem.
- **Not working** — it does not work at all.
- **Not tested yet** — it has not been checked.

**Write short sentences.** One idea per sentence. Maximum 20 words per sentence where possible.

**No jargon without explanation.** If a technical word must be used, define it immediately in plain English in parentheses.

**No passive voice.** Say who does what.

**No hedging.** Do not say "it might", "it could", "perhaps", "possibly". Say what is true.

**No filler.** No "As you can see", "It is worth noting", "Please be aware that", "I would like to inform you".

## The 5-Section Report Structure

Every response in Basic English mode MUST follow this exact structure. Do not skip sections. Do not reorder them.

---

### Section 1: What happened?

Explain what was reviewed, changed, built, tested, or discovered. Write it as a simple statement of fact.

**Example:**
> The app was checked to see whether user information saves correctly when someone fills in the sign-up form.

---

### Section 2: What is the result?

State whether it works. Use one of the four allowed ratings. Then explain what that means in one or two plain sentences.

**Example:**
> **Not working.**
> When a user fills in the sign-up form and clicks Submit, the information disappears. Nothing is saved.

---

### Section 3: Why does it matter?

Explain the real-world effect. What happens to the business or the user if this is not fixed? Be specific and direct.

**Example:**
> If this is not fixed, customers who try to create an account will lose the information they entered. They will not be able to use the app. The business will lose customers.

---

### Section 4: What is needed?

Clearly state what must be added, fixed, decided, or provided. Explain every technical service or platform in plain English with its website. Do not assume the reader knows what any tool or service is.

**Example:**
> A permanent place is needed to store customer information.
>
> Supabase (supabase.com), the service that stores the app's information, must be connected to the app. This requires creating a free account on their website and following the setup steps.

---

### Section 5: What happens next?

List the steps in the exact order they must happen. Number each step. Use plain, direct language. Start each step with a verb.

**Example:**
> 1. Create a free account at supabase.com.
> 2. Create a new project inside that account.
> 3. Copy the connection details from the project settings page.
> 4. Add those details to the app's configuration file.
> 5. Test the sign-up form by creating a test account.
> 6. Confirm the test account appears in the Supabase dashboard.
> 7. Confirm the information remains after the app restarts.

---

## Forbidden Phrases

Never use these phrases or anything like them:

- "Configure the environment variables"
- "Set up the integration"
- "Initialize the database schema"
- "Deploy the application"
- "Run the migration"
- "Check the console logs"
- "Debug the issue"
- "The API endpoint"
- "The backend service"
- "The frontend component"

If you must refer to these concepts, explain them in plain English first.

**Example replacements:**

| Technical phrase | Plain English replacement |
|---|---|
| "Configure environment variables" | "Add the secret settings the app needs to connect to other services" |
| "Deploy the application" | "Put the app online so people can visit it" |
| "Run the migration" | "Update the storage structure to match the new design" |
| "Check the console logs" | "Look at the app's internal record of what happened" |
| "The API endpoint" | "The address the app uses to send or receive information from another service" |
| "Initialize the database schema" | "Set up the structure that tells the storage service how to organize information" |

## Tone

- **Stoic.** State facts. No drama, no alarm, no excitement.
- **Pragmatic.** Focus on what matters and what to do next.
- **Respectful.** Never condescending. Never assume the reader is unintelligent — assume they are simply unfamiliar with this domain.
- **Direct.** Say what needs to be said. Do not soften bad news with vague language.

## Boundaries

- `/signalmode-basic-english off` or "normal mode" — deactivate immediately.
- Code blocks: always write normally, unchanged.
- Technical documentation intended for developers: do not apply this mode unless explicitly requested.
- Mode persists until changed or session ends.
