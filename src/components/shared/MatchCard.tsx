import { Clock, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types/Match';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  className?: string;
}

const MatchCard = ({ match, className }: MatchCardProps) => {
  const isLive = match.score.status === 'LIVE';
  const isCompleted = match.score.status === 'FT';
  const isHot = match.score.type === 'HOT';
  
  const hasStreams = Object.values(match.streams).some(stream => stream && stream.trim() !== '');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-live text-live-foreground';
      case 'FT': return 'bg-success text-success-foreground';
      case 'HT': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  return (
    <div className={cn(
      "match-card-hover rounded-xl p-4 border",
      isLive && "live-glow",
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* Teams */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-5 items-center gap-2 text-sm">
            {/* Home Team */}
            <div className="col-span-2 flex items-center gap-2 min-w-0">
              <img 
                src={match.clubs.home.logo} 
                alt={match.clubs.home.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <span className="font-medium truncate">{match.clubs.home.name}</span>
            </div>
            
            {/* Score/Time */}
            <div className="text-center font-bold">
              {isCompleted || isLive ? (
                <span className="text-lg">
                  {match.score.home} - {match.score.away}
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatTime(match.kickoff.time)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Away Team */}
            <div className="col-span-2 flex items-center gap-2 justify-end min-w-0">
              <span className="font-medium truncate">{match.clubs.away.name}</span>
              <img 
                src={match.clubs.away.logo} 
                alt={match.clubs.away.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          {/* Competition & Date */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{match.competition.name}</span>
            <span>{new Date(match.kickoff.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex flex-col items-center gap-2">
          {/* Badges */}
          <div className="flex flex-col gap-1">
            <Badge 
              className={cn(
                "text-xs px-2 py-1",
                getStatusColor(match.score.status),
                isLive && "live-pulse"
              )}
            >
              {match.score.status}
            </Badge>
            {isHot && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                HOT
              </Badge>
            )}
          </div>
          
          {/* Action Button */}
          {hasStreams ? (
            <Button
              asChild
              variant={isLive ? "live" : "watch"}
              size="sm"
              className="min-w-[80px]"
            >
              <Link to={`/match/${match.id}`}>
                <Tv className="w-4 h-4 mr-1" />
                {isLive ? 'LIVE' : 'Watch'}
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="min-w-[80px]"
            >
              <Link to={`/match/${match.id}`}>
                Details
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;