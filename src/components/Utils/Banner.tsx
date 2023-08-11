import React from 'react';

import '../../styles/templates/banner.scss';

interface BannerProps {
  title?: string;
  canRefresh?: boolean;
  onRefresh?: () => void;
}

const Banner: React.FunctionComponent<BannerProps> = ({
  title,
  canRefresh,
  onRefresh,
}: BannerProps) => (
  <section className='banner'>
    <div className='title'>{title || 'Failed to load. Try again.'}</div>
    {canRefresh && (
      <button
        className='refresh'
        onClick={() => {
          onRefresh ? onRefresh() : window.location.reload();
        }}
      >
        Refresh
      </button>
    )}
  </section>
);

export default Banner;
