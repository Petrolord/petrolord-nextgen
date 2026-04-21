import { useState, useEffect } from 'react';

const thumbnailCache = {};

export const useVimeoThumbnail = (url) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (!url) {
            setThumbnailUrl(null);
            setError(null);
            return;
        }

        // Support both full URLs and raw Vimeo IDs
        const isRawId = /^[0-9]+$/.test(url);
        const isValidUrl = url.includes('vimeo.com') || isRawId;

        if (!isValidUrl) {
            const errMsg = 'Invalid Vimeo URL format';
            setError(errMsg);
            console.error(`[useVimeoThumbnail] ERROR: ${errMsg} -> ${url}`);
            return;
        }

        // Normalize URL for caching and API
        const normalizedUrl = isRawId ? `https://vimeo.com/${url}` : url;

        if (thumbnailCache[normalizedUrl]) {
            setThumbnailUrl(thumbnailCache[normalizedUrl]);
            return;
        }

        const fetchThumbnail = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const apiUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(normalizedUrl)}`;
                
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    if (response.status === 403) throw new Error('This video is private or restricted (403)');
                    if (response.status === 404) throw new Error('Video not found (404)');
                    if (response.status === 429) throw new Error('Vimeo API Rate limit exceeded (429)');
                    throw new Error(`Failed to fetch thumbnail (${response.status})`);
                }
                
                const data = await response.json();
                
                if (data.thumbnail_url) {
                    const highResUrl = data.thumbnail_url.replace(/_\d+x\d+/, '_1280x720');
                    
                    if (isMounted) {
                        thumbnailCache[normalizedUrl] = highResUrl;
                        setThumbnailUrl(highResUrl);
                    }
                } else {
                    throw new Error('No thumbnail URL found in Vimeo response.');
                }
            } catch (err) {
                console.error('[useVimeoThumbnail] EXCEPTION:', err.message);
                if (isMounted) {
                    setError(err.message || 'An unexpected error occurred while fetching the thumbnail.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchThumbnail();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { thumbnailUrl, isLoading, error };
};