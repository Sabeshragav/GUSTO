'use client';

export function Spotify() {
  return (
    <div className="h-full w-full bg-black rounded-b-lg overflow-hidden">
      <iframe
        src="https://open.spotify.com/embed/album/5WulAOx9ilWy1h8UGZ1gkI?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        style={{ border: 'none', borderRadius: '0 0 12px 12px' }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
