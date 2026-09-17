# Stay Safe & Brave — Production Polish + Truthfulness Pass

13. September 2026. Ausgangsbranch `main`, Commit `504e8e2b186951a191ba492942e95d5d80ceca7f`. Der Remote-Stand wurde erneut über Git und den GitHub-Connector geprüft. Die veröffentlichte AI-Studio-Gestaltung ist nicht vollständig in diesem Branch enthalten. Dieser Pass baut daher auf der bereits gelieferten lokalen Redesign-Arbeitskopie auf und übernimmt gezielt die geprüfte AI-Studio-Richtung: zweigeteilter Hero, editorialer Schriftsatz, Waldgrün, Sand und Terracotta. Es wurde kein weiterer vollständiger Seitenneubau durchgeführt.

**Ergebnis:** Frontendkorrekturen implementiert; Typecheck, gezielte Regressionstests und Build bestanden. Manuelle Browserprüfung des neuen Stands und die vier mobilen Breiten bleiben aufgrund des blockierten lokalen Browserzugriffs offen. Keine Commits, kein Push, kein Deployment.

## 1. Mentor-Konsistenz

Startseite und Suche verwenden denselben Hook `usePublicMentors`, dieselbe Firestore-Collection `mentors` und dieselbe Aufbereitung. Die bisherige Abwärtskompatibilität bleibt bestehen: Ein Profil wird ausgeschlossen, wenn `active` ausdrücklich `false` ist. Fehlende Namen oder IDs führen nicht zu erfundenen Profilen. Detailseiten verwenden ebenfalls die Aufbereitung und die tatsächliche Dokument-ID. Verfügbare Profile werden nicht aus statischen Beispielen aufgefüllt.

Leere Listen erhalten einen gemeinsamen Entdeckungsbereich mit „So funktioniert’s“, Reiseassistent und Kontakt. Dabei wird weder sofortige Buchbarkeit noch eine nicht belegte Rekrutierungsaktivität behauptet. Datenfehler bleiben von leeren Listen getrennt; Filter werden erst bei verfügbaren Profilen gezeigt.

## 2. Entfernte Beispieldaten

Die ungenutzten Dateien `src/lib/placeholder-data.ts` und `src/lib/placeholder-images.json` wurden nach Prüfung ihrer Verweise entfernt. Sie enthielten die alten benannten Mentorbeispiele beziehungsweise Zufallsbild-Zuordnungen. Die öffentlichen Seiten importieren diese Daten nicht mehr. Es wurden keine Namen, Bewertungen, Portraits oder Biografien ergänzt und keine Firestore-Datensätze gelöscht oder geändert.

## 3. Ursache des Stories-Absturzes

Im bisherigen allgemeinen Collection-Hook wurde jeder Snapshot-Fehler in einen `FirestorePermissionError` umgewandelt und über den globalen Error-Emitter weitergegeben. Der globale Listener wirft diesen Fehler, wodurch eine bereits angezeigte leere Stories-Seite in eine vollständige Application-Error-Seite wechseln konnte. Der angezeigte Fehler allein unterscheidet deshalb nicht zuverlässig zwischen einer Regelablehnung, einem fehlenden Index und anderen SDK-Fehlern.

Die ursprüngliche Ursache der abgelehnten Live-Abfrage ist nicht abschließend festgestellt. Aktive Cloud-Regeln oder Indizes wurden nicht verändert. Das ist ein verbleibender Datenzugriffsblocker, falls die Abfrage weiterhin abgelehnt wird.

## 4. Stories-Fix

Öffentliche Listen und Dokumente behandeln Snapshot-Fehler lokal und bewahren den ursprünglichen SDK-Fehler. Beim Wechsel einer Query erscheinen keine alten Ergebnisse; abgemeldete Listener und verspätete Antworten werden abgefangen. Ladezustände erscheinen vor dem ersten Ergebnis statt eines kurzzeitigen falschen Leerzustands.

Die Stories-Liste trennt Laden, keine öffentlichen Stories, Queryfehler und nicht darstellbare veröffentlichte Einträge. Die Detailseite trennt zusätzlich „nicht gefunden“ von Ladefehlern und bietet einen erneuten Ladeversuch. Optionale Mentorinformationen dürfen das Lesen einer Story nicht verhindern.

