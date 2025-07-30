import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { matchService } from '@/services/matchService';
import { Match } from '@/types/Match';
import { useToast } from '@/hooks/use-toast';

const AddMatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Clubs
    homeTeamName: '',
    homeTeamLogo: '',
    awayTeamName: '',
    awayTeamLogo: '',
    
    // Streams
    hls1: '',
    hls2: '',
    src1: '',
    src2: '',
    mhls1: '',
    mhls2: '',
    
    // Score
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED' as Match['score']['status'],
    type: '',
    
    // Competition
    competitionId: '',
    competitionName: '',
    matchday: 1,
    
    // Kickoff
    date: '',
    time: '',
    timezone: 'GMT',
    
    // Venue
    venueName: '',
    venueCity: '',
    venueCountry: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.homeTeamName || !formData.awayTeamName || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const matchData: Omit<Match, 'id' | 'createdAt' | 'updatedAt'> = {
        clubs: {
          home: {
            name: formData.homeTeamName,
            logo: formData.homeTeamLogo || '/placeholder.svg'
          },
          away: {
            name: formData.awayTeamName,
            logo: formData.awayTeamLogo || '/placeholder.svg'
          }
        },
        streams: {
          hls1: formData.hls1 || undefined,
          hls2: formData.hls2 || undefined,
          src1: formData.src1 || undefined,
          src2: formData.src2 || undefined,
          mhls1: formData.mhls1 || undefined,
          mhls2: formData.mhls2 || undefined,
        },
        score: {
          home: formData.homeScore,
          away: formData.awayScore,
          status: formData.status,
          type: formData.type === 'HOT' ? 'HOT' : undefined
        },
        competition: {
          id: formData.competitionId || 'custom',
          name: formData.competitionName || 'Custom League',
          matchday: formData.matchday
        },
        kickoff: {
          date: formData.date,
          time: formData.time,
          timezone: formData.timezone
        },
        venue: {
          name: formData.venueName || 'TBD',
          city: formData.venueCity || 'TBD',
          country: formData.venueCountry || 'TBD'
        }
      };

      await matchService.addMatch(matchData);
      
      toast({
        title: "Success",
        description: "Match added successfully!",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error adding match:', error);
      toast({
        title: "Error",
        description: "Failed to add match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Add New Match</h1>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Teams Section */}
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Enter the home and away team details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Home Team</h3>
                  <div className="space-y-2">
                    <Label htmlFor="homeTeamName">Team Name *</Label>
                    <Input
                      id="homeTeamName"
                      value={formData.homeTeamName}
                      onChange={(e) => handleInputChange('homeTeamName', e.target.value)}
                      placeholder="e.g., Manchester United"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeTeamLogo">Logo URL</Label>
                    <Input
                      id="homeTeamLogo"
                      value={formData.homeTeamLogo}
                      onChange={(e) => handleInputChange('homeTeamLogo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Away Team</h3>
                  <div className="space-y-2">
                    <Label htmlFor="awayTeamName">Team Name *</Label>
                    <Input
                      id="awayTeamName"
                      value={formData.awayTeamName}
                      onChange={(e) => handleInputChange('awayTeamName', e.target.value)}
                      placeholder="e.g., Liverpool"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awayTeamLogo">Logo URL</Label>
                    <Input
                      id="awayTeamLogo"
                      value={formData.awayTeamLogo}
                      onChange={(e) => handleInputChange('awayTeamLogo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streams Section */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Sources</CardTitle>
              <CardDescription>Add streaming URLs (at least one is recommended)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hls1">HLS Stream 1</Label>
                  <Input
                    id="hls1"
                    value={formData.hls1}
                    onChange={(e) => handleInputChange('hls1', e.target.value)}
                    placeholder="https://example.com/stream.m3u8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hls2">HLS Stream 2</Label>
                  <Input
                    id="hls2"
                    value={formData.hls2}
                    onChange={(e) => handleInputChange('hls2', e.target.value)}
                    placeholder="https://example.com/stream2.m3u8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="src1">Iframe Source 1</Label>
                  <Input
                    id="src1"
                    value={formData.src1}
                    onChange={(e) => handleInputChange('src1', e.target.value)}
                    placeholder="https://example.com/embed/match"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="src2">Iframe Source 2</Label>
                  <Input
                    id="src2"
                    value={formData.src2}
                    onChange={(e) => handleInputChange('src2', e.target.value)}
                    placeholder="https://example.com/embed/match2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score & Status Section */}
          <Card>
            <CardHeader>
              <CardTitle>Score & Status</CardTitle>
              <CardDescription>Set the current match status and score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeScore">Home Score</Label>
                  <Input
                    id="homeScore"
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={(e) => handleInputChange('homeScore', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayScore">Away Score</Label>
                  <Input
                    id="awayScore"
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={(e) => handleInputChange('awayScore', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="HT">Half Time</SelectItem>
                      <SelectItem value="FT">Full Time</SelectItem>
                      <SelectItem value="POSTPONED">Postponed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Normal</SelectItem>
                      <SelectItem value="HOT">Hot Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition Section */}
          <Card>
            <CardHeader>
              <CardTitle>Competition</CardTitle>
              <CardDescription>Competition and matchday information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="competitionId">Competition ID</Label>
                  <Input
                    id="competitionId"
                    value={formData.competitionId}
                    onChange={(e) => handleInputChange('competitionId', e.target.value)}
                    placeholder="e.g., epl, ucl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitionName">Competition Name</Label>
                  <Input
                    id="competitionName"
                    value={formData.competitionName}
                    onChange={(e) => handleInputChange('competitionName', e.target.value)}
                    placeholder="e.g., Premier League"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchday">Matchday</Label>
                  <Input
                    id="matchday"
                    type="number"
                    min="1"
                    value={formData.matchday}
                    onChange={(e) => handleInputChange('matchday', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kickoff Section */}
          <Card>
            <CardHeader>
              <CardTitle>Kickoff Time</CardTitle>
              <CardDescription>When the match is scheduled to start</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    placeholder="GMT"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue Section */}
          <Card>
            <CardHeader>
              <CardTitle>Venue</CardTitle>
              <CardDescription>Where the match is being played</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">Stadium Name</Label>
                  <Input
                    id="venueName"
                    value={formData.venueName}
                    onChange={(e) => handleInputChange('venueName', e.target.value)}
                    placeholder="e.g., Old Trafford"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueCity">City</Label>
                  <Input
                    id="venueCity"
                    value={formData.venueCity}
                    onChange={(e) => handleInputChange('venueCity', e.target.value)}
                    placeholder="e.g., Manchester"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueCountry">Country</Label>
                  <Input
                    id="venueCountry"
                    value={formData.venueCountry}
                    onChange={(e) => handleInputChange('venueCountry', e.target.value)}
                    placeholder="e.g., England"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button asChild variant="outline">
              <Link to="/admin">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} variant="watch">
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Adding...' : 'Add Match'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddMatch;