import React, { useEffect, useRef, useState } from "react";

import CategoryCard from "./Utils/CategoryCard";
import PageTransition from "./Utils/PageTransition";

import { fetchBestImagePerCategory } from "../utils/apis";
import { getAllCategories } from "../utils/helpers";
import { CardImage, Category } from "../info/types";
import "../styles/templates/home.scss";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => {
  const categories: Category[] = getAllCategories();
  const [cards, setCards] = useState<Array<CardImage>>(
    categories.map((category: Category) => ({
      category: category.name,
      tag: category.tag,
      src: "",
      fetching: true,
    }))
  );
  const cardsRef = useRef<CardImage[]>([...cards]);

  const updateCategoryCard = (index: number, image: CardImage | undefined) => {
    const cardsToUpdate = [...cardsRef.current];
    cardsToUpdate[index]["src"] = image ? image.src : "";
    cardsToUpdate[index]["fetching"] = false;
    cardsRef.current = cardsToUpdate;
    setCards(cardsToUpdate);
  };

  useEffect(() => {
    categories.forEach((category, index) => {
      fetchBestImagePerCategory(category.tag)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              const { images }: { images: CardImage | undefined } = data;
              updateCategoryCard(index, images);
            });
          } else {
            updateCategoryCard(index, undefined);
          }
        })
        .catch(() => {
          updateCategoryCard(index, undefined);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTransition>
      <div className="home">
        {cards.map((card) => (
          <CategoryCard
            key={card.tag}
            src={card.src}
            altText={card.category}
            title={card.category}
            categoryTag={card.tag!}
            fetching={card.fetching!}
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default Home;