Die Collection-Group-Abfragen behalten `where("visibility", "==", "public")`. Zusätzlich werden ausschließlich ausdrücklich öffentliche Datensätze zur Darstellung aufbereitet. Ungültige Titel/Inhalte, Bildlisten und Datumswerte werden abgefangen. Private Tagebucheinträge werden weder abgefragt noch als Ersatz verwendet. Nutzertexte werden nicht übersetzt oder umgeschrieben.

## 5. Vertrauensaussagen

Pauschale Verifizierung, feste 5,0-Bewertungen, erfundene Testimonials und Sicherheitsgarantien sind nicht Teil der öffentlichen Ausgabe. Verifizierung erscheint nur für den expliziten Status `verified`; weitere Prüfmerkmale benötigen den booleschen Wert `true`. Karten benötigen gültige Durchschnitts-/Anzahlangaben im echten Datensatz; Detailbewertungen benötigen eine gültige Bewertung zwischen 1 und 5 sowie die bestehende Buchungs-ID-Zuordnung.

Die Echtheit von eingepflegten Aussagen kann eine Frontendprüfung allein nicht bescheinigen. Der Pass erfindet und ergänzt keine Nachweise. Rechtstexte und datenabhängige Prüfmerkmale bleiben bestehen.

## 6. Hero nach dem Polish

**„Individuell reisen. Lokal verbunden.“**

Begleittext: „Stay Safe & Brave verbindet Individualreisende in Südafrika mit persönlichen Local Mentoren – für lokale Perspektiven und Austausch vor und während der Reise.“

Hauptaktion: „Local Mentor finden“. Zweite Aktion: „So funktioniert’s“. Keine Jahreszahl, Sicherheitskennzahl oder Testimonial-Einblendung. Der zweigeteilte Aufbau und die Serifenschrift mit kursivem Terracotta-Akzent greifen die geprüfte visuelle Richtung auf. Der neutrale rechte Bildbereich bleibt austauschbar.

## 7. Bilder

Keine zufälligen Stadt- oder Mentorzuordnungen. `ContentImage` verwendet vorhandene zulässige Inhalts-URLs oder lokale Bildpfade und zeigt bei bekannten Platzhalterquellen, fehlenden Bildern oder Ladefehlern einen neutralen Ersatz. Es wurden keine Personenbilder generiert. Echte freigegebene Team-, Mentor- und Reisefotos bleiben ein Inhaltsbedarf. Beliebige bereits gespeicherte Bild-URLs sind nicht automatisch ein Echtheitsnachweis.

## 8. Angebot und Zahlung

Die allgemeine Paketübersicht erklärt Kennenlernen, Wünsche und Klärung vor Bestätigung. Sie zeigt keine drei kaufähnlich vergleichbaren Angebote. Erst bei einem tatsächlich verfügbaren ausgewählten Mentor erscheint die vorläufige Paketbezeichnung, die das bestehende Anfrageformular benötigt. Ihre fehlende Leistungsdifferenzierung wird erklärt; eine Aufhebung dieses Pflichtfeldes würde einen weitergehenden Eingriff in den Anfragevertrag erfordern.

Fehlende oder nicht verfügbare Profile erhalten keinen aktiven Weiter-Button in diesem Paketeinstieg. Auch zuvor gespeicherte Warenkorbpreise werden nicht mehr als gültige aktuelle Preise angezeigt. Warenkorb und Zahlungsinformation zeigen „Preis in Abstimmung“. Der reguläre Weg führt nicht zur Zahlung. Stripe und Buchungsschema bleiben unverändert.

## 9. Sprache

Öffentliche Systemtexte verwenden Local Mentor, Begleitung und Anfrage. Die Suche nach den alten Tour-/Guide-Formulierungen und den Beispielen Aisha, Bongani, Sarah und Lena fand nach Bereinigung keine entsprechenden Vorkommen mehr in den geprüften App-/Komponenten-/Bibliotheksquellen. Echte englische Nutzertexte bleiben unverändert. Ein fehlender Profilort wird als „Ort nicht angegeben“ bezeichnet und nicht durch eine erfundene Ortszuordnung ersetzt.

## 10. Header und Footer

