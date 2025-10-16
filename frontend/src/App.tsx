import React, { useState } from 'react';
import { Header } from './components/Header';
import { IdeaFeed } from './components/IdeaFeed';
import { IdeaDetail } from './components/IdeaDetail';
import { NewIdeaForm } from './components/NewIdeaForm';
import { UserProfile } from './components/UserProfile';
import { AuthPage } from './components/AuthPage';
import { useAuth, useIdeas, useIdea } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('feed');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Use our API hooks
  const { user, login, register, logout, loading: authLoading, error: authError } = useAuth();
  const { ideas, createIdea, likeIdea, pledgeToIdea, loading: ideasLoading, error: ideasError } = useIdeas();
  const { 
    idea: selectedIdea, 
    addComment, 
    likeIdea: likeSelectedIdea, 
    pledgeToIdea: pledgeToSelectedIdea, 
    loading: ideaLoading,
    error: ideaError
  } = useIdea(selectedIdeaId);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      setCurrentPage('feed');
    }
    return success;
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<boolean> => {
    const success = await register(name, email, password);
    if (success) {
      setCurrentPage('feed');
    }
    return success;
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('feed');
    setSelectedIdeaId(null);
  };

  const handleViewIdea = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setCurrentPage('detail');
  };

  const handleCreateIdea = async (title: string, description: string): Promise<boolean> => {
    if (!user) return false;
    
    const success = await createIdea(title, description);
    if (success) {
      setCurrentPage('feed');
    }
    return success;
  };

  const handleLikeIdea = async (ideaId: string) => {
    if (!user) {
      throw new Error('You must be logged in to like ideas');
    }
    
    // Use the appropriate hook based on current page
    if (currentPage === 'detail' && selectedIdeaId === ideaId) {
      // On detail page, use the single idea hook
      await likeSelectedIdea();
    } else {
      // On other pages, use the ideas list hook
      await likeIdea(ideaId);
    }
  };

  const handlePledgeSupport = async (ideaId: string) => {
    if (!user) {
      throw new Error('You must be logged in to pledge support');
    }
    
    // Use the appropriate hook based on current page
    if (currentPage === 'detail' && selectedIdeaId === ideaId) {
      // On detail page, use the single idea hook
      await pledgeToSelectedIdea();
    } else {
      // On other pages, use the ideas list hook
      await pledgeToIdea(ideaId);
    }
  };

  const handleAddComment = async (ideaId: string, content: string) => {
    if (!user) return;
    await addComment(content);
  };


  // Show loading state for initial auth check
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={user}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Show global errors */}
        {(authError || ideasError) && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">
              {authError || ideasError}
            </p>
          </div>
        )}

        {currentPage === 'feed' && (
          <IdeaFeed 
            ideas={ideas}
            onViewIdea={handleViewIdea}
            currentUser={user}
            onNavigate={setCurrentPage}
            loading={ideasLoading}
            error={ideasError}
          />
        )}
        
        {currentPage === 'detail' && selectedIdea && (
          <IdeaDetail 
            idea={selectedIdea}
            currentUser={user}
            onLike={handleLikeIdea}
            onPledge={handlePledgeSupport}
            onAddComment={handleAddComment}
            onBack={() => {
              setCurrentPage('feed');
              setSelectedIdeaId(null);
            }}
            loading={ideaLoading}
            error={ideaError}
          />
        )}
        
        {currentPage === 'new-idea' && (
          <NewIdeaForm 
            onSubmit={handleCreateIdea}
            onCancel={() => setCurrentPage('feed')}
            currentUser={user}
          />
        )}
        
        {currentPage === 'profile' && (
          <UserProfile 
            user={user}
            onViewIdea={handleViewIdea}
          />
        )}
        
        {(currentPage === 'login' || currentPage === 'signup') && (
          <AuthPage 
            mode={currentPage as 'login' | 'signup'}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSwitchMode={(mode) => setCurrentPage(mode)}
            loading={authLoading}
            error={authError}
          />
        )}
      </main>
    </div>
  );
}