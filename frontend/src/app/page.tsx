import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-polkadot-pink to-polkadot-purple bg-clip-text text-transparent">
          🪐 PolkaQuadrant
        </h1>
        <p className="text-2xl text-center text-muted-foreground mb-8">
          AI-Secured Quadratic Funding Validator
        </p>
        
        {/* Call to Action */}
        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-polkadot-pink to-polkadot-purple text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            View Dashboard →
          </Link>
          <a
            href="http://localhost:4000/api/v1/ai/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-polkadot-pink text-polkadot-pink rounded-lg font-semibold hover:bg-polkadot-pink hover:text-white transition-all"
          >
            Try AI Demo
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-6 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">🧠 AI Detection</h3>
            <p className="text-muted-foreground">
              TensorFlow.js powered fraud detection for Sybil attacks, wash trading, and bot behavior
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">📊 Dashboard</h3>
            <p className="text-muted-foreground">
              Real-time 4-quadrant visualization with dark mode and live updates
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">🔗 Mainnet Ready</h3>
            <p className="text-muted-foreground">
              Connected to Acala & Rococo parachains with WebSocket support
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-medium">All Systems Operational</span>
          </div>
          
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Frontend Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>AI Engine Built</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Dashboard Live</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
