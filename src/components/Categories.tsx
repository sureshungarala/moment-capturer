import React, { MouseEvent, KeyboardEvent, useState, useEffect } from "react";
import { getFirstCategory } from "../utils/helpers";
import categories from "../info/categories.json";

interface category {
  name: string;
  tag: string;
  submenu: Array<category>;
}

interface dropDownProps {
  onClickHandler: (event: MouseEvent | KeyboardEvent) => void;
}

const CategoriesDropDown: React.FunctionComponent<dropDownProps> = (
  props: dropDownProps
) => {
  const renderDropDown = (categories: Array<category>) => {
    return categories.map((category) => {
      return !category.submenu.length ? (
        <li
          custom-value={category.name}
          custom-tag={category.tag}
          key={category.name}
        >
          {category.name}
        </li>
      ) : (
        <li custom-value="" custom-tag="" key={category.name}>
          {category.name}
          <ul>{renderDropDown(category.submenu)}</ul>
        </li>
      );
    });
  };
  return (
    //separated <ul> here...to avoid duplicating onClickHandler on <ul> tags
    <ul onClick={props.onClickHandler}>{renderDropDown(categories)}</ul>
  );
};

interface categoriesState {
  categoryName: string;
  categoryTag: string;
  closeDropdown: boolean;
}

interface categoriesProps {
  onSelectCategory: (category: string, categoryTag: string) => void;
  routeCategoryTag?: string;
}

const Categories: React.FunctionComponent<categoriesProps> = (
  props: categoriesProps
) => {
  const firstCategory = getFirstCategory();
  let categoryName = firstCategory.name;
  let categoryTag = firstCategory.tag;

  const [state, setState] = useState<categoriesState>({
    //no conditional statements before useState or useEffect
    categoryName,
    categoryTag,
    closeDropdown: false,
  });

  useEffect(() => {
    if (state.closeDropdown) {
      setState({
        ...state,
        closeDropdown: !state.closeDropdown,
      });
      props.onSelectCategory &&
        props.onSelectCategory(state.categoryName, state.categoryTag);
    }
  }, [state.closeDropdown]);

  // placing this after all `useState` & `useEffect` usage
  if (
    typeof props.routeCategoryTag !== "undefined" &&
    props.routeCategoryTag.length
  ) {
    parentLoop: for (let ctgry of categories) {
      if (ctgry.tag.length) {
        if (ctgry.tag.toLowerCase() === props.routeCategoryTag.toLowerCase()) {
          categoryName = ctgry.name;
          categoryTag = ctgry.tag;
          break;
        }
      } else {
        for (let subCategory of ctgry.submenu) {
          if (
            subCategory.tag.toLowerCase() ===
            props.routeCategoryTag.toLowerCase()
          ) {
            categoryName = subCategory.name;
            categoryTag = subCategory.tag;
            break parentLoop;
          }
        }
      }
    }
  }

  const changeCategory = (event: MouseEvent | KeyboardEvent) => {
    const selectedCategory = (event.target as HTMLLIElement).getAttribute(
        "custom-value"
      ),
      seletedCategoryTag = (event.target as HTMLLIElement).getAttribute(
        "custom-tag"
      );
    selectedCategory &&
      selectedCategory.length &&
      selectedCategory !== state.categoryName &&
      setState({
        categoryName: "" + selectedCategory,
        categoryTag: "" + seletedCategoryTag,
        closeDropdown: true,
      });
  };

  return (
    <div className="categories">
      <span className="title">Category: </span>
      <div className="categories-dd">
        <div className="selectedCategory">{state.categoryName}</div>
        {!state.closeDropdown && (
          <CategoriesDropDown
            onClickHandler={(event) => changeCategory(event)}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;
