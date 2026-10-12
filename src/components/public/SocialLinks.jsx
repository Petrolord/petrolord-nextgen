import React from 'react';

// Our social channels, shown in the homepage and legal-page footers. The
// YouTube channel is the one the Petrolord Suite footer links to.
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCIMWWHRACclH-LygYUOXa4Q';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/lordswayenergy';

const linkStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.5em' };

/** YouTube, with the play mark in its brand red. */
export const YouTubeLink = ({ className, style }) => (
  <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className={className}
    data-testid="footer-youtube-link" style={{ ...linkStyle, ...style }}>
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="3.5" fill="#FF0000" />
      <path d="M8 4l5.2 3L8 10z" fill="#FFFFFF" />
    </svg>
    YouTube
  </a>
);

/** LinkedIn, with the "in" mark in its brand blue. */
export const LinkedInLink = ({ className, style }) => (
  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={className}
    data-testid="footer-linkedin-link" style={{ ...linkStyle, ...style }}>
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <circle cx="6.6" cy="6.6" r="1.7" fill="#FFFFFF" />
      <rect x="5.2" y="9.2" width="2.8" height="9.3" fill="#FFFFFF" />
      <path d="M10.4 9.2h2.7v1.3c.4-.8 1.4-1.5 2.9-1.5 3 0 3.5 2 3.5 4.5v5h-2.8v-4.4c0-1.1 0-2.5-1.5-2.5s-1.9 1.2-1.9 2.4v4.5h-2.9z" fill="#FFFFFF" />
    </svg>
    LinkedIn
  </a>
);
