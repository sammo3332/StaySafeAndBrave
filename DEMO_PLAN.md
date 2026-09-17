# Stay Safe & Brave – Buchungsdemo und Funktionsplan

**Historischer Stand der ersten Demo. Der aktuelle Ausbau und seine tatsächlichen Grenzen stehen in `PRODUCT_EXPANSION.md`.**

Stand: 17. September 2026. Basis: `StaySafeAndBrave-internal-mentor-profiles.zip` (213 Dateien), also die zuletzt akzeptierte Version mit intern dargestellten Mentorprofilen. Kein Wechsel auf einen älteren veröffentlichten Stand.

## War das bereits geplant?

Ja. `REDESIGN_REPORT.md` und `PRODUCTION_POLISH_REPORT.md` beschreiben Pakete, Warenkorb, Buchung und Zahlung. Die Architektur enthält bereits CartContext, Buchungsanfragen sowie Stripe- und E-Mail-Endpunkte. Im akzeptierten Stand war der öffentliche Ablauf jedoch bewusst auf unverbindliche Anfragen begrenzt; reale Preise und Leistungen waren nicht bestätigt. Ein vollständiger, separat simulierbarer Durchlauf war damit noch nicht vorhanden.

## Abgleich mit der ursprünglichen Website

Geprüfte Referenzen (Inhalte, keine Layoutvorlagen):
- https://www.staysafeandbrave.com/leistungen/
- https://www.staysafeandbrave.com/wp-content/uploads/2025/04/Leistungen-1024x726.jpg (Leistungsmatrix visuell geprüft)
- https://www.staysafeandbrave.com/buche-deinen-local-mentor/
- https://www.staysafeandbrave.com/faq/
- https://www.staysafeandbrave.com/
- Buchungspreise zusätzlich anhand des vom Nutzer beigefügten Screenshots geprüft.

Die Originalseite zeigt drei Pakete, eine Vergleichsmatrix, Leistungsbeschreibungen und ein Anfrageformular mit Name, E-Mail, Zielort, Mentor, Ankunft, Paket und Nachricht. Sie kennzeichnet das Angebot als nicht buchbar und die Preise als fiktiv. Ein echter Warenkorb mit Online-Zahlung und Bestätigung wurde dort nicht vorgefunden. 95 / 195 / 295 Euro sind daher ausschließlich Beispielpreise.

Die Matrix wurde mit vier gemeinsamen Grundleistungen, zwei Ergänzungen im Standard-Paket und drei weiteren Ergänzungen im Premium-Paket abgebildet. Insbesondere gehört der Get-Ready-Videocall nur zu Premium. Keine neuen Preise, Ratings oder Verifizierungsversprechen wurden erfunden.

## Umgesetzt

| Bereich | Neuer Stand |
| --- | --- |
| Pakete | Drei Karten, verbindlich nur innerhalb der Simulation definierte Gesamtpreise, Vergleichsmatrix, aufklappbare Erläuterungen |
| Profilauswahl | Alle neun vorhandenen fiktiven Profile, korrekte Zuordnung von Stadt und Bild, interner Einstieg vom Profil |
| Reisedaten | Beispielreisende Anna, editierbare Termine und Wünsche, Datumskontrolle, eine Person und maximal 28 Tage |
| Warenkorb | Eine Auswahl prüfen, ändern, entfernen und erneut hinzufügen |
| Zahlung | Erfolg, Ablehnung und Abbruch simulieren; Wiederholung ohne zweite Bestätigung |
| Bestätigung | Demo-Referenz, Zusammenfassung, herunterladbarer Textbeleg und Vorschau einer Bestätigungsnachricht |
| Meine Reise | Paketübersicht, speicherbare Checkliste, fiktiver Kennenlerntermin und Chat mit vorformulierten Antworten |
| FAQ | Eigene Seite `/faq`, einschließlich klarer Abgrenzung zwischen Demo und bestehendem Angebot |
| Einstieg | Startseite, Navigation, Footer, Paketseite und alle internen Beispielprofile |
| Fortschritt | Lokaler, versionierter Demo-Speicher, Wiederaufnahme nach Neuladen und Zurücksetzen |

## Bewusst noch offen / nächste Ausbauschritte

