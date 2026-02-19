import { useState } from 'react';
import { youtubeVideoId } from "../../data/details/fullData";

// Default video ID if none provided
const DEFAULT_VIDEO_ID = youtubeVideoId;

export function YouTubeApp({ videoId = DEFAULT_VIDEO_ID }: { videoId?: string }) {
    const [isLoading, setIsLoading] = useState(true);

    // Parse video ID if a full URL is passed
    const getEmbedId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const finalId = getEmbedId(videoId);

    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${finalId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                className="w-full h-full"
            ></iframe>
        </div>
    );
}
