# Stay Safe & Brave – geplanter Produktausbau

Stand: 17. September 2026. Fortsetzung von `StaySafeAndBrave-booking-demo.zip`, nicht eines älteren Deployments. Der neue Stand bleibt eine Arbeitskopie; keine Veröffentlichung und keine externen Zahlungen, Buchungen oder E-Mails wurden für die Entwicklung ausgelöst.

## Ergebnis nach den acht angefragten Punkten

| Punkt | Implementierter Stand | Noch fehlend / nicht behauptet |
| --- | --- | --- |
| 1 Reiseunterlagen | Neues vierseitiges Arbeitsheft als deutsches und englisches PDF, Downloadseite und Integration in die Reiseübersicht | Das historische Original-Infopaket fehlt weiterhin. Keine erfundenen Originalinhalte oder aktuellen Visa-/Gesundheits-/Sicherheitshinweise. |
| 2 Weitere Services | KI-Simulation mit vorformulierten Antworten; Get-Ready-Call planen/abschließen; vierstufige Flughafenankunft; Tour-Thema wählen/abschließen; Paketgrenzen im Modell geprüft | Kein generatives Modell in der Demo, keine Live-Flugdaten, Transfers, Videoanrufe oder gebuchten Touren. |
| 3 Reales Angebot | Separater serververwalteter Angebotskatalog, verbindlicher Preissnapshot pro Buchung, Bedingungsversion, geprüfte Profilfreigabe und Zeitraumreservierung; überlappende Mentor-Tage werden gesperrt | Echte Preise, Bedingungen, Identitätsprüfung und Verfügbarkeit müssen vom Betreiber geliefert und geprüft werden. Die neun Beispielprofile werden serverseitig vom Verkauf ausgeschlossen. |
| 4 Zahlungsbetrieb | Firebase-ID-Token-Verifikation, Besitzerprüfung, Stripe Checkout, feste Idempotenzschlüssel, signierter und betragsgebundener Webhook, Statusspeicherung, volle Erstattung durch Admin, E-Mail-Ausgang und Resend-Transport | Keine echten Zugangsdaten eingebaut, keine externe End-to-End-Freigabe. Teilrückerstattungen, Zahlungsstreitfälle und Bank-/Asynchronzahlungen werden nicht angeboten. |
| 5 Mentor-Bewerbung | Eigene Seite, Demo-Ablauf und echter Serverprozess mit Formularprüfung, Spam-Schutz, privater Speicherung und administrativer Prüfung | Die Bewerbung erstellt weder automatisch ein öffentliches Profil noch eine Verfügbarkeit. Echte Bearbeitung erfordert Betriebskonfiguration. |
| 6 Newsletter | Demo von Anmeldung/Bestätigung/Abmeldung; echter Double-Opt-in mit gehashtem Token, Ablaufzeit, expliziter Bestätigung und Abmeldung | Kein Newsletter-Kampagneneditor oder Massenversand. Versanddomain, Dienstzugang, tatsächliche Zustellung und operative Abmeldelinks müssen im Testsystem geprüft werden. |
| 7 Englisch | `/en` mit Startseite, Paketen, Profilübersicht, Über uns, Archivbildern, FAQ, Arbeitsheft, Teilnahmeformularen und vollständigem eigenem Demo-Kernablauf auf gemeinsamem Zustandsmodell | Keine vollständige Übersetzung sämtlicher vorhandener Konto-/Admin-/Betriebsseiten, detaillierter Altprofile, Nutzerberichte oder Rechtstexte. Deutsche Ziele werden ausdrücklich gekennzeichnet. Dies ist noch keine vollständige Lokalisierung der gesamten Anwendung. |
| 8 Produktabläufe | Mehrere getrennte Demo-Reisen, Änderung, Storno/Erstattung, lokale Hinweise, Mentor-Rollenspiel; echte separate Buchungsliste, Änderungs-/Stornoanfragen, geschützter Chat, Terminvorschlag und Gegenbestätigung, Mentor-Buchungsansicht, Admin-Betriebsansicht | Reale Änderungen werden angefragt, nicht automatisch gegen ungeprüfte Konditionen umgesetzt. Echte Videoräume, Push-Nachrichten und durchgetestete Betriebsabläufe sind nicht freigegeben. |

