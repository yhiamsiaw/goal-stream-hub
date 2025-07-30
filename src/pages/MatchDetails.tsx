import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Copy, ExternalLink } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import VideoPlayer from '@/components/shared/VideoPlayer';
import MatchCard from '@/components/shared/MatchCard';
import Countdown from '@/components/shared/Countdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { matchService } from '@/services/matchService';
import { Match, StreamSource } from '@/types/Match';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [relatedMatches, setRelatedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [matchData, allMatches] = await Promise.all([
          matchService.getMatchById(id),
          matchService.getAllMatches()
        ]);
        
        setMatch(matchData);
        
        if (matchData) {
          // Get related matches from same competition, exclude current match
          const related = allMatches
            .filter(m => m.id !== id && m.competition.id === matchData.competition.id)
            .slice(0, 3);
          setRelatedMatches(related);
        }
      } catch (error) {
        console.error('Error fetching match data:', error);
        toast({
          title: "Error",
          description: "Failed to load match details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id, toast]);

  const getStreamSources = (match: Match): StreamSource[] => {
    const sources: StreamSource[] = [];
    
    if (match.streams.hls1) {
      sources.push({
        type: 'hls',
        url: match.streams.hls1,
        label: 'HLS Stream 1',
        key: 'hls1'
      });
    }
    
    if (match.streams.hls2) {
      sources.push({
        type: 'hls',
        url: match.streams.hls2,
        label: 'HLS Stream 2',
        key: 'hls2'
      });
    }
    
    if (match.streams.src1) {
      sources.push({
        type: 'iframe',
        url: match.streams.src1,
        label: 'Stream Source 1',
        key: 'src1'
      });
    }
    
    if (match.streams.src2) {
      sources.push({
        type: 'iframe',
        url: match.streams.src2,
        label: 'Stream Source 2',
        key: 'src2'
      });
    }
    
    return sources;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const shareLink = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${match?.clubs.home.name} vs ${match?.clubs.away.name}`,
        text: 'Watch this match on 66Sports',
        url: url,
      });
    } else {
      copyToClipboard(url);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const matchDate = new Date(`${date}T${time}`);
    return matchDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'live';
      case 'FT': return 'success';
      case 'HT': return 'accent';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8 px-4">
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-96 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <p className="text-muted-foreground mb-8">The match you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isLive = match.score.status === 'LIVE';
  const isCompleted = match.score.status === 'FT';
  const isUpcoming = !isLive && !isCompleted;
  const hasStreams = getStreamSources(match).length > 0;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8 px-4 space-y-8">
        {/* Back Navigation */}
        <Button asChild variant="ghost">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Match Header */}
        <Card className={cn("overflow-hidden", isLive && "live-glow")}>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Home Team */}
              <div className="text-center space-y-4">
                <img 
                  src={match.clubs.home.logo} 
                  alt={match.clubs.home.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <h2 className="text-xl font-bold">{match.clubs.home.name}</h2>
              </div>
              
              {/* Score/Status */}
              <div className="text-center space-y-4">
                <Badge 
                  variant={getStatusColor(match.score.status) as any}
                  className={cn("text-lg px-4 py-2", isLive && "live-pulse")}
                >
                  {match.score.status}
                </Badge>
                
                {(isLive || isCompleted) ? (
                  <div className="text-4xl font-bold">
                    {match.score.home} - {match.score.away}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(match.kickoff.date, match.kickoff.time)}</span>
                    </div>
                  </div>
                )}
                
                {match.score.type === 'HOT' && (
                  <Badge variant="destructive">🔥 HOT MATCH</Badge>
                )}
              </div>
              
              {/* Away Team */}
              <div className="text-center space-y-4">
                <img 
                  src={match.clubs.away.logo} 
                  alt={match.clubs.away.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <h2 className="text-xl font-bold">{match.clubs.away.name}</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown for upcoming matches */}
        {isUpcoming && (
          <Card>
            <CardContent className="p-6">
              <Countdown 
                targetDate={match.kickoff.date}
                targetTime={match.kickoff.time}
                className="text-center"
              />
            </CardContent>
          </Card>
        )}

        {/* Video Player */}
        {hasStreams ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎥 Watch {isLive ? 'Live' : 'Stream'}</span>
                {isLive && <Badge variant="live" className="live-pulse">LIVE</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer sources={getStreamSources(match)} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-4xl">📺</div>
                <h3 className="text-xl font-semibold">Stream Not Available</h3>
                <p className="text-muted-foreground">
                  {isUpcoming 
                    ? "Stream will be available when the match starts."
                    : "No stream sources are currently available for this match."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Match Information */}
          <Card>
            <CardHeader>
              <CardTitle>Match Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(match.kickoff.date, match.kickoff.time)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">
                    {match.venue.name}, {match.venue.city}, {match.venue.country}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary rounded-full" />
                <div>
                  <p className="font-medium">Competition</p>
                  <p className="text-sm text-muted-foreground">
                    {match.competition.name} - Matchday {match.competition.matchday}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card>
            <CardHeader>
              <CardTitle>Share This Match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Share this match with your friends and fellow football fans!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={shareLink} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Match
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-medium mb-2">Quick Share:</p>
                <div className="p-3 bg-muted rounded-lg text-xs break-all">
                  {window.location.href}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Matches */}
        {relatedMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More from {match.competition.name}</h2>
            <div className="grid gap-4">
              {relatedMatches.map((relatedMatch) => (
                <MatchCard key={relatedMatch.id} match={relatedMatch} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetails;