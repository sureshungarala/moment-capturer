import React, { MouseEvent, KeyboardEvent, useState, useEffect } from "react";
import { getFirstCategory, getMappedCategory } from "../utils/helpers";
import { Category } from "../info/types";
import categories from "../info/categories.json";

interface dropDownProps {
  onClickHandler: (event: MouseEvent | KeyboardEvent) => void;
}

const CategoriesDropDown: React.FunctionComponent<dropDownProps> = (
  props: dropDownProps
) => {
  const renderDropDown = (categories: Array<Category>) => {
    return categories.map((category) => {
      return !category.submenu?.length ? (
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
  onSelectCategory: (categoryTag: string) => void;
  routeCategoryTag?: string;
}

const Categories: React.FunctionComponent<categoriesProps> = (
  props: categoriesProps
) => {
  const category = props.routeCategoryTag
    ? getMappedCategory(props.routeCategoryTag)
    : getFirstCategory();
  let categoryName = category.name;
  let categoryTag = category.tag;

  const [state, setState] = useState<categoriesState>({
    //no conditional statements before useState or useEffect
    categoryName,
    categoryTag,
    closeDropdown: false,
  });

  useEffect(() => {
    if (props.routeCategoryTag !== state.categoryTag) {
      const { name, tag } = category;
      setState({
        categoryName: name,
        categoryTag: tag,
        closeDropdown: false,
      });
    }
  }, [props.routeCategoryTag]);

  useEffect(() => {
    if (state.closeDropdown) {
      setState({
        ...state,
        closeDropdown: !state.closeDropdown,
      });
      props.onSelectCategory && props.onSelectCategory(state.categoryTag);
    }
  }, [state.closeDropdown]);

  const changeCategory = (event: MouseEvent | KeyboardEvent) => {
    const selectedCategory = (event.target as HTMLLIElement).getAttribute(
        "custom-value"
      ),
      seletedCategoryTag = (event.target as HTMLLIElement).getAttribute(
        "custom-tag"
      );

    selectedCategory?.length &&
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
