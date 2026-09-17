# Erweiterter Inspirations-Pass — 13. September 2026

Aktueller Stand nach zusätzlicher Prüfung der vollständigen Withlocals-Startseite im Live-Browser und der drei bereitgestellten Screenshots. Basis bleibt die zuvor gelieferte Withlocals-inspirierte Version.

## Übertragene Gestaltungsprinzipien

- Kompakte Ortskarten mit Bildüberschrift, heller Textfläche und klarer Aktion; direkt unter dem Hero.
- Drei kurze Vorteile mit Icons und ruhiger gemeinsamer Hintergrundfläche.
- Themenfilter (Alle Eindrücke, Stadt & Kultur, Küste & Meer, Natur entdecken) für eine Galerie aus fünf vorhandenen Original-Reiseaufnahmen.
- Asymmetrisches Bildraster: erster Beitrag im Gesamtüberblick größer, übrige Karten kompakt. Mobile Darstellung einspaltig; Filter umbrechend mit echten Buttons, aria-pressed und Ergebnisankündigung.
- Persönlicher Team-Einstieg mit den beschriftet zugeordneten Portraits von Laura, Niklas und Houssam; ausdrücklich Gründungsteam, keine Mentor- oder Bewertungszuordnung.
- Dunkler Planungsbereich mit Links zu AI Travel Assistant und Community-Stories.
- Bestehende FAQ, Paketstatus, Schritte bis zur Anfrage und datenbasierte Mentorprofile bleiben erhalten.

## Quellen und ehrliche Zuordnung

Referenz: https://www.withlocals.com/de/ — Stadt-/Tourkarten, Vorteile, Themenraster, Host-Banner, Interessen-Auswahl und regionale Abschlussbereiche wurden im Live-DOM sowie an mehreren Scrollpositionen visuell betrachtet.

Keine neuen Fotos hinzugefügt. Die bestehenden Originalbilder stammen weiterhin ausschließlich von Stay Safe & Brave. Die neue Galerie stellt ausdrücklich das Markenarchiv von 2024 dar, keine buchbaren Touren. Ihr gemeinsamer Quellenlink führt zu Lauras vollständigem Originalbericht; Community-Stories sind separat erreichbar.

Bewertungen, Host-Zahlen, Tourpreise, Partnerlogos, Geschenkgutscheine und Zahlungs-/Stornierungsversprechen der Referenz werden nicht übertragen. Es werden keine zusätzlichen verfügbaren Leistungen oder Mentorprofile behauptet.

## Geänderte Dateien dieses Folgeschritts

- src/app/page.tsx
- src/app/globals.css
- src/components/home/destination-cards.tsx
- src/components/home/travel-inspiration.tsx (neu)
- src/components/home/personal-sections.tsx (neu)
- WITHLOCALS_DESIGN_PASS.md und PRUEFEN.txt

## Technische Prüfung des erweiterten Stands

Typecheck und Produktionsbuild bestanden, letzterer mit dem vorhandenen Speichertelemetrie-Workaround und NEXT_IGNORE_INCORRECT_LOCKFILE=1. Bekannte Warnungen bleiben bestehen. Im erzeugten HTML sind alle lokalen Bilddateien, Alt-Attribute und aria-controls-Ziele vorhanden. git diff --check bestanden. Die Filter-Interaktion ist im Code implementiert, aber nicht im laufenden Browser getestet.

## Prüfgrenze

Die Referenzseite konnte live im Browser geprüft werden. Die gerenderte lokale Stay-Safe-&-Brave-Anwendung ist damit nicht visuell abgenommen; ihr Zugriff blieb zuletzt durch ERR_BLOCKED_BY_CLIENT blockiert. Die folgenden älteren Prüfhinweise gelten nur für ihren jeweils beschriebenen Stand.

---

# Bildstarke Startseite — 13. September 2026

Basis: zuletzt gelieferter Visual-Asset-Pass. Referenz: der bereitgestellte Withlocals-Screenshot und https://www.withlocals.com/de/.

## Gestaltung und Verhalten

