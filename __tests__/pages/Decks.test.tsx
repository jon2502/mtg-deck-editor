import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Page from '@/app/(root)/Decks/page'

jest.mock('../../context/deck_context', () => ({
  useDeckContext: () => ({
    decklist: [
    {
      "_id": "1",
      "name": "test",
      "format": "standard"
    },
    {
      "_id": "2",
      "name": "commanderdeck",
      "format": "commander"
    }
  ],
    importDecks: jest.fn()
  })
}));

describe('page ', () => {
  it('renders a list of deck from database', async () => {
    render( 
      <Page />
    );
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('commanderdeck')).toBeInTheDocument();
  });
});

