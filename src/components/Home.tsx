import React, { useEffect, useRef, useState } from "react";

import CategoryCard from "./Utils/CategoryCard";

import { fetchBestImagePerCategory } from "../utils/apis";
import { getAllCategories } from "../utils/helpers";
import { CardImage, Category } from "../info/types";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const categoryCards = useRef<CardImage[]>([]);
  const [cards, setCards] = useState<CardImage[]>([]);

  const createCategoryCardData = (
    category: Category,
    images: CardImage | undefined
  ) => {
    let categoryData = null;
    if (images) {
      categoryData = {
        category: category.name,
        tag: category.tag,
        srcSet: images.srcSet,
      };
    } else {
      categoryData = { category: category.name, tag: category.tag, srcSet: {} };
    }
    categoryCards.current = [...categoryCards.current, categoryData];
    setCards(categoryCards.current);
  };

  useEffect(() => {
    const allCategories = getAllCategories();
    allCategories.forEach((category) => {
      fetchBestImagePerCategory(category.tag)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              const { images }: { images: CardImage | undefined } = data;
              createCategoryCardData(category, images);
            });
          } else {
            createCategoryCardData(category, undefined);
          }
        })
        .catch((error) => {
          createCategoryCardData(category, undefined);
        });
    });
  }, []);

  return (
    <div className="home">
      {cards.map((card) => (
        <CategoryCard
          key={card.tag}
          src={card.srcSet["599px"]}
          altText={card.category}
          title={card.category}
          categoryTag={card.tag!}
        />
      ))}
    </div>
  );
};

export default Home;
