# Battery Health Monitor - Next.js Clone

A Next.js implementation of the Battery Health Visualization Dashboard, designed to transform complex battery performance data into intuitive, actionable insights.

## Features

- **Dashboard Overview**: Visualize battery health metrics at a glance
- **Battery Details**: Comprehensive view of individual battery performance
- **Real-time Updates**: Simulated real-time battery data updates
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Authentication**: Secure access with NextAuth.js

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: NextAuth.js
- **Charts**: Recharts for data visualization

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-battery-monitor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env.local` file with:
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Access the application:
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Account

Use these credentials to access the demo:
- Email: demo@coulomb.ai
- Password: password

## File Structure

```
nextjs-battery-monitor/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Authentication
│   └── layout.tsx          # Root layout
├── components/             # UI components
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Layout components (sidebar, topbar)
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities and services
│   ├── data/               # Data storage and mock data
│   ├── store/              # Zustand state stores
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript type definitions
```

## Adding Real Database Connection

To replace the in-memory storage with a real database:

1. Install Prisma or Drizzle ORM
2. Configure your database connection
3. Update API implementation in `app/api/` routes
4. Replace mock data services in `lib/data/` with real database calls