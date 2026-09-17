> Neuer Nutzerauftrag: Die historischen fiktiven Mentorprofile sind jetzt als ausdrücklich markierte Beispiele integriert. Aktuelle Zuordnung und Einschränkungen: ORIGINAL_MENTORS.md. Frühere Aussagen zum Nicht-Übernehmen dieser Bilder gelten für den damaligen Stand.

> Aktueller Folgestand: Withlocals-inspirierte Startseite. Die Beschreibung des ursprünglichen Asset-Passes unten bleibt als Verlauf erhalten; aktuelle Änderungen stehen in WITHLOCALS_DESIGN_PASS.md.

# Visual-Asset-Pass — Stay Safe & Brave

Stand: 13. September 2026. Basis ist die zuletzt gelieferte lokale Production-Polish-Version. Die Struktur, Typografie, Farben, Navigation und Anfrageabläufe bleiben im Kern erhalten. Dieser Pass ändert ausschließlich Bilddarstellung und ihre direkte redaktionelle Einordnung. Nichts committed, gepusht oder deployed.

## 1. Geänderte Seiten

- Startseite: vorhandene rechte Hero-Komposition durch ein passendes Originalfoto ersetzt; den bestehenden Stories-Teaser mit einem Originalbild ergänzt.
- Travel Stories: ein klar gekennzeichneter Einstieg in das Markenarchiv ergänzt. Die Community-Liste sowie ihre Lade-, Leer- und Fehlerzustände bleiben erhalten.
- Über uns: Initialenflächen durch echte Portraitausschnitte aus der beschrifteten Original-Teamgrafik ersetzt. Namen und Rollen unverändert.
- Header/Footer: ursprüngliches Markenlogo anstelle des generischen Kompass-Markenzeichens. Die moderne Navigation, Wortmarke und Farbflächen bleiben erhalten.

## 2. Übernommene Originaldateien

Alle vier Dateien wurden unverändert heruntergeladen und liegen lokal unter `public/brand/original/`. Keine neuen Stockfotos, keine Bildgenerierung, keine fremden Ersatzgesichter. Die Seite ist beim Anzeigen dieser Markenbilder nicht auf einen Abruf vom alten Hosting angewiesen.

