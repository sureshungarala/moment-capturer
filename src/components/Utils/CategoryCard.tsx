import React, { memo, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GAEvent } from '../Utils/GA-Tracker';

interface CardProps {
  title: string;
  src: string | undefined;
  altText: string;
  categoryTag: string;
  fetching: boolean;
}

const CategoryCard: React.FunctionComponent<CardProps> = (props: CardProps) => {
  const [cardTemplate, setCardTemplate] = useState<React.ReactElement>(
    <div className='loader_facade'></div>
  );
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let template = cardTemplate;
    if (props.fetching) {
      template = <div className='loader_facade'></div>;
    } else if (props.src) {
      const observer = new window.IntersectionObserver(
        (entries: Array<IntersectionObserverEntry>) => {
          const [{ isIntersecting }] = entries;
          if (isIntersecting) {
            setCardTemplate(<img alt={props.altText} src={props.src} />);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '0px 0px 200px 0px',
        }
      );
      observer.observe(cardRef.current as Element);
    } else {
      template = (
        <div className='fallback'>
          <span>No moments yet. Refresh or check back again later.</span>
        </div>
      );
    }
    setCardTemplate(template);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className='categoryCard' ref={cardRef}>
      <NavLink
        to={`/${props.categoryTag}`}
        onClick={() => {
          GAEvent('Home', 'Navigate_to', `/${props.categoryTag}`);
        }}
      >
        <div className='thumbnail'>{cardTemplate}</div>
        <div className='title'>{props.title}</div>
      </NavLink>
    </div>
  );
};

export default memo(
  CategoryCard,
  (prevProps: CardProps, nextProps: CardProps) =>
    prevProps.fetching === nextProps.fetching
);
