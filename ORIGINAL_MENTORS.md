# Interne Mentorprofile — aktueller Folgestand

Alle neun Profile besitzen jetzt eigene Detailseiten unter `/mentors/profil/<slug>`. Bilder, Namen und „Profil ansehen“ in den Karten führen intern dorthin. Die sichtbaren Hinweise auf eine alte oder ursprüngliche Website wurden aus der Mentor-Oberfläche entfernt. Quellen werden ausschließlich in dieser technischen Dokumentation festgehalten.

## Übernommene Informationen

- Profilnamen, zugeordnete Städte und vorhandene Bilder.
- Individuelle Sprachangaben aus allen neun Detailseiten.
- Altersangaben aus den Detailseiten beziehungsweise der ursprünglichen Profilübersicht.
- Biografische Informationen, familiärer und örtlicher Hintergrund, Freizeitinteressen und lokale Schwerpunkte. Texte wurden inhaltlich übernommen und redaktionell in kompaktere Absätze in der dritten Person gefasst; keine wortgetreue Textkopie behauptet.
- Die acht gemeinsam beschriebenen Begleitungsleistungen, als Leistungsbeispiele eines fiktiven Profils gekennzeichnet. Keine Verfügbarkeits- oder Preiszusage.
- Empfehlungen für weitere Beispielprofile derselben Stadt sowie Rücknavigation zur städtisch gefilterten Übersicht.

Die ursprünglichen Sternebewertungen werden weiterhin nicht als echte Bewertungen angezeigt. Alle neun Profile behalten die Kennzeichnung als fiktive Beispiele und sind nicht an eine Buchung oder Firestore-Datensätze angebunden. Der Kontakt-CTA richtet sich an das Plattformteam. Die Beispiel-Detailseiten sind mit `noindex` gekennzeichnet; unbekannte Slugs sollen 404 liefern.

## Prüfung des aktuellen Stands

Separater Typecheck und Produktionsbuild bestanden (45 statische Seiten, mit bestehendem Speichertelemetrie-Workaround und NEXT_IGNORE_INCORRECT_LOCKFILE=1). Alle neun internen Profilseiten lieferten im lokalen HTTP-Test 200; ein unbekannter Slug lieferte 404. Alle Bilddateien vorhanden. Sprachen aller neun Profile mit den Quellen abgeglichen. Keine externen Mentor-Profillinks auf Startseite, Übersicht oder Detailseiten. Bestehende Buildwarnungen bleiben erhalten. Die tatsächliche Browserdarstellung wurde nicht visuell abgenommen.

## Aktueller Code

- `src/components/content/original-mentors.ts`: lokale Profilinhalte ohne externe Quell-URLs.
- `src/components/mentors/original-mentor-examples.tsx`: interne Kartenlinks, Sprachen, Kurzvorstellung und Interessen.
- `src/app/mentors/profil/[slug]/page.tsx`: neun statisch generierte Detailseiten mit Metadaten.

Die nachfolgenden Angaben dokumentieren den vorangegangenen Import. Dessen externe Profil-Links wurden durch die internen Seiten ersetzt.

---

# Original-Mentorprofile — 13. September 2026

Auf Nutzerwunsch wurden die neun südafrikanischen Beispielprofile aus der ursprünglichen Website in die zuletzt bearbeitete Version übernommen.

Quelle: https://www.staysafeandbrave.com/finde-deinen-local-mentor/

Die Quellseite bezeichnet die südafrikanischen Profile ausdrücklich als fiktiv. Deshalb sind sie sowohl im Abschnitt als auch auf jeder Karte als Beispielprofile gekennzeichnet. Ihre Namen bezeichnen die historischen fiktiven Profile, nicht verifizierte Identitäten der abgebildeten Personen. Sternebewertungen, Verifizierung, Alter und Buchungsfunktionen wurden nicht übernommen. Original-Profillinks führen in einem neuen Tab zur historischen Website; deren Buchungsangaben gelten nicht für diese Anwendung.

