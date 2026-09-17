import { CommercePanel } from '@/components/product/commerce-panel';
export const metadata={title:'Angebote & Buchungen'};
export default function Page(){return <div className="page-shell py-12"><p className="eyebrow mb-4">Persönliche Begleitung</p><h1 className="editorial-title page-title">Geprüfte Angebote. Klare Schritte.</h1><p className="mt-5 max-w-2xl text-lg text-muted-foreground">Hier erscheinen ausschließlich separat freigegebene Angebote und verfügbare Zeiträume. Die fiktiven Demo-Profile werden nicht als echte Angebote übernommen.</p><CommercePanel/></div>;}
