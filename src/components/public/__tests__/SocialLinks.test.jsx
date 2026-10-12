// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '@/components/Footer';
import { YOUTUBE_CHANNEL_URL, LINKEDIN_URL } from '../SocialLinks';

describe('footer social links', () => {
  it('links YouTube and LinkedIn in a new tab without an opener', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const yt = screen.getByTestId('footer-youtube-link');
    const li = screen.getByTestId('footer-linkedin-link');
    expect(yt.getAttribute('href')).toBe(YOUTUBE_CHANNEL_URL);
    expect(li.getAttribute('href')).toBe('https://www.linkedin.com/company/lordswayenergy');
    expect(LINKEDIN_URL).toBe(li.getAttribute('href'));
    for (const a of [yt, li]) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    }
    expect(yt.textContent).toBe('YouTube');
    expect(li.textContent).toBe('LinkedIn');
  });
});
