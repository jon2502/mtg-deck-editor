import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../../app/(root)/Decks/View/[id]/page'

import {useParams} from 'next/navigation';
jest.mock('next/navigation');
(useParams as jest.Mock).mockReturnValue({ id: 'mockSlug' });

describe('Page', () => {
  it('renders page', () => {
    render(<Page />)
  })
})