## Wege zum Ausprobieren

- `/demo`: bisherigen deutschen Buchungsablauf starten. Premium wählen, um alle Services zu sehen.
- `/demo/meine-reise`: nach erfolgreicher Demo-Zahlung die neuen Services, Mentor-Gegenansicht und Änderungen öffnen.
- `Weitere Reise planen`: bestätigte Reise archivieren, neuen Durchlauf beginnen, zwischen Reisen wechseln.
- `/mitmachen`: Mentor-Bewerbung und Newsletter starten ausdrücklich im lokalen Demo-Modus.
- `/reiseunterlagen`: beide neu erstellten PDF-Arbeitshefte.
- `/en` und `/en/demo`: englischen Kernbereich testen.
- `/angebote`: ausschließlich reale, freigegebene Serverangebote; ohne Einrichtung ehrlicher Leer-/Konfigurationszustand.
- `/mentor/bookings`: geschützte Sicht auf zugeordnete echte Reisebegleitungen.
- `/admin/operations`: Bewerbungen, echte Buchungswünsche, volle Erstattung und E-Mail-Ausgang.

## Quellenabgleich

Die ursprünglich nicht erreichbare Seite https://www.staysafeandbrave.com/werde-local-mentor/ konnte diesmal gelesen werden. Sie verwendet Name, E-Mail, Betreff und Nachricht als Kontaktanfrage. Stadt, Sprachen und strukturierte Prüfung sind bewusste neue Ergänzungen. Das ursprüngliche Newsletter-Ziel ist ein externes Brevo-/Sibforms-Formular; der neue Ablauf ist eine eigene Implementierung.

Technische Primärquellen:
- https://firebase.google.com/docs/auth/admin/verify-id-tokens
- https://firebase.google.com/docs/admin/setup
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/api/refunds/create
- https://resend.com/docs/api-reference/emails/send-email
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Architekturentscheidungen

- Vorhandene Firebase-Anfragen, Nutzerberichte und Nachrichten bleiben erhalten. Neue Zahlungsbuchungen liegen getrennt in `commerceBookings` und werden ausschließlich serverseitig geschrieben. Die alten clientseitig anlegbaren `bookings` werden nicht als vertrauenswürdige Zahlungsgrundlage verwendet.
- Sämtliche neuen Commerce-/Bewerbungs-/Newsletter-/Outbox-Sammlungen sind durch die vorhandenen Firestore-Regeln für direkte Client-Zugriffe nicht freigegeben. Zugriffe erfolgen über API-Routen mit Admin-SDK und eigener Berechtigungsprüfung. Es wurden keine Regeln gelockert.
- `firebase-admin` ist jetzt eine ausdrückliche Projektabhängigkeit. Credentials werden nur serverseitig gelesen; keine NEXT_PUBLIC-Credentials.
- Eine Angebotsreservierung sperrt jeden Mentor-Tag innerhalb des freigegebenen Zeitraums. Ein fehlgeschlagener oder unklarer Checkout wird nicht blind freigegeben; ein bestätigtes Stripe-Expiry-Ereignis gibt seine Reservierung frei. Das verhindert einen Verkauf bereits bezahlter, aber verspätet gemeldeter Plätze.
- Checkout-Erstellung verwendet ein wiederverwendbares Anfragekennzeichen; nach Neuladen ist „Zahlung fortsetzen“ für vorhandene offene Buchungen vorgesehen.
- Webhooks prüfen Signatur, Umgebung, Buchungszuordnung, Session, Betrag und Währung. Doppelte Ereignisse werden dauerhaft erkannt. Nur eine bestätigte Zahlung löst den Buchungsstatus `paid` aus.
- Erstattung: nur vollständiger Betrag, ausschließlich Admin, getrennte Zustände `refund_pending`, `refunded` und `refund_failed`. Erstattete Zeiträume werden nicht automatisch erneut verkauft.
- E-Mail-Outbox und Provider-Idempotenzschlüssel verhindern normale Wiederholungsduplikate. „accepted“ bedeutet Provider-Annahme, nicht nachgewiesene Postfachzustellung. Unklare Versuche älter als 23 Stunden werden nicht automatisch erneut versendet.
- Öffentliche Formulare: serverseitige Zod-Prüfung, Turnstile-Verifikation mit Hostname-Prüfung, Empfänger-bezogene Begrenzung; Newsletter-Token gehasht und zeitlich begrenzt. Zusätzlich sind Rate-Limits am Hosting-Eingang für einen Live-Betrieb einzurichten.
- Newsletter-Bestätigung erfolgt nur per ausdrücklichem POST. Das Öffnen/Scannen eines E-Mail-Links allein bestätigt nichts. Der Token steht im URL-Fragment und wird nicht als normale URL-Anfrage an den Server geschickt.
- Die lokale Demo bleibt getrennt von allen Netzwerk- und Zahlungsaktionen. Eine Kennzeichnung als „bestätigt“ innerhalb der Demo ist keine reale Buchung.

