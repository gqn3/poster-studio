'use client';
import { X } from 'lucide-react';
import { usePreferences } from '@/app/preferences';
export default function KeyboardShortcutsHelp({open,onClose}:{open:boolean;onClose:()=>void}) {
 const {locale}=usePreferences();const ar=locale==='ar';if(!open)return null;
 const rows=[['T','Text','نص'],['P','Draw','رسم'],['V','Select','تحديد'],['Ctrl / ⌘ + Z','Undo','تراجع'],['Ctrl / ⌘ + Shift + Z','Redo','إعادة'],['Delete','Delete selection','حذف المحدد'],['Esc','Close or exit','إغلاق أو خروج']];
 return <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/60" onClick={onClose}/><div role="dialog" aria-modal="true" aria-label={ar?'اختصارات لوحة المفاتيح':'Keyboard shortcuts'} className="relative bg-background text-foreground rounded-2xl shadow-2xl w-[min(560px,95vw)] p-6"><div className="flex justify-between items-center mb-5"><h2 className="text-lg font-semibold">{ar?'اختصارات لوحة المفاتيح':'Keyboard shortcuts'}</h2><button onClick={onClose} aria-label={ar?'إغلاق':'Close'}><X size={20}/></button></div><div className="space-y-3">{rows.map(([key,en,arabic])=><div key={key} className="flex justify-between gap-4"><span>{ar?arabic:en}</span><kbd dir="ltr" className="rounded-md bg-muted px-2 py-1 text-xs">{key}</kbd></div>)}</div></div></div>;
}
