import { useState, useEffect } from 'react';
import { Tv, Star, Calendar, Users, HelpCircle, ChevronDown } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MatchCard from '@/components/shared/MatchCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { matchService } from '@/services/matchService';
import { Match } from '@/types/Match';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [hotMatches, setHotMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [allMatches, live, hot] = await Promise.all([
          matchService.getAllMatches(),
          matchService.getLiveMatches(),
          matchService.getHotMatches()
        ]);
        
        setMatches(allMatches);
        setLiveMatches(live);
        setHotMatches(hot);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error",
          description: "Failed to load matches. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [toast]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingMatches = matches.filter(match => 
    match.kickoff.date >= today && 
    match.score.status !== 'LIVE' && 
    match.score.status !== 'FT'
  );

  const completedMatches = matches.filter(match => 
    match.score.status === 'FT'
  );

  const faqItems = [
    {
      question: "How can I watch live matches?",
      answer: "Simply click on the 'Watch' or 'LIVE' button on any match card to start streaming. We provide multiple stream sources for the best viewing experience."
    },
    {
      question: "Is the streaming service free?",
      answer: "Yes, 66Sports is completely free to use. We provide high-quality football streams without any subscription fees."
    },
    {
      question: "What devices are supported?",
      answer: "Our platform works on all modern devices including desktop computers, tablets, and smartphones. We recommend using the latest version of your browser for the best experience."
    },
    {
      question: "How do I know if a match is live?",
      answer: "Live matches are clearly marked with a pulsing 'LIVE' badge and will appear in the Live Matches section."
    },
    {
      question: "What should I do if a stream doesn't work?",
      answer: "If a stream doesn't load, try switching to a different stream source using the tabs above the player. We provide multiple backup streams for reliability."
    }
  ];

  const HeroSection = () => (
    <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            66Sports
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your ultimate destination for live football streaming. Watch your favorite teams and matches in stunning quality.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-primary" />
            <span>HD Quality Streams</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Multiple Sources</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Live & On-Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Free Access</span>
          </div>
        </div>

        <Button asChild variant="watch" size="lg" className="text-lg px-8 py-6">
          <a href="#live-matches">
            <Tv className="w-5 h-5 mr-2" />
            Watch Live Now
          </a>
        </Button>
      </div>
    </section>
  );

  const MatchSection = ({ title, matches, id, emptyMessage }: {
    title: string;
    matches: Match[];
    id?: string;
    emptyMessage: string;
  }) => (
    <section id={id} className="py-12 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );

  const AboutSection = () => (
    <section id="about" className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">About 66Sports</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            66Sports is your premier destination for live football streaming. We're passionate about bringing you the best football action from around the world, featuring top leagues, tournaments, and matches in high-definition quality.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader className="text-center">
                <Tv className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>HD Streaming</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Enjoy crystal-clear, high-definition streams with multiple quality options to suit your connection.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Multiple Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  We provide backup streams to ensure you never miss a moment of the action.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Free Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  No subscriptions, no hidden fees. Just pure football entertainment, completely free.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  const FAQSection = () => (
    <section id="faq" className="py-16 px-4">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4">
            Find answers to common questions about our streaming service.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors">
                <span className="font-medium">{item.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-x border-b rounded-b-lg p-4 pt-0 bg-muted/20">
                <p className="text-muted-foreground">{item.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        
        {hotMatches.length > 0 && (
          <MatchSection 
            title="🔥 Hot Matches" 
            matches={hotMatches}
            emptyMessage="No hot matches at the moment."
          />
        )}
        
        <MatchSection 
          title="🔴 Live Matches" 
          matches={liveMatches}
          id="live-matches"
          emptyMessage="No live matches right now. Check back later!"
        />
        
        <MatchSection 
          title="📅 Upcoming Matches" 
          matches={upcomingMatches}
          emptyMessage="No upcoming matches scheduled."
        />
        
        {completedMatches.length > 0 && (
          <MatchSection 
            title="✅ Recent Results" 
            matches={completedMatches.slice(0, 10)}
            emptyMessage="No recent matches available."
          />
        )}
        
        <AboutSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;