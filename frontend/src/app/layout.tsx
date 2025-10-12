import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'PolkaQuadrant - AI-Secured Quadratic Funding Validator',
  description: 'Enterprise-grade quadratic funding validation with AI-powered fraud detection. Making LATAM community funding transparent, fraud-free, and verifiable.',
  keywords: ['quadratic funding', 'AI detection', 'blockchain', 'Polkadot', 'fraud prevention', 'funding validator'],
  authors: [{ name: 'PolkaQuadrant Team' }],
  creator: 'PolkaQuadrant',
  publisher: 'PolkaQuadrant',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://polkaquadrant.com',
    title: 'PolkaQuadrant - AI-Secured Quadratic Funding Validator',
    description: 'Enterprise-grade quadratic funding validation with AI-powered fraud detection.',
    images: [
      {
        url: 'https://polkaquadrant.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PolkaQuadrant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolkaQuadrant - AI-Secured Quadratic Funding Validator',
    description: 'Enterprise-grade quadratic funding validation with AI-powered fraud detection.',
    images: ['https://polkaquadrant.com/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Analytics & Performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Color scheme */}
        <meta name="color-scheme" content="dark light" />
        
        {/* Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body 
        className={`${inter.className} bg-black text-white dark`}
        suppressHydrationWarning
      >
        {children}
        
        {/* Performance optimizations */}
        <script 
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              // Detect theme preference
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            `,
          }}
        />
      </body>
    </html>
  )
}