## Einbindung

- Startseite: drei Beispiele, eines je Stadt.
- /mentors: alle neun Profile, eigener Stadtfilter. Ein per URL gewählter unterstützter Ort wird als Ausgangsfilter berücksichtigt.
- Beispiele bleiben separat von den vorhandenen Firebase-Profilen und deren Lade-/Fehler-/Leerzuständen sichtbar.
- Keine Firestore-Seeds, Datenbankänderungen, neuen Buchungsziele oder erfundenen Interessen/Sprachen.
- Bilddateien unverändert lokal unter public/brand/original/mentors/; insgesamt rund 885 KB.
- Das bereits vorhandene echte Gründungsteam bleibt separat.

## Bild- und Profilzuordnung

| Name | Stadt | Original-Bildquelle | Originalprofil |
|---|---|---|---|
| Nomusa Ndlela | Kapstadt | https://staysafeandbrave.com/wp-content/uploads/2023/05/smile-2072907_1920-1-784x1024.jpg | https://www.staysafeandbrave.com/nomusa-ndlela/ |
| Pieter van Zyl | Kapstadt | https://staysafeandbrave.com/wp-content/uploads/2023/05/grandpa-and-grandchildren-56955_1920-1024x709.jpg | https://www.staysafeandbrave.com/pieter-van-zyl/ |
| Leonie Köster | Kapstadt | https://staysafeandbrave.com/wp-content/uploads/2023/05/woman-657753_1920-683x1024.jpg | https://www.staysafeandbrave.com/leonie-koester/ |
| Til Stratmann | Johannesburg | https://staysafeandbrave.com/wp-content/uploads/2023/05/man-3803551_1920-1024x768.jpg | https://www.staysafeandbrave.com/til-stratmann/ |
| Elsabe Viljoen | Johannesburg | https://staysafeandbrave.com/wp-content/uploads/2023/05/woman-597173_1920-683x1024.jpg | https://www.staysafeandbrave.com/elsabe-viljoen/ |
| Zinhle Ngcobo | Johannesburg | https://staysafeandbrave.com/wp-content/uploads/2023/05/attractive-1869761_1920-1024x683.jpg | https://www.staysafeandbrave.com/zinhle-ngcobo/ |
| Lindiwe Khumalo | Durban | https://staysafeandbrave.com/wp-content/uploads/2023/05/woman-1274361_1920-1024x768.jpg | https://www.staysafeandbrave.com/lindiwe-khumalo/ |
| Themba Zwane | Durban | https://staysafeandbrave.com/wp-content/uploads/2023/05/man-2442565_1920-819x1024.jpg | https://www.staysafeandbrave.com/themba-zwane/ |
| Hendrik Botha | Durban | https://staysafeandbrave.com/wp-content/uploads/2023/05/happy-1836445_1920-1024x683.jpg | https://www.staysafeandbrave.com/hendrik-botha/ |

## Prüfgrenze

Die lokale Browserdarstellung konnte bisher wegen ERR_BLOCKED_BY_CLIENT nicht abgenommen werden. Karten und Filter sind implementiert; Darstellung und Bedienung bleiben lokal zu prüfen. Nichts committed, gepusht oder deployed.

## Technische Prüfung dieses Stands

Separater Typecheck und Produktionsbuild bestanden. Build mit vorhandenem externem Speichertelemetrie-Workaround und NEXT_IGNORE_INCORRECT_LOCKFILE=1; bekannte Warnungen bleiben bestehen. Erzeugtes HTML: drei Beispielbilder und Kennzeichnungen auf der Startseite, neun auf /mentors, alle Bilddateien vorhanden und mit ausdrücklich fiktiver Zuordnung im Alt-Text. Keine gerenderte visuelle Prüfung oder Browser-Filterprüfung behauptet.