## Betreiber-Setup vor echten Vorgängen

Alle Freigaben sind standardmäßig aus. Keine Zugangsdaten im Chat teilen; ausschließlich im Deployment/Testsystem hinterlegen.

| Variable | Zweck |
| --- | --- |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase-Testprojekt |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Server-Servicekonto |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Privater Serverschlüssel; echte Zeilenumbrüche oder escaped `\\n` |
| `SSB_SITE_URL` | Vertrauenswürdige HTTPS-Origin für Rücksprünge und E-Mail-Links |
| `SSB_COMMERCE_ENABLED` | `true` erst nach Einrichtung eines getrennten Testsystems |
| `STRIPE_SECRET_KEY` | Zuerst ausschließlich Stripe-Testschlüssel |
| `STRIPE_WEBHOOK_SECRET` | Passender Webhook-Signaturschlüssel |
| `SSB_LIVE_PAYMENTS_APPROVED` | Zusätzliche Freigabe für Live-Zahlungen; nicht für die lokale Demo nötig |
| `EMAIL_TRANSPORT_ENABLED` | Versandfreigabe, standardmäßig aus |
| `EMAIL_PROVIDER_API_KEY` | Resend-API-Schlüssel |
| `EMAIL_FROM` | Verifizierter Absender |
| `SSB_ENGAGEMENT_ENABLED` | Echte Formulare aktivieren |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Server-/Widget-Schlüssel und passende Hostnamen |
| `SSB_FORM_HASH_SECRET` | Eigenes dauerhaftes zufälliges Server-Geheimnis für Formular-IDs |
| `CONTACT_EMAIL_TO` | Bestehende feste Empfängeradresse des Kontaktformulars |

Nur auf einem separaten Testprojekt/Stripe-Testkonto vorbereiten. Vor Produktionsfreigabe sind vertragliche Angebotsdaten, Verantwortlichkeiten, Datenschutzhinweise, Versanddomain und Aufbewahrung/Löschung der neuen personenbezogenen Datensätze abzustimmen.

Serververwaltete Daten:
- `commerceOffers/{id}`: `title`, `mentorId`, `mentorName`, `city`, `amount` (ganze Cent), `currency: "eur"`, `approved: true`, `profileVerified: true`, `termsVersion`, `terms`, `features[]`. Keine fiktiven Legacy-Mentor-IDs verwenden. Freigaben nur nach tatsächlicher Prüfung setzen.
- `commerceSlots/{id}`: `offerId`, `arrival`, `departure` im ISO-Datumsformat, `available: true`. Zeitraum maximal 28 Tage. `bookingId` wird ausschließlich vom Server gesetzt.
- `mentorAuth/{authUid}`: private Zuordnung `mentorId`; bestehendes Berechtigungsmodell.
- `commerceMentorContacts/{mentorId}`: private, verifizierte Mentor-E-Mail für Benachrichtigungen.
- `adminAuth/{authUid}`: bestehende private Rolle `admin` für Betrieb und Erstattungsfreigaben.

Webhook-Ziel: `/api/commerce/webhook`, alternativ kompatibel `/api/stripe/webhook`. Benötigte Ereignisse: `checkout.session.completed`, `checkout.session.expired`, `refund.created`, `refund.updated`, `refund.failed`.

