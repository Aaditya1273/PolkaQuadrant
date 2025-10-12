# PolkaQuadrant Frontend

Next.js 14 dashboard for AI-powered Quadratic Funding validation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, Recharts
- **Animations**: Framer Motion
- **Blockchain**: Polkadot.js API
- **State**: Zustand
- **Data Fetching**: SWR

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js 14 App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── dashboard/    # Dashboard pages
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/          # UI primitives
│   ├── charts/      # Chart components
│   └── layout/      # Layout components
├── lib/             # Utilities and helpers
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── config/          # Configuration files
└── utils/           # Utility functions
```

## Key Features

- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📊 Real-time quadrant visualization
- 🔗 Polkadot mainnet/testnet integration
- 🧠 AI fraud detection display
- 📱 Responsive design
- ⚡ Optimized performance

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all available variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Polkadot.js](https://polkadot.js.org/docs/)
