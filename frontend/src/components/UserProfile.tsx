import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Heart, DollarSign, MessageCircle, User, Calendar } from 'lucide-react';
import { useUserIdeas } from '../api';

interface UserProfileProps {
  user: any;
  onViewIdea: (ideaId: string) => void;
}

export function UserProfile({ user, onViewIdea }: UserProfileProps) {
  const { ideas, loading, error, stats } = useUserIdeas();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading stats...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalIdeas}</div>
                <div className="text-sm text-muted-foreground">Ideas Posted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">${stats.totalPledged}</div>
                <div className="text-sm text-muted-foreground">Total Pledged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.totalComments}</div>
                <div className="text-sm text-muted-foreground">Total Comments</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Ideas ({loading ? '...' : ideas.length})</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your ideas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {idea.createdAt}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-red-500">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">{idea.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-500">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">${idea.pledgedAmount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">{idea.comments.length}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onViewIdea(idea.id)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ideas posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your first innovative idea with the community!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}