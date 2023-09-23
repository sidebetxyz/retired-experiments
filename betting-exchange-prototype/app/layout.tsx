// layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import TopNavbar from './components/TopNavbar'; // Adjust the path accordingly
import BottomNavbar from './components/BottomNavbar'; // Adjust the path accordingly

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Side₿et | P2P Decentralized Betting Exchange Token | Prototype | $BET',
  description: 'Side₿et is a pioneering peer-to-peer decentralized betting exchange token. Dive into the prototype of $BET and be a part of the next evolution in betting exchanges.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen flex flex-col ${manrope.className}`}>
      <TopNavbar />
      <div className="flex-grow">
        {children}
      </div>
      <BottomNavbar />
    </div>
  );
}
