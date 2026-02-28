import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata = {
  title: 'CertPath — Find Your Certification Roadmap',
  description: 'Explore industry certifications and career paths.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
