import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { ComposeCard } from '@/components/ComposeCard'
import { FragmentItem } from '@/components/FragmentItem'

// Mock fetch globally
global.fetch = vi.fn()

// Mock NextAuth
const mockSession = {
  data: {
    user: {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com'
    }
  },
  status: 'authenticated'
}

const mockSessionUnauthenticated = {
  data: null,
  status: 'unauthenticated'
}

// Mock components that depend on external libraries
vi.mock('lucide-react', () => ({
  Heart: ({ className, ...props }: any) => <div data-testid="heart-icon" className={className} {...props} />,
  Eye: ({ className, ...props }: any) => <div data-testid="eye-icon" className={className} {...props} />,
  EyeOff: ({ className, ...props }: any) => <div data-testid="eye-off-icon" className={className} {...props} />,
  PenTool: ({ className, ...props }: any) => <div data-testid="pen-tool-icon" className={className} {...props} />,
  Trash2: ({ className, ...props }: any) => <div data-testid="trash-icon" className={className} {...props} />,
  Flag: ({ className, ...props }: any) => <div data-testid="flag-icon" className={className} {...props} />,
}))

const TestWrapper = ({ children, session = mockSession }: { children: React.ReactNode, session?: any }) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

describe('User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Compose Flow', () => {
    it('should show sign-in prompt for unauthenticated users', () => {
      render(
        <TestWrapper session={mockSessionUnauthenticated}>
          <ComposeCard />
        </TestWrapper>
      )

      expect(screen.getByText('Turn personal context into shared narratives')).toBeInTheDocument()
      expect(screen.getByText('Sign in to share your story fragments')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })

    it('should show compose form for authenticated users', () => {
      render(
        <TestWrapper>
          <ComposeCard />
        </TestWrapper>
      )

      expect(screen.getByText('Share something true')).toBeInTheDocument()
      expect(screen.getByPlaceholderText("What's something true you're carrying right now?")).toBeInTheDocument()
      expect(screen.getByText('Share with care')).toBeInTheDocument()
    })

    it('should handle fragment submission successfully', async () => {
      const mockResponse = {
        id: 'fragment123',
        threadId: 'thread123',
        title: 'Test Thread',
        synopsis: 'Test synopsis',
        resonance: [
          { id: 'res1', body: 'Resonant story 1', anonymous: true },
          { id: 'res2', body: 'Resonant story 2', anonymous: false }
        ]
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(
        <TestWrapper>
          <ComposeCard />
        </TestWrapper>
      )

      const textarea = screen.getByPlaceholderText("What's something true you're carrying right now?")
      const submitButton = screen.getByText('Share with care')

      fireEvent.change(textarea, { target: { value: 'This is a test fragment' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/fragments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: 'This is a test fragment', anonymous: true })
        })
      })

      await waitFor(() => {
        expect(screen.getByText('People who felt similarly...')).toBeInTheDocument()
        expect(screen.getByText('"Resonant story 1"')).toBeInTheDocument()
        expect(screen.getByText('"Resonant story 2"')).toBeInTheDocument()
      })
    })

    it('should toggle anonymity setting', () => {
      render(
        <TestWrapper>
          <ComposeCard />
        </TestWrapper>
      )

      const anonToggle = screen.getByText('Anonymous')
      expect(anonToggle).toBeInTheDocument()

      fireEvent.click(anonToggle)
      expect(screen.getByText('Visible')).toBeInTheDocument()
    })
  })

  describe('Fragment Interaction Flow', () => {
    it('should handle reaction toggle', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reacted: true })
      })

      render(
        <TestWrapper>
          <FragmentItem
            id="fragment123"
            body="Test fragment body"
            anonymous={true}
            createdAt="2024-01-01T00:00:00Z"
            isOwnFragment={false}
            hasReacted={false}
          />
        </TestWrapper>
      )

      const reactionButton = screen.getByTitle('I resonate with this')
      fireEvent.click(reactionButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/react', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fragmentId: 'fragment123' })
        })
      })
    })

    it('should handle fragment deletion for own fragments', async () => {
      const mockConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true)
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      const mockReload = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

      render(
        <TestWrapper>
          <FragmentItem
            id="fragment123"
            body="Test fragment body"
            anonymous={true}
            createdAt="2024-01-01T00:00:00Z"
            isOwnFragment={true}
            hasReacted={false}
          />
        </TestWrapper>
      )

      const deleteButton = screen.getByTitle('Delete my fragment')
      fireEvent.click(deleteButton)

      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this fragment? This action cannot be undone.')

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fragmentId: 'fragment123' })
        })
      })

      mockConfirm.mockRestore()
      mockReload.mockRestore()
    })

    it('should handle fragment reporting', async () => {
      const mockPrompt = vi.spyOn(window, 'prompt').mockImplementation(() => 'Inappropriate content')
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(
        <TestWrapper>
          <FragmentItem
            id="fragment123"
            body="Test fragment body"
            anonymous={true}
            createdAt="2024-01-01T00:00:00Z"
            isOwnFragment={false}
            hasReacted={false}
          />
        </TestWrapper>
      )

      const reportButton = screen.getByTitle('Report this fragment')
      fireEvent.click(reportButton)

      expect(mockPrompt).toHaveBeenCalledWith('Why are you reporting this fragment?')

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fragmentId: 'fragment123', reason: 'Inappropriate content' })
        })
      })

      expect(mockAlert).toHaveBeenCalledWith('Thank you for your report. We will review it shortly.')

      mockPrompt.mockRestore()
      mockAlert.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and titles', () => {
      render(
        <TestWrapper>
          <FragmentItem
            id="fragment123"
            body="Test fragment body"
            anonymous={true}
            createdAt="2024-01-01T00:00:00Z"
            isOwnFragment={false}
            hasReacted={false}
          />
        </TestWrapper>
      )

      expect(screen.getByTitle('I resonate with this')).toBeInTheDocument()
      expect(screen.getByTitle('Report this fragment')).toBeInTheDocument()
    })

    it('should have proper form labels', () => {
      render(
        <TestWrapper>
          <ComposeCard />
        </TestWrapper>
      )

      const textarea = screen.getByPlaceholderText("What's something true you're carrying right now?")
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveAttribute('required')
    })
  })
})
