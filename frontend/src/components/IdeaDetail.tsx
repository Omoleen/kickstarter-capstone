import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Textarea } from './ui/simple-textarea';
import { Heart, DollarSign, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { Separator } from './ui/simple-separator';

interface IdeaDetailProps {
  idea: any;
  currentUser: any;
  onLike: (ideaId: string) => Promise<void>;
  onPledge: (ideaId: string) => Promise<void>;
  onAddComment: (ideaId: string, content: string) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

export function IdeaDetail({ idea, currentUser, onLike, onPledge, onAddComment, onBack, loading = false, error }: IdeaDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isPledging, setIsPledging] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [actionError, setActionError] = useState<string>('');

  // Use backend data for like/pledge status
  const hasLiked = idea.isLikedByUser || false;
  const hasPledged = idea.isPledgedByUser || false;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setActionError('');
    try {
      await onLike(idea.id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to like idea');
    } finally {
      setIsLiking(false);
    }
  };

  const handlePledge = async () => {
    if (isPledging || hasPledged) return;
    setIsPledging(true);
    setActionError('');
    try {
      await onPledge(idea.id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to pledge support');
    } finally {
      setIsPledging(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser || isCommenting) return;
    setIsCommenting(true);
    try {
      await onAddComment(idea.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Ideas
      </Button>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{idea.title}</CardTitle>
                <p className="text-muted-foreground">
                  by {idea.authorName} • Posted on {idea.createdAt}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-medium">{idea.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-medium">${idea.pledgedAmount} pledged</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{idea.comments.length} comments</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{idea.description}</p>
          </div>

          {currentUser && (
            <div className="flex gap-4">
              <Button 
                onClick={handleLike}
                variant={hasLiked ? "default" : "outline"}
                disabled={isLiking}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                {isLiking ? 'Liking...' : hasLiked ? 'Liked!' : 'Like this idea'}
              </Button>
              
              <Button 
                onClick={handlePledge}
                variant={hasPledged ? "default" : "outline"}
                disabled={isPledging || hasPledged}
                className="gap-2"
              >
                <DollarSign className="h-4 w-4" />
                {isPledging ? 'Pledging...' : hasPledged ? 'Pledged $25!' : 'Pledge $25 Support'}
              </Button>
            </div>
          )}

          {(actionError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">
                {actionError || error}
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments ({idea.comments.length})</h3>
            
            {currentUser && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts on this idea..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isCommenting}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            )}

            {!currentUser && (
              <p className="text-muted-foreground text-center py-4">
                Please log in to leave a comment
              </p>
            )}

            <div className="space-y-4">
              {idea.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{comment.authorName}</p>
                        <p className="text-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {idea.comments.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}