import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

interface CardProps {
  title: string;
  src: string | undefined;
  altText: string;
  categoryTag: string;
}

const CategoryCard: React.FunctionComponent<CardProps> = (props: CardProps) => {
  const [cardTemplate, setCardTemplate] = useState<React.ReactFragment>(
    <div className="fallback"></div>
  );
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.src) {
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
          rootMargin: "0px 0px 200px 0px",
        }
      );
      observer.observe(cardRef.current as Element);
    } else {
      setCardTemplate(
        <div className="fallback">
          <span>No moments yet. Check again after some time.</span>
        </div>
      );
    }
  }, []);

  return (
    <div className="categoryCard" ref={cardRef}>
      <NavLink to={`/${props.categoryTag}`}>
        <div className="thumbnail">{cardTemplate}</div>
        <div className="title">{props.title}</div>
      </NavLink>
    </div>
  );
};

export default CategoryCard;
