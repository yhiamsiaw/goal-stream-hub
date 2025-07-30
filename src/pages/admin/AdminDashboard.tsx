import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Tv, Calendar, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/matchService';
import { Match } from '@/types/Match';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAllMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await matchService.deleteMatch(id);
      setMatches(matches.filter(match => match.id !== id));
      toast({
        title: "Success",
        description: "Match deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        title: "Error",
        description: "Failed to delete match.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = {
    total: matches.length,
    live: matches.filter(m => m.score.status === 'LIVE').length,
    upcoming: matches.filter(m => 
      m.score.status !== 'LIVE' && 
      m.score.status !== 'FT' && 
      new Date(m.kickoff.date) >= new Date()
    ).length,
    completed: matches.filter(m => m.score.status === 'FT').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'live';
      case 'FT': return 'success';
      case 'HT': return 'accent';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">66</span>
              </div>
              <span className="text-xl font-bold gradient-text">Sports Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/">View Site</Link>
            </Button>
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Now</CardTitle>
              <Tv className="h-4 w-4 text-live" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-live">{stats.live}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Match Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Matches</h1>
          <Button asChild variant="watch">
            <Link to="/admin/add-match">
              <Plus className="w-4 h-4 mr-2" />
              Add New Match
            </Link>
          </Button>
        </div>

        {/* Matches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Matches</CardTitle>
            <CardDescription>
              Manage all football matches and their streaming sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={match.clubs.home.logo} 
                          alt={match.clubs.home.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{match.clubs.home.name}</span>
                      </div>
                      
                      <span className="text-muted-foreground">vs</span>
                      
                      <div className="flex items-center space-x-2">
                        <img 
                          src={match.clubs.away.logo} 
                          alt={match.clubs.away.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{match.clubs.away.name}</span>
                      </div>
                      
                      <Badge variant={getStatusColor(match.score.status) as any}>
                        {match.score.status}
                      </Badge>
                      
                      {match.score.type === 'HOT' && (
                        <Badge variant="destructive">HOT</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {match.competition.name}
                      </span>
                      
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.kickoff.date).toLocaleDateString()}
                      </span>
                      
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/edit-match/${match.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Match</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this match? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteMatch(match.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first match to get started.
                </p>
                <Button asChild variant="watch">
                  <Link to="/admin/add-match">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Match
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;