# signalmode-basic-english

Forces plain, layman-friendly output reports. Assumes the reader knows nothing about code, cloud platforms, databases, or technical services.

## Usage

```
/signalmode-basic-english     — Activate
/signalmode-basic-english off — Deactivate
```

## What it does

Every response follows a strict 5-section structure:

1. **What happened?** — What was reviewed, changed, built, tested, or discovered.
2. **What is the result?** — Working / Partly working / Not working / Not tested yet.
3. **Why does it matter?** — The real-world effect if not addressed.
4. **What is needed?** — What must be added, fixed, decided, or provided — with plain-English explanations of every technical service or platform.
5. **What happens next?** — Steps in exact order.

## Who it's for

Business owners, clients, and team members who do not write code. Anyone who needs to understand what happened without knowing what Supabase, Vercel, or an API is.

## Example

**Technical version:**
> "Supabase needs to be configured. Run the migration and set the environment variables."

**Basic English version:**
> **What is needed?**
> A permanent place is needed to store customer information.
>
> Supabase (supabase.com), the service that stores the app's information, must be connected to the app. This requires creating a free account on their website and following the setup steps.
>
> **What happens next?**
> 1. Create a free account at supabase.com.
> 2. Create a new project inside that account.
> 3. Copy the connection details from the project settings page.
> 4. Add those details to the app's configuration file.
> 5. Test the sign-up form by creating a test account.