Die bestehende reduzierte Navigation bleibt: Local Mentoren, So funktioniert’s, Südafrika entdecken, Reise planen sowie Konto. Die Wortmarke mit dunklem Symbolfeld wurde an die stärkere Markenrichtung angeglichen. Der Footer erhält die dunkelgrüne Fläche, Gruppen für Entdecken, Stay Safe & Brave, Support und einen rechtlichen Navigationsbereich. Keine Newsletterformulare oder `#`-Sociallinks. Kontaktinhalt bleibt auf vorhandene verifizierte Angaben beschränkt; das Formular meldet Erfolg nur bei erfolgreicher API-Antwort. Die E-Mail-Backendlogik ist unverändert.

## 11. Mobile Anpassungen und Grenze

Kleine Buttons und Select-Trigger haben mindestens 44 px Höhe. Der Footer wechselt über zwei Spalten zu vier Desktopspalten. Leerzustände haben kleinere mobile Innenabstände und umbrechende Aktionen. Metadaten in Stories dürfen umbrechen. Langer Storytext wird umgebrochen. Die CSS-Breitenberechnung der Dialoge wurde auf gültige `calc`-Subtraktion korrigiert; die Höhenbegrenzung bleibt. Der Hero hat angepasste Schriftgrößen und eine kleinere neutrale Bildkomposition auf schmalen Breiten.

**Keine bestandene reale Sichtprüfung bei 320, 390, 768 oder 1024 px:** Der lokale Server startete, der Browser lehnte `http://127.0.0.1:3004/` mit `net::ERR_BLOCKED_BY_CLIENT` ab. Es wurde kein Deployment als Umweg vorgenommen. Die Startanleitung enthält die verbleibende Sichtprüfung. CSS-Anpassungen und Build ersetzen keine Browserprüfung.

## 12. Barrierearmut

Status- und Fehlerbereiche sind unterscheidbar und semantisch beschriftet; die leere Mentorensuche ist kein Fehleralarm. Sichtbare Fokuszustände, Eingabelabels, Sprunglink, Reduced-Motion-Regeln und klarere deaktivierte Aktionen bleiben erhalten. Text-/Buttonkontraste wurden rechnerisch anhand der Tokens geprüft: Haupttext auf Hintergrund etwa 12,4:1, sekundärer Text etwa 5,9:1, Weiß auf Terracotta etwa 6,86:1. Der zuvor schwächere Eingaberahmen wurde abgedunkelt. Diese Tokenprüfung ist keine vollständige WCAG- oder gerenderte Kontrastprüfung.

## 13. Verbleibende echte Inhalte und Blocker

Benötigt werden verfügbare echte Mentorprofile, freigegebene Portraits und Reisebilder, echte öffentliche Stories, belastbare Bewertungs-/Prüfdaten und verbindlich definierte Unterstützungsleistungen/Preise. Die aktiven Regeln beziehungsweise Indizes müssen separat geprüft werden, falls öffentliche Story-Abfragen weiter scheitern. UI-Fehlerbehandlung stellt keine abgelehnten Datenzugriffe wieder her.

Die Teamrollen von Laura, Niklas und Houssam bleiben wie im Briefing. Keine neuen Teamaktivitäten oder Biografien wurden behauptet. Die veröffentlichten Seiten wurden nicht aktualisiert; ihre angezeigte Version ist weiterhin unabhängig von dieser ZIP-Arbeitskopie.

## 14. Typecheck und Regressionstests

`npm run typecheck`: **bestanden, Exitcode 0**. Gezielte Tests bestanden für öffentliche/private und fehlerhafte Storydaten, sichere Datumsbehandlung, explizite Prüfmerkmale, gültige verknüpfte Bewertungen, Erhalt der SDK-Fehlercodes, ersten Ladezustand, Querywechsel, Listenerabbau und verspätete Callbacks. Die öffentlichen Visibility-Filter wurden geprüft. `git diff --check` bestanden.

Der Vergleich der rechtlichen JSX-Texte mit dem Ausgangscommit war identisch. Firebase-Konfiguration, Firestore-Regeln, Auth-/Rollenbereiche, DTO-Schema, API-/AI-Backenddateien, Projektabhängigkeiten und Next-Konfiguration zeigen keine Änderungen durch diesen Pass.

