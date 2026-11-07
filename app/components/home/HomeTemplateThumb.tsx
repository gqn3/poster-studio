'use client';
import { useState } from 'react';

/** Prevent an unavailable thumbnail asset from becoming a broken-image icon. */
export default function HomeTemplateThumb({
  src, ar, ratio,
}: { src: string; ar: boolean; ratio: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="template-thumb" data-preview-fallback={failed ? "true" : "false"}>
    <div className="template-thumb-fallback" aria-hidden="true">
      <span className="thumb-fallback-kicker">{ar ? 'من أفكارك' : 'YOUR IDEAS'}</span>
      <strong>{ar ? <>أفكار صغيرة<br/>أثر كبير.</> : <>Little ideas.<br/>Big impact.</>}</strong>
      <span className="thumb-fallback-rule" />
      <small>{ratio}</small>
    </div>
    {!failed && src && <img
      loading="lazy"
      src={src}
      alt=""
      onError={() => setFailed(true)}
    />}
  </div>;
}
