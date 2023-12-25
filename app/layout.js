import { Toaster } from 'react-hot-toast'
import './globals.css'
import Loading from '@/components/ui/loading'

export const metadata = {
  title: 'MoneySavvy',
  description: 'Take Control of Your Finances, Empower Your Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Loading />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
