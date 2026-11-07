'use client';
import { useState } from 'react';
import { usePreferences } from '@/app/preferences';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TemplateCategory } from '@/lib/template-manager';
interface Props { open:boolean; onClose:()=>void; onSave:(name:string, category:TemplateCategory, isPublic:boolean)=>void }
export default function SaveTemplateDialog({open,onClose,onSave}:Props) {
 const {locale}=usePreferences(); const ar=locale==='ar'; const [name,setName]=useState('');
 const close=()=>{setName('');onClose();};
 const save=()=>{if(!name.trim())return;onSave(name.trim(),'自定义',false);close();};
 return <Dialog open={open} onOpenChange={close}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>{ar?'حفظ كقالب':'Save as template'}</DialogTitle></DialogHeader><div className="space-y-2 py-4"><Label htmlFor="template-name">{ar?'اسم القالب':'Template name'}</Label><Input id="template-name" value={name} onChange={e=>setName(e.target.value)} placeholder={ar?'قالب جديد':'My template'} autoFocus onKeyDown={e=>{if(e.key==='Enter')save();}}/><p className="text-sm text-muted-foreground">{ar?'يُحفظ القالب في هذا المتصفح.':'This template is saved in this browser.'}</p></div><div className="flex gap-2 justify-end"><Button variant="outline" onClick={close}>{ar?'إلغاء':'Cancel'}</Button><Button onClick={save} disabled={!name.trim()}>{ar?'حفظ':'Save'}</Button></div></DialogContent></Dialog>;
}