1. **Echte Reiseunterlagen:** Das vollständige Original-Infopaket/PDF wurde nicht bereitgestellt. Die neue Checkliste ist nur eine Demo-Vorbereitungshilfe.
2. **Weitere Service-Simulationen:** KI Local Mentor, Get-Ready-Call, Flughafenankunft und Tour als eigenständige interaktive Abläufe. Aktuell zeigt die Übersicht diese Leistungen nur gemäß Paketzuordnung; das simulierte Terminmodul ist das Kennenlernen.
3. **Reales Angebot:** Bestätigte Mentorverfügbarkeit, verbindliche Preise/Leistungsbedingungen und überprüfte Profildaten fehlen als Grundlage für einen echten Verkauf.
4. **Echter Zahlungsbetrieb:** Zahlungsdienst, serverseitige Preisprüfung, Zahlungsstatus per Webhook, Storno/Erstattung und echte E-Mail-Zustellung müssen gesondert end-to-end geprüft werden. Vorhandene Endpunkte wurden für die Demo nicht aktiviert oder verändert.
5. **Mentor-Bewerbung:** Auf der Originalseite verlinkt. Zielseite beim Abruf nicht erreichbar; exakte Formularfelder und Umsetzung bleiben ungeprüft.
6. **Newsletter:** Auf der Originalseite verlinkt; Anmelde-/Bestätigungsprozess im aktuellen Projekt noch nicht umgesetzt.
7. **Englische Inhalte:** Auf der Originalseite vorgesehen; vollständige Lokalisierung des aktuellen Projekts steht aus.
8. **Weitere Produktabläufe:** Buchungsänderungen, Storno, mehrere Reisen, echte Nachrichten-/Terminbenachrichtigungen sowie ein kompletter Mentor-Gegenpart sind kein Bestandteil dieser ersten Demo.

## Architektur und Grenzen

- Next.js App Router unter `/demo` und `/demo/[step]`, eigener React-Provider.
- Domänenmodell mit Zod-Validierung in `src/lib/demo-booking.ts`.
- Speicher: `ssb_demo_journey_v1`. Der vorhandene Produktionswarenkorb `ssb_cart_package` bleibt getrennt.
- Keine Demo-Aufrufe an Stripe, Firestore-Schreibfunktionen, E-Mail-Endpunkte oder andere Netzwerkdienste. Die bestehende globale Firebase-/Authentifizierungsinitialisierung der Website bleibt bestehen; die Demo ist keine vollständig netzwerkfreie Anwendung.
- Kein Login, keine echte E-Mail-Adresse, keine Karten-/Bankdaten nötig. Beispieldaten verwenden.
- Die Bestätigung ist keine Rechnung. Es wird keine E-Mail gesendet. Der Chat kontaktiert keinen Mentor. Termine erzeugen weder Kalendereinladung noch Videoraum.
- Bei deaktiviertem Browserspeicher erscheint ein Hinweis; der laufende Durchlauf bleibt im Arbeitsspeicher nutzbar.
- Ein bereits bestätigter Durchlauf wird nicht erneut bezahlt. Zum erneuten Durchspielen „Neu beginnen“ verwenden.
- Layout, globale Farbvariablen, Typografie und bestehende Originalbilder bleiben erhalten. Keine neuen Fremdbilder.

## Prüfung

- `npm run test:demo`: 11 Tests bestanden. Abgedeckt: vollständige Voraussetzungen, ungültige Termine, Ablehnung/Abbruch/Wiederholung, kanonische Beträge, neun Profile, Entfernen/Wechsel, Wiederherstellung, beschädigte Daten, veralteter Warenkorb, Zurücksetzen und fehlende Netzwerk-/Produktionsintegrationen in den Demo-Modulen.
- `npm run typecheck -- --incremental false`: bestanden, nach abgeschlossenem Build separat ausgeführt. Ein gleichzeitig mit dem Build gestarteter erster Versuch scheiterte an währenddessen neu erzeugten `.next/types`-Dateien; kein Quellcode-Typfehler. Build und Typecheck nacheinander ausführen.
- Build: bestanden, 53 statische Seiten erzeugt. Die vorhandene Konfiguration überspringt Typecheck und Lint im Build; daher separater Typecheck, kein behaupteter Lint-Erfolg.
- Erforderlicher Workaround in dieser Chat-Linux-Umgebung: `NEXT_IGNORE_INCORRECT_LOCKFILE=1` und der bestehende externe Memory-Preload `memory-compat.cjs` über `NODE_OPTIONS`. Der Preload behandelt das bereits bekannte `uv_resident_set_memory`-Problem der Umgebung. Er ist keine Produktdatei und für die Windows-Startanleitung nicht erforderlich. Ein Build ohne diesen bekannten Workaround wurde in diesem Durchlauf nicht erneut ausgeführt.
- Bestehende OpenTelemetry-/Jaeger- und Firebase-Fallback-Warnungen weiterhin vorhanden.
- HTTP-Test: `/`, `/demo`, alle sechs Demo-Schritte, `/faq`, `/pakete-preise` und Nomusas internes Profil liefern 200. Alle neun Mentor-Bilder erreichbar; unbekannter Demo-Schritt liefert 404.
- `git diff --check`: bestanden.
- **Offen:** tatsächliche Browserinteraktion, Hydration, Downloadklick, mobile/desktop Darstellung und clientseitiges Firebase-Verhalten. Der verfügbare Browser blockiert `http://127.0.0.1:3005/demo` mit `ERR_BLOCKED_BY_CLIENT`. HTTP- und Logiktests ersetzen diesen Test nicht.

Keine Commits, Pushes oder Deployments. Keine echten Buchungen, Zahlungen oder Nachrichten ausgelöst.
