import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Heart, DollarSign, MessageCircle, Lightbulb } from 'lucide-react';

interface IdeaFeedProps {
  ideas: any[];
  onViewIdea: (ideaId: string) => void;
  currentUser: any;
  onNavigate: (page: string) => void;
  loading?: boolean;
  error?: string;
}

export function IdeaFeed({ ideas, onViewIdea, currentUser, onNavigate, loading = false, error }: IdeaFeedProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Welcome to Idea Launchpad</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple platform for sharing early-stage ideas and getting community feedback before taking the next step.
        </p>
        
        {!currentUser && (
          <div className="flex gap-4 justify-center mt-6">
            <Button 
              onClick={() => onNavigate('signup')} 
              size="lg"
              className="gap-2"
            >
              <Lightbulb className="h-5 w-5" />
              Share Your Idea
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('login')} 
              size="lg"
            >
              Log In
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Ideas</h2>
          {currentUser && (
            <Button onClick={() => onNavigate('new-idea')} className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Post New Idea
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ideas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {ideas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{idea.title}</CardTitle>
                    <p className="text-muted-foreground">by {idea.authorName}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{idea.createdAt}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4 line-clamp-3">
                  {idea.description.length > 200 
                    ? `${idea.description.substring(0, 200)}...` 
                    : idea.description
                  }
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{idea.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${idea.pledgedAmount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{idea.comments.length}</span>
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
        )}
        
        {!loading && !error && ideas.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share an innovative idea with the community!
            </p>
            {currentUser && (
              <Button onClick={() => onNavigate('new-idea')}>
                Post the First Idea
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}