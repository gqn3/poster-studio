// 左侧工具栏
'use client';

import { Button } from '@/components/ui/button';
import { usePreferences } from '@/app/preferences';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  AlignLeft,
  Image,
  Smile,
  Undo2,
  Redo2,
  Square,
  Shapes,
  Pencil,
  MousePointer2,
} from 'lucide-react';

interface SidebarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function Sidebar({
  activeTool,
  onToolChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: SidebarProps) {
  const { locale } = usePreferences();
  const tools = [
    { id: 'select', label: locale === 'ar' ? 'تحديد (V)' : 'Select (V)', icon: MousePointer2 },
    { id: 'text', label: locale === 'ar' ? 'نص' : 'Text', icon: Type },
    { id: 'textbox', label: locale === 'ar' ? 'مربع نص' : 'Text box', icon: AlignLeft },
    { id: 'pencil', label: locale === 'ar' ? 'رسم (P)' : 'Draw (P)', icon: Pencil },
    { id: 'image', label: locale === 'ar' ? 'صورة' : 'Image', icon: Image },
    { id: 'emoji', label: 'Emoji', icon: Smile },
    { id: 'shape', label: locale === 'ar' ? 'شكل' : 'Shape', icon: Square },
    { id: 'icon', label: locale === 'ar' ? 'أيقونات' : 'Icons', icon: Shapes },
  ];

  return (
    <aside
      className="flex flex-col items-center py-6 gap-2 bg-background"
      style={{ width: '56px', borderRight: '1px solid hsl(var(--border))' }}
    >
      <TooltipProvider delayDuration={300}>
        {/* 工具按钮 */}
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => onToolChange(tool.id)}
                  aria-label={tool.label}
                  title={tool.label}
                  className="relative h-10 w-10"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={2} align="center" alignOffset={4}>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Separator className="w-6 my-2" />

        {/* 撤销/重做 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              disabled={!canUndo}
              aria-label={locale === 'ar' ? 'تراجع' : 'Undo'}
              title={locale === 'ar' ? 'تراجع' : 'Undo'}
              onClick={onUndo}
            >
              <Undo2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={2} align="center" alignOffset={4}>
            <p>{locale === 'ar' ? 'تراجع' : 'Undo'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              disabled={!canRedo}
              aria-label={locale === 'ar' ? 'إعادة' : 'Redo'}
              title={locale === 'ar' ? 'إعادة' : 'Redo'}
              onClick={onRedo}
            >
              <Redo2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={2} align="center" alignOffset={4}>
            <p>{locale === 'ar' ? 'إعادة' : 'Redo'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </aside>
  );
}
