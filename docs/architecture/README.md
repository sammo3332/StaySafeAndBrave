# Architektur – Stay Safe & Brave

> Technische Übersicht des aktuellen Portfolio-Projekts.  
> Stand: September 2026.

## Überblick

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
        Role-based application
       Traveler · Mentor · Admin
```

## Zentrale Bausteine

### Web-Anwendung
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Demo Journey
Der gekennzeichnete Demo-Bereich bildet einen vollständigen Reise- und Buchungsablauf ab. Der Demo-State wird clientseitig verwaltet und ist bewusst von produktionsorientierten Transaktionsabläufen getrennt.

Beispielhafter Flow:

```text
/demo
  ↓
Paketauswahl + Beispiel-Mentor
  ↓
Reisedaten
  ↓
Warenkorb
  ↓
simulierte Zahlung
  ↓
Bestätigung
  ↓
Meine Demo-Reise
```

Die Demo verwendet keine echten Karten- oder Bankdaten und führt keine echten Buchungen aus.

### AI Travel Assistant
Der Travel Assistant besitzt einen eigenen serverseitigen API-/AI-Flow.

```text
Travel Assistant UI
        ↓
Next.js API Route
        ↓
Genkit
        ↓
Gemini
```

Er dient der ersten Orientierung bei der Reiseplanung und ist konzeptionell vom persönlichen Austausch mit einem Local Mentor getrennt.

### Firebase und Rollen
Firebase wird für Authentifizierung und Firestore-basierte Anwendungsbereiche verwendet. Im Projekt existieren unterschiedliche Perspektiven bzw. geschützte Bereiche für:

- Traveler
- Mentor
- Admin

### Demo vs. produktionsorientierte Bereiche
Eine wichtige Architekturentscheidung ist die bewusste Trennung zwischen der öffentlich ausprobierbaren Demo und produktionsorientierten Funktionen.

```text
                    Application
                         │
              ┌──────────┴──────────┐
              │                     │
         Demo Environment     Production-oriented
              │                  Workflows
        local demo state             │
        simulations           Auth / Firestore /
        no real payment       server-side services
```

Dadurch können Produktabläufe demonstriert werden, ohne vorzutäuschen, dass ein aktiver kommerzieller Reiseservice oder eine echte Zahlung stattfindet.

## Wichtige Routen

- `/demo` – Einstieg in die deutsche Produktdemo
- `/demo/[step]` – Demo-Schritte wie Pakete, Reisedaten, Warenkorb, Zahlung, Bestätigung und Reiseübersicht
- `/travel-assistant` – AI Travel Assistant
- `/dashboard` – Traveler-Bereich
- `/mentor/bookings` – geschützter Mentor-Bereich
- `/admin/operations` – geschützter Admin-/Operations-Bereich
- `/en/demo` – englischer Demo-Kernbereich

## Einordnung

Stay Safe & Brave ist heute ein technisches Portfolio- und Demo-Projekt und kein aktiver kommerzieller Reiseservice. Simulierte Funktionen werden als Demo gekennzeichnet.
