import './globals.css'

export const metadata = {
  title: 'MoneySavvy',
  description: 'Take Control of Your Finances, Empower Your Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
