import { useMemo } from 'react';

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export function VideoEmbed({ url, className = '' }: VideoEmbedProps) {
  const embedUrl = useMemo(() => {
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // If it's already an embed URL or direct video, return as is
    return url;
  }, [url]);

  const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg)(\?|$)/i);

  if (isDirectVideo) {
    return (
      <video 
        src={embedUrl} 
        controls 
        className={`w-full rounded-lg ${className}`}
        preload="metadata"
      >
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    );
  }

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video embed"
      />
    </div>
  );
}
