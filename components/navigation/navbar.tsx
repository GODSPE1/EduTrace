'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isCurrentPage = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-white" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" aria-label="EduTrace home">
              <h1 className="text-2xl font-bold text-primary">EduTrace</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8" role="menubar">
              <Link
                href="/roadmaps"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                role="menuitem"
                aria-current={isCurrentPage('/roadmaps') ? 'page' : undefined}
                aria-label="Browse learning roadmaps"
              >
                Roadmaps
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  role="menuitem"
                  aria-current={isCurrentPage('/dashboard') ? 'page' : undefined}
                  aria-label="Your learning dashboard"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" aria-label="Loading user information"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.user_metadata?.first_name ?? user?.user_metadata?.full_name ?? user?.email ?? 'User'}
                </span>
                <Button variant="outline" onClick={signOut} aria-label="Sign out of your account">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" aria-label="Sign in to your account">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button aria-label="Create a new account">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Main menu"
              type="button"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}
          id="mobile-menu"
          role="menu"
          aria-labelledby="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link
              href="/roadmaps"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              role="menuitem"
              aria-current={isCurrentPage('/roadmaps') ? 'page' : undefined}
              onClick={closeMobileMenu}
            >
              Roadmaps
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                role="menuitem"
                aria-current={isCurrentPage('/dashboard') ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Auth Section */}
          <div className="px-2 pt-4 pb-3 border-t border-gray-200">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded mx-3" aria-label="Loading user information"></div>
            ) : user ? (
              <div className="space-y-3">
                <div className="px-3">
                  <span className="text-sm text-gray-700 block">
                    Welcome, {user?.user_metadata?.first_name ?? user?.user_metadata?.full_name ?? user?.email ?? 'User'}
                  </span>
                </div>
                <div className="px-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="w-full"
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <Link href="/auth/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full" aria-label="Sign in to your account">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={closeMobileMenu}>
                  <Button className="w-full" aria-label="Create a new account">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
