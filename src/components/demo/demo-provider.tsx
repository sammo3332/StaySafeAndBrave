'use client';
import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { DEMO_STORAGE_KEY, demoReducer, initialDemo, restoreDemo, type DemoAction, type DemoState } from '@/lib/demo-booking';
const Context = createContext<{ state: DemoState; dispatch: Dispatch<DemoAction>; ready: boolean; storageWarning: boolean } | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, initialDemo);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    try { dispatch({ type: 'restore', state: restoreDemo(localStorage.getItem(DEMO_STORAGE_KEY)) }); }
    catch { setStorageWarning(true); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state)); }
    catch { setStorageWarning(true); }
  }, [state, ready]);
  return <Context.Provider value={{ state, dispatch, ready, storageWarning }}>{children}</Context.Provider>;
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error('DemoProvider fehlt');
  return context;
}
