# Stay Safe & Brave — Abschlussbericht zum Redesign

Stand: 12. September 2026. Lokale Arbeitskopie von `main`, Ausgangscommit `504e8e2b186951a191ba492942e95d5d80ceca7f`.

Das Redesign wurde entsprechend dem zuletzt angehängten Implementierungsbriefing umgesetzt. Es wurde nichts committed, gepusht oder deployed. Die aktuelle Next.js-/Firebase-Anwendung war die Grundlage; die historische Website wurde nicht als Layoutvorlage übernommen.

## 1. Visuelle Richtung

Warme Sand- und Offwhite-Flächen, dunkelgrüne Schrift, dunkles Terracotta für Hauptaktionen. Geist bleibt die UI-/Leseschrift; Georgia setzt ausgewählte große Marketingüberschriften ab. Weniger Schatten und umrahmte Karten, mehr Weißraum und klare Textgliederung. Die Positionierung betont individuelle Südafrikareisen mit persönlichem Local Mentor.

## 2. Bearbeitete Seiten

Grundlegend neu aufgebaut: Startseite, Über uns, Vertrauen/Begleitung, Paketübersicht und Einstiegsseite des AI Travel Assistant. Überarbeitet: Mentorensuche und Profile, öffentliche Stories und Artikeldetails, Kontakt, Anfrage, Auswahl/Warenkorb, Zahlungsinformation und Anfragestatus. Login/Registrierung, Dashboard mit Anfragen, Nachrichten und Einstellungen, Reisetagebuch sowie Mentor- und Adminbereiche wurden in Darstellung und Bedienung angepasst. Rechtliche Seiten erhielten ausschließlich Layoutanpassungen. Die Bearbeitungstiefe ist damit je nach Seite unterschiedlich; bestehende operative Formulare und Abläufe bleiben erhalten.

## 3. Gemeinsame Komponenten

Neue Farb-/Abstandsvariablen und Layoutklassen; überarbeitete Buttons, Eingaben, Karten und Dialoge. Header und Footer wurden neu aufgebaut. Neu sind `FeaturedMentors`, `WorkspaceNav`, `ContentImage` und `useChatScroll`. Mentor-Karten und Filter sowie beide Chatoberflächen und der AI-Chat nutzen die neue Gestaltung. Ladeansichten zentraler öffentlicher Seiten wurden an den reduzierten Aufbau angepasst.

## 4. Startseite

Ein einzelner Hero erklärt Zielgruppe, Produkt und nächsten Schritt. Hauptaktion: „Local Mentor finden“. Danach folgen echte verfügbare Mentorprofile, Unterstützung vor/während der Reise, drei Schritte, Ortslinks, ehrlicher Angebotsstand, Story-Einstieg, AI-Planungsstart, FAQ und Abschlussaktion. Die Ortslinks übergeben einen Standortfilter. Ein abstraktes Linienmotiv ersetzt zufällige Reisefotografie. Der Story-Bereich ist ein Einstieg in die Sammlung, kein erfundener Erfahrungsbericht.

## 5. Mentorenerlebnis

Karten priorisieren Portrait, Vorname, Ort, persönliche Beschreibung, Interessen und Sprachen. Verifizierung wird datenabhängig angezeigt; Bewertungen benötigen gültige Bewertungsdaten und eine positive Bewertungsanzahl. Fehlende oder nicht ladbare Bilder haben einen neutralen Ersatz. Die Suche übernimmt den Standort aus der URL, bietet reduzierte mobile Filter und einen Fehlerzustand mit erneutem Ladeversuch. Profile erhalten einen klareren Anfrage-Einstieg; die drei scheinbar vergleichbaren Paketkarten wurden entfernt.

## 6. Stories

