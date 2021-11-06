import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GA4 from "react-ga4";

export const InitializeGA = () => {
  let location = useLocation();

  useEffect(() => {
    GA4.initialize("G-4SPG22W5ZZ");
    GA4.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  });

  useEffect(() => {
    const path = location.pathname + location.search;
    GA4.set({ page: path });
    GA4.send({
      hitType: "pageview",
      page: path,
    });
  }, [location]);
};

export const GAEvent = (category: string, action: string, label?: string) => {
  GA4.event({ category, action, label });
};
