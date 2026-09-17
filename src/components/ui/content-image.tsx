'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
export function ContentImage({src,alt,className,fallback='Bild folgt'}:{src?:string;alt:string;className?:string;fallback?:string}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[src]);
 const valid=Boolean(src && (/^(https?:\/\/)/.test(src) || /^\/(?!\/)/.test(src)) && !/picsum\.photos|placehold\.co|via\.placeholder\.com|source\.unsplash\.com|placeholder/i.test(src));
 if(!valid || failed) return <div className={cn('flex items-center justify-center bg-muted text-muted-foreground',className)} role="img" aria-label={fallback}><span className="text-sm px-5 text-center">{fallback}</span></div>;
 // User-supplied image origins are not restricted to the Next image optimizer allowlist.
 return <img src={src} alt={alt} loading="lazy" onError={()=>setFailed(true)} className={cn('object-cover',className)}/>;
}
