'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Lock, ChevronDown } from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,255,136,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,255,136,0.03),transparent_50%)]"></div>
        
        {/* Animated Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Cursor-Following Glow */}
        <div 
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)`,
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'blur(40px)',
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Animated Title */}
            <div className="text-center space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm animate-pulse">
                  <span className="text-sm font-mono text-emerald-300">✦ AI-Powered Security Protocol</span>
                </div>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-7xl sm:text-8xl font-black tracking-tighter leading-tight">
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-clip-text text-transparent animate-gradient-shift">
                    POLKA
                  </span>
                  <br />
                  <span className="text-white">QUADRANT</span>
                </h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse"></div>
              </div>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Enterprise-Grade <span className="text-emerald-400 font-semibold">Quadratic Funding</span> Validation with <span className="text-emerald-400 font-semibold">AI-Secured Detection</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/dashboard" className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg font-bold text-lg hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-2">
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="http://localhost:4000/api/v1/ai/demo" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-emerald-500/50 rounded-lg font-bold text-lg hover:border-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                  Try AI Demo
                  <Zap className="w-5 h-5" />
                </a>
              </div>

              {/* Status Indicator */}
              <div className="flex justify-center pt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-emerald-300 font-mono">Live • Operational • Secured</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-emerald-400/50" />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-black text-center mb-16 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Unmatched Capabilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "AI Detection Engine",
                  desc: "TensorFlow.js powered fraud detection for Sybil attacks, wash trading, and bot behavior",
                  delay: "0s"
                },
                {
                  icon: TrendingUp,
                  title: "Real-Time Dashboard",
                  desc: "4-quadrant visualization with live analytics and dark mode optimized UI",
                  delay: "0.1s"
                },
                {
                  icon: Lock,
                  title: "Blockchain Secured",
                  desc: "Connected to Acala & Rococo parachains with WebSocket real-time updates",
                  delay: "0.2s"
                }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={i}
                    className="group relative p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-400/60 transition-all duration-500 hover:bg-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
                    style={{
                      animation: `slideUp 0.6s ease-out ${feature.delay} both`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/5 group-hover:to-emerald-600/5 transition-all duration-500"></div>
                    
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-400/40 group-hover:to-emerald-600/40 transition-all duration-500">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Uptime", value: "99.9%", icon: "⚡" },
                { label: "AI Accuracy", value: "99.2%", icon: "🎯" },
                { label: "Transactions/s", value: "10K+", icon: "⚙️" },
                { label: "Active Users", value: "5K+", icon: "👥" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/60 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all duration-500 group">
                  <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{stat.icon}</div>
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm uppercase tracking-widest font-mono group-hover:text-emerald-300 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="relative min-h-96 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="w-full max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl sm:text-6xl font-black">
              Ready to Secure Your <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">Funding?</span>
            </h2>
            <p className="text-xl text-gray-400">Join the next generation of trustless quadratic funding validation</p>
            <Link href="/dashboard" className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-3 mx-auto">
              Get Started Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(0, 255, 136, 0.5));
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}