Redaktionellere Überschriften, ruhigere Artikelgestaltung und vorhandene Story-Bilder mit Fehlerersatz. Es werden keine Reiseerlebnisse, Bilder oder Autorenaussagen erfunden. Der Teilen-Dialog berücksichtigt fehlgeschlagene Zwischenablagezugriffe. Bestehende Veröffentlichungsregeln und Datenbeziehungen bleiben erhalten.

## 7. Anfrageweg, Pakete, Auswahl und Zahlung

Pakete werden als aktueller Angebotsstand dargestellt. Nicht belegte Unterschiede und Preise werden nicht ergänzt. Die Auswahl führt mit vorhandenem Mentor direkt zur Anfrage; sonst zur Mentorensuche. Der reguläre Ablauf enthält keine Zahlungsaufforderung. Die weiterhin erreichbare Zahlungsseite erklärt den nicht verfügbaren Stand. Das Anfrageformular bewahrt einen lokalen Sitzungsentwurf über den Login hinweg; die Buchungsschreiblogik bleibt bestehen. Die direkt aufrufbare Bestätigungsroute behauptet keinen pauschalen Erfolg und verweist zum tatsächlichen Status im Dashboard.

## 8. Dashboard und interne Bereiche

Eine kompakte Arbeitsnavigation verbindet Übersicht, Anfragen, Nachrichten, Tagebuch und Profil. Die Dashboardübersicht priorisiert Reise-/Anfrageaktionen anstelle einer großen Profilkarte. Nicht funktionale Benachrichtigungsschalter wurden entfernt. Chats haben ein begrenztes, separat scrollbareres Nachrichtenfeld und eine Aktion für neue Nachrichten, wenn man ältere Inhalte liest. Das Tagebuch zeigt Privat-/Öffentlich-Zustände deutlicher und bestätigt Veröffentlichen/Löschen aus der Übersicht. Admin- und Mentorbereiche wurden visuell beruhigt; technische Hilfstexte wurden reduziert. Authentifizierte Abläufe wurden anhand des Codes bearbeitet, nicht mit privaten Testkonten durchgespielt.

## 9. Mobile Verbesserungen und Prüflimit

Gestapelte Aktionen, kleinere Containerabstände, früh auf die mobile Navigation wechselnder Header, ausklappbare Zusatzfilter, begrenzte Dialoghöhe, größere Eingabeflächen und Chat-Höhen mit dynamischen Viewporteinheiten sind implementiert. Überschriften dürfen umbrechen; die Navigation vermeidet die dichte Desktopdarstellung bei 1024 px.

Die angeforderten Sichtprüfungen bei **320, 390, 768 und 1024 px sind nicht abgeschlossen**. Der verfügbare Browser verweigerte die lokale Vorschau mit `net::ERR_BLOCKED_BY_CLIENT`. Daher gibt es keine belastbare Aussage, dass sämtliche Seiten bei diesen Breiten frei von Overflow sind. Geschützte Ansichten, mobile Tastatur, Dialoge und lange reale Inhalte benötigen noch eine Sichtprüfung in einer erreichbaren Vorschau. Es wurde hierfür nichts deployed.

## 10. Barrierearmut

Dunklere Text-/Aktionsfarben, sichtbare Fokusmarkierungen, Sprunglink zum Hauptinhalt, beschriftete Navigationsbereiche und Chatfelder, größere Standardbuttons, Autocomplete bei Zugangsfeldern, Statusbeschriftung in neuen Ladeansichten und Reduced-Motion-Regeln sind umgesetzt. Dialoge bleiben scrollbar. Dies ist keine abgeschlossene WCAG-Zertifizierung oder vollständige Screenreader-/Tastaturprüfung.

## 11. Bildbehandlung

Vorhandene Inhalts-URLs bleiben nutzbar. Bekannte Zufalls-/Platzhalterquellen werden in `ContentImage` abgefangen; Ladefehler führen zu neutralen Bildflächen. Es wurden keine Fotos generiert und keine realen Menschen oder Orte durch zufällige Motive dargestellt. Das Team wird ohne erfundene Portraits gezeigt. Die Komponente ist die gemeinsame Austauschstelle für spätere freigegebene Bilder; die Echtheit beliebiger vorhandener Datenbankbilder kann der Code allein nicht bestätigen.