## Prüfstand und verbleibende Freigaben

Automatische Prüfung: `npm run test:workflows`. Tests führen keine Stripe-/Firebase-/E-Mail-Netzwerktransaktionen aus, sondern verwenden kontrollierte Adapter und echte Stripe-Signaturprüfung mit ausschließlich künstlichen Testschlüsseln. Geprüft werden Preismanipulation, Reservierungskonflikte, Idempotenz, Signatur/Betrag, Erstattungsrechte, Authentifizierung, Chat-Berechtigung, Newsletter-Lebenszyklus und Demo-Zustände.

Für eine echte End-to-End-Freigabe fehlen weiterhin das konfigurierte Testprojekt, freigegebene Angebotsdaten, Stripe-Testkonto/Webhook, verifizierte Maildomain und Testpostfach sowie ein erreichbarer Browser. Zu prüfen sind dabei auch Provider-Ausfälle, verspätete/verdrehte Ereignisse, Empfängerzustellung, Wiederaufnahme nach Netzabbrüchen, Datensatz-Löschung und Verfügbarkeit im konkurrierenden Betrieb. Der In-Memory-Test ersetzt keinen Firestore-Emulator- oder Provider-Integrationstest.

Die vollständige Lokalisierung der bestehenden Alt- und Betriebsseiten ist nicht abgeschlossen. Die PDF-Dateien wurden gerendert und alle acht Seiten visuell geprüft. Die lokale Browseransicht der Anwendung bleibt separat zu prüfen.

Abhängigkeiten: Ein erneuter Registry-Abgleich (`npm install --package-lock-only --ignore-scripts`) wurde hier mit HTTP 403 abgewiesen. Es wurden keine alternativen Registry-Wege versucht. Die vorhandene Lockdatei enthält Firebase Admin 14.3.0 bereits transitiv; diese bestehende Auflösung ist jetzt auch als direkte Abhängigkeit `^14.3.0` deklariert. Die Prüfungen liefen mit dem vorhandenen installierten 14.4.0 (innerhalb dieses Versionsbereichs). Eine frische Installation aus dem Archiv konnte in dieser Umgebung nicht geprüft werden.

## Abschlussprüfung dieses Arbeitsstands

- 23 automatische Tests bestanden (`npm run test:workflows`). Serverprozesse mit isolierten In-Memory-Adaptern; keine echten Testkonto-Transaktionen.
- Separater Typecheck bestanden (`npm run typecheck -- --incremental false`).
- Build bestanden: 72 statische Seiten. Die bestehende Build-Konfiguration überspringt Typprüfung/Lint; deshalb separater Typecheck. Kein gesonderter Lint-Erfolg behauptet.
- Build weiterhin mit `NEXT_IGNORE_INCORRECT_LOCKFILE=1` und dem bestehenden externen Memory-Preload für das `uv_resident_set_memory`-Problem dieser Umgebung. Der Preload ist nicht Teil des Windows-Projekts. Bestehende OpenTelemetry-/Jaeger- und Firebase-Fallback-Warnungen bleiben.
- HTTP-Prüfung bestanden: 20 Seiten und beide PDFs erreichbar; ausgeschaltete Zahlungsrouten liefern 503; geschützte APIs ohne Anmeldung 401; Angebote/Formulare melden deaktivierten Betriebsstatus; echte Formular-POSTs bleiben ohne Freigabe geschlossen.
- Alle acht PDF-Seiten visuell kontrolliert, eingebettete Schriften geprüft.
- `git diff --check` bestanden.
- **Nicht geprüft:** gerenderte Browserinteraktion, mobile/Desktop-Ansicht, vollständige Hydration und externe Provider-End-to-End-Prozesse. Der Browser meldet für `http://127.0.0.1:3005/en/demo` weiterhin `ERR_BLOCKED_BY_CLIENT`.
- **Nicht geprüft:** frische Installation wegen Registry-HTTP-403. Es wurde kein Netzwerkzugang umgangen.

Nichts committed, gepusht oder deployed. Keine echten Nachrichten, Buchungen oder Zahlungen ausgeführt.
