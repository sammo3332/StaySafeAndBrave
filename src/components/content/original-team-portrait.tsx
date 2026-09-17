import { originalAssets } from '@/components/content/original-assets';

// Square viewports into the original 1366 x 768 labeled team montage.
// The source remains untouched; CSS clips the old labels/layout, not the faces.
const crops = {
  Laura: { x: 112, y: 241, size: 280 },
  Niklas: { x: 550, y: 300, size: 270 },
  Houssam: { x: 997, y: 242, size: 278 },
} as const;

export function OriginalTeamPortrait({ name }: { name: keyof typeof crops }) {
  const crop = crops[name];
  return <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-muted mb-6">
    <img src={originalAssets.team} alt={`Porträt von ${name} aus der Original-Teamvorstellung`} width={1366} height={768} loading="lazy"
      className="absolute h-auto" style={{ maxWidth: 'none', width: `${1366 / crop.size * 100}%`, left: `${-crop.x / crop.size * 100}%`, top: `${-crop.y / crop.size * 100}%` }} />
  </div>;
}