## 12. Entfernte Platzhalter

Entfernt wurden zufällige Marketingbilder, die doppelte Hero-Struktur, nicht funktionale Newsletter-/Social-Oberflächen, offensichtliche Kontakt-/Kartenplatzhalter, scheinbar belegte Paketunterschiede, der Zahlungsabzweig im regulären Anfrageweg, die pauschale Erfolgsaussage der Bestätigungsseite und die nicht funktionsfähige Benachrichtigungsoption. Formularbeispiele wie Name oder E-Mail sind weiterhin bewusst als Eingabeplatzhalter vorhanden.

## 13. Offene Inhalte, Daten und Grenzen

Benötigt werden freigegebene echte Portraits/Reisefotos, belastbare Paketleistungen und Preise sowie echte veröffentlichte Stories und Bewertungs-/Verifizierungsdaten. Fehlende Inhalte werden reduziert dargestellt. Die angegebenen Teamrollen von Laura, Niklas und Houssam wurden beibehalten. Rechtsinformationen wurden nicht inhaltlich neu geschrieben. Zahlungsaktivierung und Änderungen an Backendprozessen gehören nicht zu dieser Umsetzung.

Firebase-Konfiguration, Projekt, Firestore-Regeln, Datenmodell, Auth-/Rollenprüfungen sowie AI-, Stripe- und E-Mail-Backenddateien sind unverändert. `package.json`, `package-lock.json` und `next.config.ts` sind unverändert; es wurden keine neuen Projektabhängigkeiten hinzugefügt. Der Textvergleich der JSX-Inhalte von AGB, Datenschutz und Impressum mit dem Ausgangscommit war identisch. Die Browserprüfung und authentifizierte Ende-zu-Ende-Prüfungen bleiben offen.

## 14. Typecheck

`npm run typecheck` **bestanden**, Exitcode 0. Die separate Prüfung ist relevant, da die bestehende Next-Konfiguration Typ-/Lint-Prüfungen beim Build überspringt. `git diff --check` war ebenfalls ohne Befund.

## 15. Build

Der Produktionsbuild **bestand mit einem ausschließlich lokalen Umgebungsworkaround**, Exitcode 0; alle 36 statischen Seiten wurden erzeugt. Der unveränderte Standardaufruf scheiterte zunächst an `uv_resident_set_memory` dieser Node-Arbeitsumgebung. Ein Preload außerhalb des Repositorys verwendet bei genau diesem Systemfehler V8-/Prozessmesswerte für die Speicherauskunft. Zusätzlich wurde der automatische Next-Lockfile-Reparaturversuch deaktiviert, da der vorhandene Lockfile optionale Plattformabhängigkeiten nicht vollständig enthält.

Verwendeter erfolgreicher Aufruf:

```sh
NEXT_IGNORE_INCORRECT_LOCKFILE=1 \
NODE_OPTIONS='--require=/workspace/scratch/a9a7b5df5bf1/memory-compat.cjs' \
npm run build
```

Es bleiben Buildwarnungen aus Genkit/OpenTelemetry und die bestehende Firebase-Initialisierung mit anschließendem Konfigurationsfallback. Diese Backendbereiche wurden nicht verändert. `npm ci` scheiterte am bestehenden Lockfile; die vorhandenen Abhängigkeiten wurden mit `npm install --no-package-lock --no-audit --no-fund` installiert. Ein normaler CI-Build ohne den Umgebungsworkaround ist hier deshalb nicht als erfolgreich verifiziert ausgewiesen.

## Nachtrag: öffentliche Abfragefehler

