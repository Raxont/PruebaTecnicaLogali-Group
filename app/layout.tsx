import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// ? Se cargan fuentes Google centralmente para consistencia tipográfica.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// * Metadatos básicos de la app.
export const metadata: Metadata = {
  title: 'FormaPro Dashboard',
  description: 'Panel de pagos de FormaPro Academy',
}

// * Root layout que envuelve todas las páginas y aplica fuentes globales.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}