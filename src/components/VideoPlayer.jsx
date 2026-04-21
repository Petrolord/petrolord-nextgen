import React, { useState, useEffect } from 'react';
import { Play, Loader2, AlertCircle, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchVimeoThumbnail, getVimeoIframeUrl, parseVimeoUrl } from '@/utils/vimeoUtils';
import { cn } from '@/lib/utils';

/**
 * Enhanced VideoPlayer component with robust Vimeo integration.
 */
const VideoPlayer = ({ videoUrl, title, className }) => {
  const [thumbnailData, setThumbnailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Reset state when URL changes (lesson switch)
    setShowVideo(false);
    setThumbnailData(null);
    setError(null);

    console.log(`[VideoPlayer] Mounted/Updated with URL:`, videoUrl);

    if (!videoUrl) {
      setError("No video URL provided.");
      setIsLoading(false);
      return;
    }

    const loadVideoData = async () => {
      setIsLoading(true);
      try {
        // Validate URL format first
        const parsedId = parseVimeoUrl(videoUrl);
        if (!parsedId) {
          throw new Error("Invalid Vimeo URL format. Please provide a valid Vimeo link.");
        }

        const data = await fetchVimeoThumbnail(videoUrl);
        
        if (isMounted) {
          setThumbnailData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load video preview.");
          setIsLoading(false);
        }
      }
    };

    loadVideoData();

    return () => {
      isMounted = false;
    };
  }, [videoUrl]);

  const handlePlayClick = () => {
    if (thumbnailData?.videoId) {
      console.log(`[VideoPlayer] Playing video ID:`, thumbnailData.videoId);
      setShowVideo(true);
    }
  };

  // Render Error State
  if (error) {
    return (
      <div className={cn("w-full space-y-3", className)}>
        {title && <h3 className="text-lg font-semibold text-white px-1">{title}</h3>}
        <div className="w-full aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 text-slate-400 p-6 text-center shadow-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
            {error === "No video URL provided." ? (
              <VideoOff className="w-8 h-8 text-slate-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Video Unavailable</h3>
          <p className="text-sm max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {title && <h3 className="text-lg font-semibold text-white px-1">{title}</h3>}
      
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg group ring-1 ring-white/5 transition-all duration-300">
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#BFFF00] mb-4" />
            <p className="text-sm font-medium text-slate-400 animate-pulse">Loading Video Preview...</p>
          </div>
        )}

        {/* Video Iframe State */}
        {!isLoading && showVideo && thumbnailData && (
          <iframe
            src={getVimeoIframeUrl(thumbnailData.videoId)}
            className="absolute inset-0 w-full h-full border-0 bg-black"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={thumbnailData.videoTitle || title || "Vimeo Video Player"}
          />
        )}

        {/* Thumbnail Preview State */}
        {!isLoading && !showVideo && thumbnailData && (
          <div 
            className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BFFF00] focus:ring-offset-2 focus:ring-offset-slate-900" 
            onClick={handlePlayClick}
            role="button"
            tabIndex={0}
            aria-label={`Play ${thumbnailData.videoTitle || title || 'video'}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayClick();
              }
            }}
          >
            <img 
              src={thumbnailData.thumbnailUrl} 
              alt={`Preview for ${thumbnailData.videoTitle}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50 flex items-center justify-center">
              <Button 
                size="icon" 
                className="w-20 h-20 rounded-full bg-[#BFFF00] hover:bg-[#a3d900] text-black shadow-[0_0_30px_rgba(191,255,0,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(191,255,0,0.6)]"
              >
                <Play className="w-10 h-10 ml-1.5 fill-black" />
              </Button>
            </div>
            
            {/* Title gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <p className="text-white font-medium drop-shadow-md truncate">
                {title || thumbnailData.videoTitle || 'Click to play video'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;