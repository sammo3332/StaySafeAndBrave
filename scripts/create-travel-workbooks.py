"""New brand workbooks; not the missing historical information pack. Requires reportlab."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
for name,file in [("SSBSans","DejaVuSans.ttf"),("SSBBold","DejaVuSans-Bold.ttf"),("SSBSerif","DejaVuSerif.ttf")]:
 pdfmetrics.registerFont(TTFont(name,"/usr/share/fonts/truetype/dejavu/"+file))
from reportlab.lib.colors import HexColor
ROOT=Path(__file__).resolve().parents[1]
DATA={
'de':[
('Dein Reisebegleiter','Raum für deine Pläne.', [('Deine Reise','Name / Reiseziel / Reisezeit'),('Dein persönlicher Kontakt','Name / vereinbarter Kontaktweg / Kennenlerntermin'),('Was dir wichtig ist','Deine Wünsche, Interessen und Fragen')]),
('Vor dem ersten Gespräch','Gut vorbereitet kennenlernen.', [('Fragen für deinen Local Mentor','Was möchtest du über Alltag, Orientierung und Treffpunkte wissen?'),('Gemeinsam abstimmen','Zeitraum, Umfang, Erreichbarkeit und vereinbarte Leistungen notieren.'),('Dein eigener Reiseplan','Unterkunft, Transport und persönliche Pläne zusammenstellen.')]),
('Ankommen in deinem Tempo','Platz für praktische Details.', [('Anreise','Flugnummer / Ankunft / Unterkunft / selbst organisierter Transfer'),('Persönliche Packliste','Dokumente / Kleidung / Ladegeräte / persönliche Dinge'),('Deine nächsten Schritte','Was möchtest du nach der Ankunft zuerst erledigen?')]),
('Deine Notizen','Erlebnisse festhalten.', [('Vorfreude','Worauf freust du dich besonders?'),('Unterwegs','Was möchtest du ausprobieren, was lieber offen lassen?'),('Nach der Reise','Was nimmst du mit? Was würdest du beim nächsten Mal ändern?')])],
'en':[
('Your travel companion','Make room for your plans.', [('Your journey','Name / destination / travel dates'),('Your personal contact','Name / agreed contact method / introductory meeting'),('What matters to you','Your wishes, interests and questions')]),
('Before the first conversation','Get to know each other.', [('Questions for your local mentor','What would you like to know about daily life and meeting points?'),('Agree on the details','Write down dates, scope, availability and agreed services.'),('Your own travel plan','Organise your accommodation, transport and personal plans.')]),
('Arrive at your own pace','Keep practical details together.', [('Arrival','Flight / arrival time / accommodation / your own transfer'),('Personal packing list','Documents / clothing / chargers / personal items'),('Your next steps','What would you like to do first after arriving?')]),
('Your notes','Keep your memories.', [('Looking forward','What are you most excited about?'),('Along the way','What would you like to try and what will you leave open?'),('After the trip','What will you remember? What would you change next time?')])]
}
for lang,pages in DATA.items():
 target=ROOT/'public/documents'/f'reisebegleiter-{lang}.pdf';target.parent.mkdir(parents=True,exist_ok=True)
 c=canvas.Canvas(str(target),pagesize=(595,842));c.setTitle('Stay Safe & Brave - '+('Reisearbeitsheft' if lang=='de' else 'Travel workbook'))
 for number,(title,sub,sections) in enumerate(pages,1):
  c.setFillColor(HexColor('#f9ecdf'));c.rect(0,638,595,204,fill=1,stroke=0)
  c.setFillColor(HexColor('#984d35'));c.setFont('SSBBold',10);c.drawString(46,791,'STAY SAFE & BRAVE')
  c.setFillColor(HexColor('#20382d'));c.setFont('SSBSerif',26);c.drawString(46,735,title);c.setFont('SSBSans',12);c.drawString(46,702,sub)
  c.setFont('SSBSans',9);c.setFillColor(HexColor('#52625a'))
  c.drawString(46,612,'Neu erstelltes Arbeitsheft. Kein Original-Infopaket oder verbindliches Reiseangebot.' if lang=='de' else 'Newly created workbook. Not the original information pack or a travel offer.')
  for idx,(heading,hint) in enumerate(sections):
   y=565-idx*150;c.setFillColor(HexColor('#20382d'));c.setFont('SSBBold',13);c.drawString(46,y,heading);c.setFont('SSBSans',9);c.setFillColor(HexColor('#52625a'));c.drawString(46,y-23,hint)
   c.setStrokeColor(HexColor('#d3c6b8'))
   for line in range(3):c.line(46,y-50-line*23,549,y-50-line*23)
  c.setFont('SSBSans',8);c.setFillColor(HexColor('#52625a'))
  c.drawString(46,50,'Planungshilfe ohne aktuelle Visa-, Gesundheits- oder Sicherheitshinweise.' if lang=='de' else 'Planning template without current visa, medical or safety guidance.')
  c.drawRightString(549,30,f'{number} / {len(pages)}');c.showPage()
 c.save()
 print(target)
