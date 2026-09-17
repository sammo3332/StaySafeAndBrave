# Zahlungsmethoden — 17. September 2026

Weiterarbeit auf `StaySafeAndBrave-product-expansion.zip`, der zuletzt bevorzugten vollständigen Version. Alle 260 Ausgangsdateien waren in der Arbeitskopie vorhanden. Layout, Inhalte, Originalbilder und bestehende Produktabläufe bleiben erhalten.

## Ausprobieren

Projekt separat entpacken und gemäß `PRUEFEN.txt` starten. Unter `/demo` ein Paket auswählen, Reisedaten bestätigen und vom Warenkorb zum Zahlungsschritt wechseln. Englisch: `/en/demo`.

- Kredit-/Debitkarte, PayPal, Apple Pay und Google Pay als native, per Tastatur bedienbare Radio-Auswahl. Auf schmalen Bildschirmen eine Spalte, ab 640 Pixeln zwei Spalten.
- Jede Methode erklärt ihren simulierten Ablauf. Keine Kartenfelder, Login-Imitationen oder echten Wallet-Dialoge; keine Zahlungsdaten werden gespeichert.
- Erfolg, Ablehnung und Abbruch sind weiterhin testbar. Nach einem Methodenwechsel wird ein Zahlungsfehler gelöscht und die Zustimmung erneut abgefragt.
- Die Auswahl bleibt im lokalen Demo-Speicher erhalten. Bestätigung, deutsche Reiseübersicht und herunterladbarer deutscher Textbeleg zeigen die bei Erfolg gespeicherte Methode. Englisch zeigt sie in der Bestätigung.
- Bereits bestätigte Reisen können ihre Zahlungsmethode nicht nachträglich ändern. Archivierung und Storno behalten den Beleg unverändert. Alte Belege ohne Methodenangabe bleiben als „Virtuelle Demo-Zahlung“ lesbar.

## Vorbereitete Stripe-Anbindung

Die echte Zahlung bleibt ausgeschaltet. Es wurden weder Zugangsdaten eingerichtet noch Stripe-/PayPal-Konten oder Zahlungsoptionen im Dashboard aktiviert.

`SSB_STRIPE_PAYMENT_METHODS` bestimmt ausschließlich serverseitig die erlaubten Methoden: Standard bei fehlender Einstellung `card`, optional `paypal` oder `card,paypal`. PayPal muss zuvor im geeigneten Stripe-Konto aktiviert und im Testbetrieb geprüft werden. Ein leeres oder unbekanntes Konfigurationsfeld verhindert neue Reservierungen mit einer verständlichen Fehlermeldung.

Neue Buchungen speichern diese Methoden zusammen mit dem verbindlichen Angebot. Wiederholte Checkout-Anfragen verwenden dieselbe Auswahl und denselben Ablaufzeitpunkt, auch wenn die Konfiguration inzwischen geändert wurde. Bestehende Buchungen ohne Methodensnapshot verwenden weiterhin `card`. Die tatsächliche Wahl findet im gehosteten Stripe-Checkout statt; die Angebotsseite zeigt die konfigurierten Methoden an. Aus der Liste erlaubter Methoden wird keine tatsächlich erfolgte Zahlungsart abgeleitet.

Apple Pay und Google Pay laufen im gehosteten Checkout über `card`. Ihre Anzeige hängt von Stripe-Einstellungen, Gerät und vorhandener Wallet ab. Sie sind keine eigenen Werte für `payment_method_types`. SEPA-Lastschrift und Klarna sind nicht freigeschaltet: Dafür sind weitere Zahlungszustände und eigene Integrationstests erforderlich.

Quellen zur technischen Umsetzung: [Stripe PayPal](https://docs.stripe.com/payments/paypal), [Stripe Apple Pay](https://docs.stripe.com/apple-pay?platform=web), [Stripe Google Pay](https://docs.stripe.com/google-pay?platform=web).

## Prüfstand

- Separater Typecheck: bestanden (`npm run typecheck -- --incremental false`).
- 28 Workflow-Tests bestanden (`npm run test:workflows`), einschließlich aller vier Demo-Methoden, Ablehnung/Wiederholung, Speicherung, alter Belege, Archivierung, unveränderlicher Methodenwahl nach Bestätigung, serverseitiger Konfiguration und Stripe-Parameter mit gemocktem Zahlungsdienst.
- Build und lokaler HTTP-Test: siehe abschließenden Prüfstand unten.
- Kein Zugriff auf eine gerenderte Browseransicht in diesem Durchlauf. Visuelle Desktop-/Mobilprüfung sowie echte Wallet- und PayPal-Weiterleitungen bleiben offen. Der frühere Browserdurchlauf war mit `ERR_BLOCKED_BY_CLIENT` blockiert; daraus wird hier keine neue Prüfung abgeleitet.
- Kein End-to-End-Test gegen echte Stripe-/PayPal-Konten. Vor Live-Nutzung: Erfolg, Abbruch, Wiederholung, authentifizierte Zahlung, signierter Webhook und Erstattung pro angebotener Methode in der eingerichteten Testumgebung durchlaufen.
- Keine Commits, Pushes, Deployments, echten Zahlungen oder E-Mails.

## Betroffene Dateien

Neu: `src/lib/payment-methods.ts`, `src/components/demo/payment-method-picker.tsx`, dieser Bericht.

Erweitert: `src/lib/demo-booking.ts`, `src/components/demo/demo-flow.tsx`, `src/components/demo/demo-english.tsx`, `src/lib/commerce/model.ts`, `src/lib/server/commerce.ts`, `src/app/api/commerce/offers/route.ts`, `src/components/product/commerce-panel.tsx`, beide Workflow-Testdateien, `SERVER_CONFIG.example.txt` und `PRUEFEN.txt`.

## Abschließender Prüfstand

Build bestanden: 72 statische Seiten erzeugt. Der Build wurde in dieser Umgebung mit `NEXT_IGNORE_INCORRECT_LOCKFILE=1` und `NODE_OPTIONS=--require=/workspace/scratch/a9a7b5df5bf1/memory-compat.cjs` ausgeführt. Der bereits vorhandene, nur außerhalb des Projekts liegende Preload fängt den umgebungsspezifischen `ENOENT` bei `process.memoryUsage`/RSS ab und verwendet Node-/V8-Speichertelemetrie. Er ist kein Bestandteil der Anwendung und wird für den normalen Windows-Start nicht mitgeliefert. Ein neuer Build ohne diesen bekannten Workaround wurde in diesem Durchlauf nicht versucht.

Die vorhandene Next-Konfiguration überspringt Typ- und Lintprüfung beim Build. Der separate Typecheck ist bestanden; Lint wurde nicht zusätzlich ausgeführt. Die bekannten Jaeger-/OpenTelemetry- und Firebase-Initialisierungswarnungen bleiben bestehen.

Lokaler Produktionsserver: `/demo`, `/demo/bezahlen`, `/demo/bestaetigung`, `/en/demo` und `/angebote` lieferten HTTP 200. Bei ausdrücklich abgeschaltetem Commerce meldete die Angebots-API `enabled:false`, leere Angebote und leere Zahlungsmethoden; der Checkout-Endpunkt verweigerte neue Zahlungen mit HTTP 503. Der Server wurde danach beendet. HTTP-Erreichbarkeit bestätigt weder die gerenderte Oberfläche noch clientseitige Firebase-Abfragen.
