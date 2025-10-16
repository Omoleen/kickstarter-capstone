import React from 'react';
import { Button } from './ui/simple-button';
import { Lightbulb, User, Plus } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentPage: string;
}

export function Header({ currentUser, onNavigate, onLogout, currentPage }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('feed')}
          >
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Idea Launchpad</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Button
                  variant={currentPage === 'feed' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('feed')}
                  size="sm"
                >
                  Browse Ideas
                </Button>
                <Button
                  variant={currentPage === 'new-idea' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('new-idea')}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Post Idea
                </Button>
                <Button
                  variant={currentPage === 'profile' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('profile')}
                  size="sm"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={currentPage === 'login' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('login')}
                  size="sm"
                >
                  Log In
                </Button>
                <Button
                  variant={currentPage === 'signup' ? 'default' : 'outline'}
                  onClick={() => onNavigate('signup')}
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}