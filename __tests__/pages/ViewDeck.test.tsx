import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../../app/(root)/Decks/View/[id]/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({ id: 'test-id' }),
  usePathname: () => '/Decks/View/test-id',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)
  })
})