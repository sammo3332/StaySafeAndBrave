"use client";
import { useEffect,useRef,useState } from 'react';
/** Local viewport state only: no read receipts or message writes. */
export function useChatScroll(change: unknown) {
 const logRef=useRef<HTMLDivElement>(null);const nearBottom=useRef(true);const [hasNew,setHasNew]=useState(false);
 const scrollToLatest=()=>{const el=logRef.current;if(el){el.scrollTo({top:el.scrollHeight,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}nearBottom.current=true;setHasNew(false);};
 const onScroll=()=>{const el=logRef.current;if(!el)return;nearBottom.current=el.scrollHeight-el.scrollTop-el.clientHeight<80;if(nearBottom.current)setHasNew(false);};
 useEffect(()=>{const el=logRef.current;if(!el)return;if(nearBottom.current){el.scrollTop=el.scrollHeight;setHasNew(false);}else setHasNew(true);},[change]);
 return {logRef,onScroll,hasNew,scrollToLatest};
}
