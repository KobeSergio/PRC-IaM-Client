import Footer from '@/components/Footer'
import '/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PRC Inspection and Monitoring System',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[#F9FAFE] min-h-screen h-full flex flex-col justify-between'>
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
