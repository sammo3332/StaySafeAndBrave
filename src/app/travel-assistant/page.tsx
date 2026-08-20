'use client';

import { useState } from 'react';
import { TravelAssistantForm } from '@/components/travel-assistant/travel-assistant-form';
import type { TravelTipsOutput } from '@/ai/flows/travel-tips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle } from 'lucide-react';

export default function TravelAssistantPage() {
  const [travelTips, setTravelTips] = useState<TravelTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); // To manage the display of the results card immediately

  const handleTipsGenerated = (tips: TravelTipsOutput) => {
    setTravelTips(tips);
    setIsLoading(false); // Form handles its own loading state for the button
  };
  
  // This function is to re-trigger the loading state for the results card, used by the form.
  const handleFormSubmit = () => {
    setIsLoading(true);
    setTravelTips(null); // Clear previous tips before new ones are generated
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Dein persönlicher Reiseberater</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Planst du eine Reise nach Südafrika? Lass unseren KI-Assistenten personalisierte Reisetipps und Sicherheitshinweise nur für dich erstellen.
        </p>
      </div>
      
      <TravelAssistantForm onTipsGenerated={handleTipsGenerated} onFormSubmit={handleFormSubmit} />

      {travelTips && travelTips.tips && (
        <Card className="w-full max-w-2xl mx-auto shadow-lg mt-8 animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              <Lightbulb className="w-7 h-7" />
              Personalisierte Reisetipps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {travelTips.tips.startsWith('Entschuldigung, ein Fehler ist aufgetreten') ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <p>{travelTips.tips}</p>
              </div>
            ) : (
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-line">
                {travelTips.tips.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-primary">{paragraph.substring(4)}</h3>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-5 mb-2 text-primary">{paragraph.substring(3)}</h2>;
                  }
                  if (paragraph.startsWith('# ')) {
                     return <h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-primary">{paragraph.substring(2)}</h1>;
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-4">{paragraph.substring(2)}</li>;
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
       <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .prose p { margin-bottom: 0.75em; }
        .prose ul, .prose ol { margin-left: 1.5em; margin-bottom: 0.75em; list-style-type: disc; }
        .prose li { margin-bottom: 0.25em; }
        .prose strong { color: hsl(var(--primary)); }
        .prose h1, .prose h2, .prose h3 { color: hsl(var(--primary)); }
      `}</style>
    </div>
  );
}
