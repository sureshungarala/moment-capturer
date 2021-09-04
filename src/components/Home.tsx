import React, { useEffect, useRef, useState } from "react";

import CategoryCard from "./Utils/CategoryCard";
import Loader from "./Utils/Loader";

import { fetchBestImagePerCategory } from "../utils/apis";
import { getAllCategories } from "../utils/helpers";
import { CardImage, Category } from "../info/types";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => {
  const categoryCards = useRef<CardImage[]>([]);
  const [cards, setCards] = useState<CardImage[]>([]);
  const [fetchingImages, isFetchingImages] = useState(true);

  const createCategoryCardData = (
    category: Category,
    image: CardImage | undefined,
    index: number
  ) => {
    let categoryData = null;
    if (image) {
      categoryData = {
        category: category.name,
        tag: category.tag,
        src: image.src,
      };
    } else {
      categoryData = {
        category: category.name,
        tag: category.tag,
        src: "",
      };
    }
    categoryCards.current = [
      ...categoryCards.current,
      { ...categoryData, index },
    ].sort((a, b) => a?.index - b?.index);
    setCards(categoryCards.current);
  };

  useEffect(() => {
    const allCategories = getAllCategories();
    allCategories.forEach((category, index) => {
      fetchBestImagePerCategory(category.tag)
        .then((response) => {
          fetchingImages && isFetchingImages(false);
          if (response.ok) {
            response.json().then((data) => {
              const { images }: { images: CardImage | undefined } = data;
              createCategoryCardData(category, images, index);
            });
          } else {
            createCategoryCardData(category, undefined, index);
          }
        })
        .catch(() => {
          fetchingImages && isFetchingImages(false);
          createCategoryCardData(category, undefined, index);
        });
    });
  }, []);

  return (
    <div className="home">
      {fetchingImages && <Loader />}
      {!fetchingImages &&
        cards.map((card) => (
          <CategoryCard
            key={card.tag}
            src={card.src}
            altText={card.category}
            title={card.category}
            categoryTag={card.tag!}
          />
        ))}
    </div>
  );
};

export default Home;
