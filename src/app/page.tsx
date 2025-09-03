import { TopNav } from '@/components/TopNav'
import { ComposeCard } from '@/components/ComposeCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="pt-8">
        <ComposeCard />
      </main>
    </div>
  )
}