| Datei | Verwendung | Originalquelle / Kontext |
|---|---|---|
| `table-mountain-2018.jpg` | Hero | [Bilddatei](https://www.staysafeandbrave.com/wp-content/uploads/2023/04/IMG_1424-2-1024x831.jpg), auf [Über uns](https://www.staysafeandbrave.com/ueber-uns/) als Ausblick vom Tafelberg in Kapstadt (2018) beschriftet. Keine erfundene Reisendenbewertung oder Namenszuordnung. |
| `bo-kaap-2024.jpg` | Stories-Teaser auf Startseite und Stories-Seite | [Originaldatei über den WordPress-Bildcache](https://i0.wp.com/www.staysafeandbrave.com/wp-content/uploads/2024/12/Bo-Kaap-768x1024.jpg?ssl=1), eingebunden in [Lauras Reisebericht](https://www.staysafeandbrave.com/reisebericht-sudafrika-von-gruenderin-laura/). Der Teaser verweist ausdrücklich auf diesen Originalbericht. |
| `team-original.png` | Portraits Laura, Niklas, Houssam | [Beschriftete Originalgrafik](https://www.staysafeandbrave.com/wp-content/uploads/2025/05/Design-ohne-Titel-4.png) auf Über uns. Die Bilddatei bleibt unangetastet; feste CSS-Ausschnitte blenden die alte Grafikgestaltung aus. Die Personen werden anhand der Beschriftung zugeordnet, nicht anhand einer Gesichtserkennung. |
| `logo.png` | Header und Footer | [Original-Markenzeichen](https://www.staysafeandbrave.com/wp-content/uploads/2023/04/Stay-Safe-Brave-neu-1.png), auf der Originalwebsite verwendet. Originalfarben erhalten. |

Gesamtumfang der vier Dateien: rund 1,04 MB. Hero mit hoher Ladepriorität; redaktionelle und Teamaufnahmen werden verzögert geladen. Bildmaße und Seitenverhältnisse sind angegeben, Texte stehen außerhalb der Fotos.

## 3. Bewusst bildlose Lösungen

- Mentorensuche und ihre Leerzustände erhalten keine Bilder aus den fiktiven Originalprofilen. Die [Original-Mentorenseite](https://www.staysafeandbrave.com/finde-deinen-local-mentor/) bezeichnet ihre südafrikanischen Profile ausdrücklich als fiktiv. Sie werden nicht als echte verfügbare Personen übernommen.
- Pakete, Warenkorb und Zahlung bleiben ruhig und bildlos. Reisebilder dienen dort nicht als vermeintlicher Beleg für noch offene Leistungen.
- Die bestehende typografische Stadtliste bleibt erhalten. Es wurden Aufnahmen aus Durban und Johannesburg im Original-Reisebericht geprüft; sie wurden nicht als austauschbare Stadtpanoramen eingesetzt. Der einzige städtisch zugeordnete Hero zeigt das auf der Quelle bezeichnete Kapstadt.
- Community-Stories behalten ausschließlich ihre eigenen gespeicherten Inhaltsbilder beziehungsweise neutrale Fallbacks. Das Bild aus Lauras Bericht wird keinem fremden Beitrag zugewiesen. Bestehende nutzergenerierte Inhalte und private Bilddaten wurden nicht umgeschrieben.
- Kontakt, Vertrauen und AI-Planung erhalten kein dekoratives Füllfoto.

## 4. Fehlendes beziehungsweise nicht übernommenes Material

- Es fehlen zuverlässig zugeordnete Portraits tatsächlich verfügbarer Local Mentoren. Die fiktiven Profile der alten Seite lösen diesen Bedarf nicht.
- Für die drei Teammitglieder existiert ein zuverlässig beschriftetes Sammelbild. Separate hochauflösende Portraitdateien können später nachgereicht werden; die aktuelle Lösung funktioniert mit den Originalausschnitten.
- Der ursprüngliche Startseiten-Hero ist ein Küstenvideo aus dem Theme-Verzeichnis. Es wurde nicht als ortsspezifisch belegte Südafrika-Aufnahme übernommen. Stattdessen wird das besser belegte Tafelbergfoto verwendet.
- Historische Unterstützerlogos wurden gefunden (unter anderem CET und Gründerinnenzentrum), aber nicht als aktuelle Partnerschaften oder Sicherheitsnachweise in die neue Oberfläche aufgenommen.
- Es wurde kein zusätzliches, vom Nutzer hochgeladenes Fotomaterial gefunden; die bisherigen Uploads sind Briefings und ein Fehlerscreenshot.

## Prüfung

Die ausgewählten Originaldateien wurden heruntergeladen und visuell betrachtet; Herkunft und Zuordnung wurden mit den Originalseiten abgeglichen. Die Teamdatei hat 1366 × 768 px; die drei Ausschnitte verwenden unveränderte Bildbereiche ohne alte Namensbanner. Es wurden keine Rasterbilder bearbeitet oder Gesichter ergänzt.

`npm run typecheck` bestanden. Produktionsbuild bestanden mit dem bereits dokumentierten lokalen Speichertelemetrie-Workaround und `NEXT_IGNORE_INCORRECT_LOCKFILE=1`; 36 statische Seiten erzeugt. `git diff --check` bestanden. Bekannte Genkit-/Firebase-Buildwarnungen bleiben unverändert.

Eine gerenderte Prüfung der neuen lokalen Anwendung war in dieser Browserumgebung weiterhin nicht möglich. Auch die isolierte HTML-Prüfansicht wurde von der URL-Sicherheitsrichtlinie blockiert; es wurde kein Umweg oder Deployment vorgenommen. Deshalb ist der visuelle Endzustand im laufenden Produkt noch manuell zu prüfen, insbesondere die Portraitausschnitte und Hero-Bildausschnitte auf Mobilgeräten. Startanleitung: `PRUEFEN.txt`.

Dateien dieses Passes:

```text
PRUEFEN.txt
VISUAL_ASSETS.md
public/brand/original/bo-kaap-2024.jpg
public/brand/original/logo.png
public/brand/original/table-mountain-2018.jpg
public/brand/original/team-original.png
src/app/page.tsx
src/app/stories/page.tsx
src/app/ueber-uns/page.tsx
src/components/content/original-assets.ts
src/components/content/original-story-teaser.tsx
src/components/content/original-team-portrait.tsx
src/components/layout/footer.tsx
src/components/layout/header.tsx
```
