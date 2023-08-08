import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { event, initialize, set, pageview } from 'react-ga';

export const InitializeGA = () => {
  let location = useLocation();

  useEffect(() => {
    initialize('UA-211895538-1');
    pageview(window.location.pathname + window.location.search);
  });

  useEffect(() => {
    const path = location.pathname + location.search;
    set({ page: path });
    pageview(path);
  }, [location]);
};

export const GAEvent = (category: string, action: string, label?: string) => {
  event({ category, action, label });
};
