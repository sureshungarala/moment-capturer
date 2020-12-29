import React from "react";

interface BannerProps {
  title?: string;
  canRefresh?: boolean;
}

const Banner: React.FunctionComponent<BannerProps> = ({
  title,
  canRefresh,
}: BannerProps) => (
  <section className="banner">
    <div className="title">{title || "Failed to load. Try again."}</div>
    {canRefresh && (
      <button className="refresh" onClick={() => window.location.reload()}>
        Refresh
      </button>
    )}
  </section>
);

export default Banner;
