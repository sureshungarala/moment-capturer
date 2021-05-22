import React from "react";
import { NavLink } from "react-router-dom";

interface CardProps {
  title: string;
  src: string | undefined;
  altText: string;
  categoryTag: string;
}

const CategoryCard: React.FunctionComponent<CardProps> = (props: CardProps) => (
  <NavLink to={`/${props.categoryTag}`}>
    <div className="categoryCard">
      <div className="thumbnail">
        {props.src && <img src={props.src} alt={props.altText} />}
        {!props.src && (
          <div className="fallback">
            No moments yet. Check again after some time.
          </div>
        )}
      </div>
      <div className="title">{props.title}</div>
    </div>
  </NavLink>
);

export default CategoryCard;