## 15. Build

Produktionsbuild **bestanden, Exitcode 0**, alle 36 statischen Seiten erzeugt. Wie beim bisherigen Redesign war ausschließlich für diese Arbeitsumgebung der lokale Speichertelemetrie-Workaround außerhalb des Repositorys erforderlich:

```sh
NEXT_IGNORE_INCORRECT_LOCKFILE=1 \
NODE_OPTIONS='--require=/workspace/scratch/a9a7b5df5bf1/memory-compat.cjs' \
npm run build
```

Bestehende Genkit/OpenTelemetry-Warnungen und die Firebase-Initialisierung mit anschließendem Konfigurationsfallback bleiben. Der Standardbuild ohne diesen lokalen Umgebungsworkaround ist damit nicht neu als erfolgreich verifiziert ausgewiesen. Es wurden keine Abhängigkeiten aktualisiert.

## 16. Manuell geprüfte Laufzeitseiten

**Neuer lokaler Stand: keine Browserseite abschließend geprüft**, weil schon die Startseite am lokalen Browserzugriff blockiert wurde. Der Server meldete „Ready“; das allein bestätigt keine Client-Laufzeitfunktion. Insbesondere `/`, `/mentors`, ein echtes Profil, `/stories`, `/pakete-preise`, `/ueber-uns`, `/kontakt` und `/travel-assistant` bleiben als manuelle Abschlussprüfung offen.

Die zuvor besuchten Live-Seiten lieferten die Fehlerbelege und die visuelle Referenz, sind aber kein Nachweis für diese Änderungen. Keine Kontaktformulare, Buchungen, Zahlungen oder privaten Nachrichten wurden zum Test abgesendet.

## 17. Exakte Dateiliste

Die erste Liste zeigt ausschließlich diesen Pass gegenüber der zuletzt bereitgestellten lokalen Arbeitskopie. Die vollständige ZIP enthält zusätzlich die bisherigen Redesignänderungen. `D` bedeutet gelöscht, `A` neu, `M` geändert.

28 Dateien in diesem Pass.

```text
A PRODUCTION_POLISH_REPORT.md
A PRUEFEN.txt
M src/app/bezahlen/page.tsx
M src/app/booking/page.tsx
M src/app/globals.css
M src/app/kontakt/page.tsx
M src/app/mentors/[mentorId]/page.tsx
M src/app/mentors/page.tsx
M src/app/page.tsx
M src/app/pakete-preise/page.tsx
M src/app/stories/[storyId]/page.tsx
M src/app/stories/page.tsx
M src/app/warenkorb/page.tsx
A src/components/content/public-data.ts
M src/components/home/featured-mentors.tsx
M src/components/layout/footer.tsx
M src/components/layout/header.tsx
M src/components/mentors/mentor-card.tsx
A src/components/mentors/mentor-empty-state.tsx
M src/components/ui/button.tsx
M src/components/ui/content-image.tsx
M src/components/ui/dialog.tsx
M src/components/ui/select.tsx
M src/hooks/use-public-collection.ts
A src/hooks/use-public-document.ts
A src/hooks/use-public-mentors.ts
D src/lib/placeholder-data.ts
D src/lib/placeholder-images.json
```

Gesamter ZIP-Stand gegenüber dem Repository-Ausgangscommit:

```text
PRODUCTION_POLISH_REPORT.md
PRUEFEN.txt
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
src/components/content/public-data.ts
src/components/home/featured-mentors.tsx
src/components/layout/footer.tsx
src/components/layout/header.tsx
src/components/layout/workspace-nav.tsx
src/components/mentors/mentor-card.tsx
src/components/mentors/mentor-empty-state.tsx
src/components/mentors/mentor-filters.tsx
src/components/travel-assistant/travel-assistant-form.tsx
src/components/travel-assistant/travel-chat.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/content-image.tsx
src/components/ui/dialog.tsx
src/components/ui/input.tsx
src/components/ui/select.tsx
src/hooks/use-chat-scroll.ts
src/hooks/use-public-collection.ts
src/hooks/use-public-document.ts
src/hooks/use-public-mentors.ts
src/lib/placeholder-data.ts
src/lib/placeholder-images.json
```
