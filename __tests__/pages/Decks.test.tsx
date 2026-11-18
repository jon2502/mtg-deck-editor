import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../../app/(root)/Decks/page'

describe('Page', () => {
  it('renders page', () => {
    render(<Page />)
  })
})