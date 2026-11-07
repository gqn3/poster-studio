import { PRESET_TEMPLATES } from './preset-templates';
/** Browser-rendered previews of the same localized Fabric JSON used by the editor. */
export function presetPreview(template: {name:string}, ar:boolean):string {
 const index=PRESET_TEMPLATES.findIndex(item=>item.name===template.name);
 return index < 0 ? '' : `/templates/previews/${ar?'ar':'en'}/${index}.png`;
}
