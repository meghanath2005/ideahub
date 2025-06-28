import React from 'react'
import { AuthContextProvider } from '@/context/AuthContext'
import { Inter } from 'next/font/google'
import './globals.css'

// Load the Inter font with 'latin' subset
const inter = Inter( { subsets: [ 'latin' ] } );

// Metadata for the application
export const metadata = {
  title: 'IdeaHub',
  description: 'AI powered idea evaluation and planning',
};

// Root layout component for the application
export default function RootLayout( { children }: { children: React.ReactNode } ) {
  return (
    <html lang="en">
      {/*
        The <head /> component will contain the components returned by the nearest parent
        head.js. It can be used to define the document head for SEO, metadata, and other purposes.
        Learn more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthContextProvider>
          <header className="flex items-center gap-2 p-4 border-b">
            <img src="/logo.svg" alt="IdeaHub" className="h-8 w-auto" />
            <h1 className="text-lg font-semibold">IdeaHub</h1>
          </header>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