Nach dem Windows-Vorschautest wurde die Fehlerbehandlung von Startseiten-Mentoren, Mentorensuche und Stories auf einen separaten UI-Hook umgestellt. Er bewahrt die ursprünglichen Firebase-Fehlercodes und stellt Datenfehler lokal dar, statt sie über den bestehenden globalen Listener als Laufzeitabsturz auszulösen. Die Abfragen und Zugriffsregeln bleiben unverändert. Die Stories-Fehleransicht zeigt den SDK-Code zur weiteren Diagnose; abgelehnte Datenzugriffe sind damit nicht behoben. Typecheck, gezielte Tests für Fehlerzustände/Abmeldung/späte Callbacks und Produktionsbuild mit dem oben genannten Umgebungsworkaround bestanden. Der ursprüngliche Fehler wurde anhand des Nutzer-Screenshots analysiert; die aktiven Firebase-Regeln wurden nicht aus der Cloud abgerufen.

## 16. Exakte Liste geänderter Dateien

Pfade relativ zum Repository, einschließlich neuer Dateien und dieses Berichts.

70 Dateien insgesamt.

```text
REDESIGN_REPORT.md
src/app/admin/layout.tsx
src/app/admin/mentors/page.tsx
src/app/admin/page.tsx
src/app/admin/reviews/page.tsx
src/app/agb/loading.tsx
src/app/agb/page.tsx
src/app/auth/login/loading.tsx
src/app/auth/login/page.tsx
src/app/bezahlen/loading.tsx
src/app/bezahlen/page.tsx
src/app/booking/page.tsx
src/app/buchung-bestaetigt/loading.tsx
src/app/buchung-bestaetigt/page.tsx
src/app/dashboard/bookings/loading.tsx
src/app/dashboard/bookings/page.tsx
src/app/dashboard/layout.tsx
src/app/dashboard/loading.tsx
src/app/dashboard/messages/[conversationId]/page.tsx
src/app/dashboard/messages/loading.tsx
src/app/dashboard/messages/page.tsx
src/app/dashboard/page.tsx
src/app/dashboard/settings/loading.tsx
src/app/dashboard/settings/page.tsx
src/app/datenschutz/loading.tsx
src/app/datenschutz/page.tsx
src/app/globals.css
src/app/impressum/loading.tsx
src/app/impressum/page.tsx
src/app/kontakt/loading.tsx
src/app/kontakt/page.tsx
src/app/layout.tsx
src/app/mentor/layout.tsx
src/app/mentor/messages/[conversationId]/page.tsx
src/app/mentor/messages/page.tsx
src/app/mentors/[mentorId]/page.tsx
src/app/mentors/layout.tsx
src/app/mentors/loading.tsx
src/app/mentors/page.tsx
src/app/page.tsx
src/app/pakete-preise/layout.tsx
src/app/pakete-preise/loading.tsx
src/app/pakete-preise/page.tsx
src/app/reiseberichte/loading.tsx
src/app/reiseberichte/page.tsx
src/app/sicherheitsrichtlinien/loading.tsx
src/app/sicherheitsrichtlinien/page.tsx
src/app/stories/[storyId]/page.tsx
src/app/stories/layout.tsx
src/app/stories/page.tsx
src/app/travel-assistant/page.tsx
src/app/ueber-uns/loading.tsx
src/app/ueber-uns/page.tsx
src/app/warenkorb/loading.tsx
src/app/warenkorb/page.tsx
src/components/home/featured-mentors.tsx
src/components/layout/footer.tsx
src/components/layout/header.tsx
src/components/layout/workspace-nav.tsx
src/components/mentors/mentor-card.tsx
src/components/mentors/mentor-filters.tsx
src/components/travel-assistant/travel-assistant-form.tsx
src/components/travel-assistant/travel-chat.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/content-image.tsx
src/components/ui/dialog.tsx
src/components/ui/input.tsx
src/hooks/use-chat-scroll.ts
src/hooks/use-public-collection.ts
```