- Warmer, durchgehender Hintergrund von Startseiten-Header und Hero.
- Große, kräftige Sans-Serif-Headline links; Forest Green und Terrakotta bleiben Markenfarben. Die übrige redaktionelle Typografie bleibt erhalten.
- Breite, abgerundete Reisezielsuche mit gelbem Suchbutton. Natives GET-Formular führt nach `/mentors?location=…`; ohne Auswahl zeigt es alle Orte. Drei direkte Ortslinks ergänzen die Suche.
- Fünf abgerundete Originalfotos in drei versetzten Spalten rechts. Auf Tablet und Mobilgerät stehen Text und Collage untereinander; auf kleinen Mobilgeräten steht der Suchbutton unter dem Auswahlfeld.
- Drei fotografische Ortskarten ersetzen die typografische Stadtliste. Die Bilder sind Reiseimpressionen und werden weder als buchbare Touren noch als Beleg verfügbarer Mentorprofile ausgegeben.
- Keine Withlocals-Fotos, Logos, Bewertungen, Preise oder Texte übernommen. Keine animierten oder funktionslosen Slider-Bedienelemente.

## Ergänzte Originaldateien

Alle Dateien sind unveränderte Originalaufnahmen aus [Lauras Reisebericht](https://www.staysafeandbrave.com/reisebericht-sudafrika-von-gruenderin-laura/). Die Abschnitte im Bericht wurden den Motiven zugeordnet, die Bilddateien einzeln visuell geprüft.

| Lokale Datei unter public/brand/original | Quell-Datei unter https://i0.wp.com/www.staysafeandbrave.com/wp-content/uploads/2024/12/ | Verwendung |
|---|---|---|
| clifton-2024.jpg | Clifton-4th-Beach-768x1024.jpg?ssl=1 | Hero; Tag 8: Kapstadt / Clifton Beach |
| boulders-2024.jpg | Boulders-Beach-2-1024x768.jpg?ssl=1 | Hero; Tag 10–11: Kapstadt / Boulders Beach |
| sunset-2024.jpg | Sunset-2-768x1024.jpg?ssl=1 | Hero; Tag 10–11: Küste bei Kapstadt |
| johannesburg-2024.jpg | Joburg-6-768x1024.jpg?ssl=1 | Johannesburg-Karte; Tag 29–30: Johannesburg, Curiocity-Innenraum |
| durban-2024.jpg | Durban-1-768x1024.jpg?ssl=1 | Durban-Karte; Tag 21–23: Durban / Umhlanga |

Bereits vorhandene Originaldateien: Tafelberg 2018 und Bo-Kaap 2024, Logo und Teamgrafik. Das Tafelbergfoto wird in der Collage verwendet. Teamportraits und Mentor-Daten bleiben unverändert. Eigene Community-Stories behalten ihre eigenen Bilder und ehrlichen Fehler-/Leerzustände.

## Prüfgrenzen

Eine visuelle Endabnahme der gerenderten Anwendung ist nicht behauptet: Der lokale Browserzugriff war zuletzt durch `ERR_BLOCKED_BY_CLIENT` gesperrt. CSS-Breakpoints sind implementiert; die fertige Darstellung ist lokal anhand von PRUEFEN.txt zu prüfen. Keine Daten geschrieben, nichts committed, gepusht oder deployed.

## Ausgeführte technische Prüfung

- `npm run typecheck -- --incremental false`: bestanden.
- `git diff --check`: bestanden.
- Produktionsbuild: bestanden, 36 statische Seiten, mit `NEXT_IGNORE_INCORRECT_LOCKFILE=1` und dem vorhandenen externen Speichertelemetrie-Preload `memory-compat.cjs`. Bestehende Genkit/OpenTelemetry-/Firebase-Warnungen bleiben erhalten.
- Erzeugtes Startseiten-HTML: GET-Suchformular mit Parameter `location` und allen drei Orten vorhanden; fünf Collagebilder vorhanden; sämtliche lokalen Bildreferenzen auflösbar; keine fehlenden Alt-Attribute. Dies ersetzt keine Browser- oder Firebase-Laufzeitprüfung.
