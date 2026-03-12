import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/ui/Sidebar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Network Guardian - Cyber Dashboard',
  description: 'Real-time network traffic analysis and AI-driven threat detection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased selection:bg-teal-500/30 selection:text-teal-200 min-h-screen flex`} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 sm:ml-64 p-4 md:p-8 min-h-screen overflow-x-hidden relative">
          {/* Global Background Effects */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/20 to-transparent -z-10 pointer-events-none" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[100px] -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
