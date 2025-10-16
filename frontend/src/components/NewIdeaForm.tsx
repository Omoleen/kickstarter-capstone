import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Input } from './ui/simple-input';
import { Textarea } from './ui/simple-textarea';
import { Label } from './ui/simple-label';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface NewIdeaFormProps {
  onSubmit: (title: string, description: string) => Promise<boolean>;
  onCancel: () => void;
  currentUser: any;
}

export function NewIdeaForm({ onSubmit, onCancel, currentUser }: NewIdeaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to create an idea');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await onSubmit(title.trim(), description.trim());
      
      if (success) {
        setTitle('');
        setDescription('');
      } else {
        setError('Failed to create idea. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onCancel}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Ideas
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Share Your Idea</CardTitle>
              <p className="text-muted-foreground mt-1">
                Tell the community about your innovative concept and get valuable feedback
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Idea Title *</Label>
              <Input
                id="title"
                placeholder="Enter a clear, compelling title for your idea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your idea in detail. What problem does it solve? How would it work? What makes it unique?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] resize-none"
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/2000 characters
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tips for a great idea post:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clearly explain the problem your idea solves</li>
                <li>• Describe how your solution would work</li>
                <li>• Mention who would benefit from this idea</li>
                <li>• Be open to feedback and questions</li>
              </ul>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!title.trim() || !description.trim() || isSubmitting}
                className="gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                {isSubmitting ? 'Posting...' : 'Post Idea'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}