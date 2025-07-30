import { useEffect, useRef, useState } from 'react';
import { StreamSource } from '@/types/Match';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  sources: StreamSource[];
  className?: string;
}

const VideoPlayer = ({ sources, className }: VideoPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Prioritize sources: hls1 > hls2 > src1 > src2
  const prioritizedSources = sources.sort((a, b) => {
    const priority = { hls1: 0, hls2: 1, src1: 2, src2: 3 };
    return (priority[a.key as keyof typeof priority] || 999) - (priority[b.key as keyof typeof priority] || 999);
  });

  useEffect(() => {
    if (prioritizedSources.length > 0 && !selectedSource) {
      setSelectedSource(prioritizedSources[0]);
    }
  }, [prioritizedSources, selectedSource]);

  const renderHLSPlayer = (source: StreamSource) => {
    return (
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          autoPlay
          muted
          onLoadStart={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onError={() => setError('Failed to load video stream')}
        >
          <source src={source.url} type="application/x-mpegURL" />
          Your browser does not support the video tag.
        </video>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <Play className="w-12 h-12 mx-auto mb-2 animate-pulse" />
              <p>Loading stream...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIframePlayer = (source: StreamSource) => {
    return (
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
        <iframe
          src={source.url}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          onLoad={() => setLoading(false)}
          onError={() => setError('Failed to load stream')}
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <Play className="w-12 h-12 mx-auto mb-2 animate-pulse" />
              <p>Loading stream...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (sources.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-96 bg-muted rounded-lg", className)}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No streams available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Source Selection Tabs */}
      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <Button
              key={source.key}
              variant={selectedSource?.key === source.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedSource(source);
                setError(null);
                setLoading(true);
              }}
              className="relative"
            >
              {source.label}
              {source.type === 'hls' && (
                <Badge className="ml-2 text-xs" variant="success">HD</Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Player Container */}
      <div className="relative aspect-video w-full">
        {error ? (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                }}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : selectedSource ? (
          <div ref={playerRef} className="w-full h-full">
            {selectedSource.type === 'hls' 
              ? renderHLSPlayer(selectedSource)
              : renderIframePlayer(selectedSource)
            }
          </div>
        ) : null}
      </div>

      {/* Stream Info */}
      {selectedSource && (
        <div className="text-sm text-muted-foreground text-center">
          <span>Streaming from: {selectedSource.label}</span>
          {selectedSource.type === 'hls' && (
            <Badge className="ml-2" variant="success">HLS</Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;