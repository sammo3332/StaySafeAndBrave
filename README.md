# Stay Safe & Brave

**Travel-tech portfolio project — from a 2025 startup prototype to an independently expanded product demo.**

Stay Safe & Brave explores how self-organized travelers in South Africa could combine digital trip preparation with personal support from Local Mentors.

> **Portfolio status:** This repository is a technical portfolio/demo project. Stay Safe & Brave is not currently operated as an active commercial travel service. Demo bookings, payments and selected mentor interactions are simulated and clearly separated from production-oriented workflows.

## Live project

**Live demo:** https://stay-safe-and-brave-pink.vercel.app/  
**Guided booking demo:** https://stay-safe-and-brave-pink.vercel.app/demo  
**AI Travel Assistant:** https://stay-safe-and-brave-pink.vercel.app/travel-assistant

For the most complete demo journey, start at `/demo` and choose the Premium example package.

## What the project demonstrates

- A multi-step travel and booking journey with package, mentor, travel-date, cart, payment-simulation, confirmation and trip-overview states
- Traveler-, Mentor- and Admin-oriented application areas
- Firebase Authentication and Firestore-based application functionality
- A server-side AI Travel Assistant using Genkit with Google Gemini
- German and English product/demo areas
- Messaging, trip-management and service simulations
- Production-oriented foundations for commerce, engagement and operational workflows, kept separate from the public demo
- Explicit UX boundaries between simulated functionality and real-world operations

## Tech stack

| Area | Technology |
| --- | --- |
| Web | Next.js 15.2.8, React 18.3.1, TypeScript |
| UI | Tailwind CSS, Radix UI, Lucide |
| Data & Auth | Firebase, Firestore, Firebase Authentication, Firebase Admin |
| AI | Genkit 1.8.x, Google AI / Gemini |
| Validation | Zod |
| Commerce foundation | Stripe |
| Testing | Node test runner, TypeScript typecheck |
| Deployment | Vercel |

## Product architecture

```text
                    STAY SAFE & BRAVE

             Next.js · React · TypeScript
                       │
          ┌────────────┼────────────┐
          │            │            │
     Product UX    Demo Journey   AI Assistant
          │            │            │
          │       React State        │
          │       + Validation       │
          │            │            │
          └──────┬─────┘      Genkit + Gemini
                 │
          Firebase Services
          Auth · Firestore
                 │
        Role-oriented application
       Traveler · Mentor · Admin
```

A key architectural decision is the separation of the demonstrable local booking journey from production-oriented transaction workflows. The demo does not require real card or bank data and does not represent a real booking.

More detail: [Architecture documentation](docs/architecture/README.md)

## Demo journey

```text
Package + example mentor
          ↓
     Travel details
          ↓
         Cart
          ↓
 Simulated payment
          ↓
    Confirmation
          ↓
      My Trip
          ↓
Services · changes · messaging · role play
```

The nine legacy mentor profiles used in the demo are **fictional/example profiles**. They are not presented as verified, currently available or bookable people.

## AI Travel Assistant

The Travel Assistant is a supporting feature rather than the core product. It uses a server-side Genkit flow backed by Gemini and is designed for general preparation, route ideas and travel questions.

The product intentionally distinguishes AI assistance from the human Local Mentor concept. The assistant does not claim live access to time-sensitive information and directs users toward official sources or local human guidance where appropriate.

## Project background

The project originated during the 2025 Stay Safe & Brave startup phase. During that period, Houssam Taleb worked as **Co-Founder & CTO**, with responsibility focused on technical product development and innovation. The work included translating product requirements into user flows and technical structures and developing the web prototype.

The founding team participated in **greenhouse.ruhr 2025**, presented Stay Safe & Brave at **RuhrSummit**, and worked on an application for the **EXIST-Gründungsstipendium** with support from the CET at TU Dortmund. Houssam's contribution to the EXIST application focused on the technical part.

The team later stopped pursuing Stay Safe & Brave as an active startup. Houssam subsequently picked up the technical work independently and expanded the platform as the portfolio project represented by this repository.

This repository should therefore not be interpreted as a continuation of an active joint company.

## Current boundaries

This is a portfolio/demo system, not a claim of production operation.

In particular:

- demo payments are simulations;
- example mentor profiles are not real bookable inventory;
- no real customer usage or business metrics are claimed;
- live payment and email provider flows have not been presented here as fully end-to-end production-approved;
- protected/dynamic areas and provider integrations require their respective runtime configuration;
- production-oriented foundations should not be confused with an active commercial service.

## Verification

The repository contains automated workflow tests and separate TypeScript checking. The project documentation records successful workflow tests and build/typecheck checks for the documented development state while also listing the browser/provider checks that remain outside those automated validations.

Useful technical documentation:

- [Architecture](docs/architecture/README.md)
- [Product expansion and operational boundaries](PRODUCT_EXPANSION.md)
- [Demo design and boundaries](DEMO_PLAN.md)
- [Portfolio quality notes](PORTFOLIO_QUALITY.md)
- [LinkedIn showcase publishing pack](docs/linkedin-showcase/README.md)

## Run locally

```bash
npm install
npm run dev
```

Then open the local Next.js development URL shown in the terminal.

The AI Travel Assistant additionally requires a server-side Gemini API credential. Commerce and engagement integrations require their own server-side configuration and are intentionally disabled when not configured.

## Purpose

This project is intended to demonstrate practical work across **software engineering, applied AI and technical product development**: turning product requirements into user flows, architecture and working software while making technical limitations and demo boundaries explicit.
