'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
declare global { interface Window { turnstile?: {render:(el:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void}; } }
export function Turnstile({onToken}:{onToken:(value:string)=>void}){
 const ref=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false);
 useEffect(()=>{if(!loaded||!ref.current||!window.turnstile)return;const widget=window.turnstile.render(ref.current,{sitekey:process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,callback:onToken,'expired-callback':()=>onToken(''),'error-callback':()=>onToken(''),size:'flexible'});return()=>{window.turnstile?.remove(widget);};},[loaded,onToken]);
 if(!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)return <p className="text-sm text-muted-foreground">Der Formularversand wird noch eingerichtet.</p>;
 return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={()=>setLoaded(true)}/><div ref={ref}/></>;
}
