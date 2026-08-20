import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Send, Edit3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";

// Placeholder data - replace with actual data fetching
const messages = [
  {
    id: "1",
    senderName: "Aisha Sharma",
    senderImage: images.avatars.womanSmiling.src,
    dataAiHint: images.avatars.womanSmiling.dataAiHint,
    subject: "Re: Safari Buchungsbestätigung",
    preview: "Ich freue mich auf unsere Session am 15. Juli! Ich habe ein paar Fragen, was ich mitbringen soll...",
    timestamp: "vor 2 Stunden",
    read: false,
  },
  {
    id: "2",
    senderName: "Bongani Mthembu",
    senderImage: images.avatars.manGuide.src,
    dataAiHint: images.avatars.manGuide.dataAiHint,
    subject: "Mountainbike-Ausrüstung",
    preview: "Hey Alex, ich wollte nur deine Schuhgröße für die Fahrradpedale überprüfen.",
    timestamp: "Gestern",
    read: true,
  },
  {
    id: "3",
    senderName: "Support-Team",
    senderImage: images.avatars.logoIcon.src,
    dataAiHint: images.avatars.logoIcon.dataAiHint,
    subject: "Willkommen bei Stay Safe & Brave!",
    preview: "Wir freuen uns, dich an Bord zu haben. Erkunde Mentoren und plane dein nächstes Abenteuer.",
    timestamp: "vor 3 Tagen",
    read: true,
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Meine Nachrichten</h1>
          <p className="text-lg text-muted-foreground">
            Bleib mit deinen Mentoren und dem Stay Safe & Brave Team in Verbindung.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Edit3 className="w-4 h-4 mr-2" />
          Nachricht verfassen
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Inbox className="w-6 h-6 text-accent" />
            Posteingang ({messages.filter(m => !m.read).length} ungelesen)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Link href="#" key={message.id} className="block hover:bg-muted/30 p-4 rounded-lg transition-colors border">
                  <div className="flex items-start gap-4">
                    <Image
                      src={message.senderImage}
                      alt={message.senderName}
                      data-ai-hint={message.dataAiHint}
                      width={40}
                      height={40}
                      className="rounded-full border"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={`font-semibold ${!message.read ? 'text-primary' : ''}`}>{message.senderName}</p>
                        <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                      </div>
                      <p className={`text-sm font-medium truncate ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>{message.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                    </div>
                    {!message.read && (
                      <div className="w-2 h-2 bg-accent rounded-full self-center ml-2 shrink-0"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Dein Posteingang ist leer.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
