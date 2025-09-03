# StoryThreads

> Turn personal context into shared narratives

StoryThreads is a gentle, intimate web application where users share honest story fragments that are automatically clustered into narrative threads. The system surfaces resonance with others while maintaining privacy and focusing on human connection over engagement metrics.

## ✨ Features

- **Intimate Writing Experience**: Simple, focused interface for sharing personal stories
- **Automatic Threading**: AI-powered clustering groups similar stories into meaningful themes
- **Privacy-First**: Anonymous by default with optional visibility controls
- **Resonance Discovery**: Find others who share similar experiences
- **Gentle UX**: Soft typography, ample whitespace, subtle animations
- **No Vanity Metrics**: Focus on connection, not engagement numbers

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (prod) with pgvector support
- **AI**: OpenAI integration for embeddings, clustering, and content generation
- **Auth**: NextAuth.js with email magic links and GitHub OAuth
- **Styling**: Tailwind CSS with custom design system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sukanyaghosh74/StoryThreads.git
   cd storythreads
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   OPENAI_API_KEY="your-openai-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Seed with sample data**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 📁 Project Structure

```
storythreads/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── threads/           # Thread pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/             # React components
│   ├── lib/                    # Utility libraries
│   └── tests/                  # Test files
├── prisma/                     # Database schema & migrations
├── public/                     # Static assets
└── package.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required for AI features |
| `EMBEDDING_MODEL` | OpenAI embedding model | `text-embedding-3-small` |
| `TITLE_MODEL` | OpenAI completion model | `gpt-4o-mini` |

### Database Configuration

The application uses Prisma with support for both SQLite (development) and PostgreSQL (production).

**SQLite (Development)**
```env
DATABASE_URL="file:./dev.db"
```

**PostgreSQL (Production)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/storythreads"
```

For production with pgvector support, ensure the `pgvector` extension is enabled in your PostgreSQL database.

## 🎨 Design System

### Colors
- **Primary**: Rose-500 (#f43f5e)
- **Background**: Gray-50 (#f9fafb)
- **Text**: Gray-900 (#111827)
- **Accent**: Rose-400 (#fb7185)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Scale**: Modular scale with 1.25 ratio

### Components
- **Cards**: Rounded-2xl with soft shadows
- **Buttons**: Rose primary, subtle hover states
- **Spacing**: Consistent 4px grid system
- **Animations**: Gentle fade-in and slide-up transitions

## 🔐 Authentication

StoryThreads supports multiple authentication methods:

1. **Email Magic Links**: Passwordless authentication via email
2. **GitHub OAuth**: Social login for GitHub users

### Setting up GitHub OAuth

1. Create a new OAuth app in your GitHub account
2. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
3. Add your GitHub client ID and secret to `.env.local`

## 🤖 AI Integration

### Embeddings
- Uses OpenAI's text-embedding-3-small model
- Generates 1536-dimensional vectors for semantic similarity
- Fallback to hash-based embeddings when OpenAI is unavailable

### Clustering
- Online k-means style clustering with cosine similarity
- Threshold-based thread assignment (default: 0.18)
- Dynamic centroid updates for existing threads

### Content Generation
- **Thread Titles**: Poetic, human-like titles (2-4 words)
- **Synopses**: Gentle, 1-2 sentence summaries
- **Model**: GPT-4o-mini for natural language generation

## 📊 API Endpoints

### Fragments
- `POST /api/fragments` - Create new fragment
- `POST /api/delete` - Delete own fragment

### Threads
- `GET /api/threads` - List all threads
- `GET /api/threads/[id]` - Get thread details

### Interactions
- `POST /api/react` - Toggle reaction
- `POST /api/resonance` - Find similar fragments
- `POST /api/report` - Report inappropriate content

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Database Migration

For production deployments, ensure your database is properly migrated:

```bash
npm run db:push
npm run db:generate
```

## 🔒 Privacy & Security

- **Anonymous by Default**: All fragments start anonymous
- **No Tracking**: No analytics, pixels, or user behavior tracking
- **Data Minimization**: Only essential data is stored
- **User Control**: Easy deletion and anonymity toggles
- **Content Moderation**: Report system for inappropriate content

## 🧪 Development

### Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npx prettier --write .

# Type check
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Prisma](https://www.prisma.io/)
- AI capabilities from [OpenAI](https://openai.com/)

## 🚧 Limitations & Future Work

### Current Limitations
- OpenAI dependency for AI features
- Single-threaded clustering (no parallel processing)
- Basic content moderation (manual review needed)

### Planned Features
- Local AI model support (Ollama, etc.)
- Advanced clustering algorithms
- Content moderation automation
- Mobile app
- Real-time notifications
- Thread discovery algorithms

---

**StoryThreads** - Where personal stories find their threads of connection.

