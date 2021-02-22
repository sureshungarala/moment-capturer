import React, {
  MouseEvent,
  KeyboardEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { getFirstCategory, getMappedCategory } from "../../utils/helpers";
import { Category } from "../../info/types";
import categories from "../../info/categories.json";

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
          role="option"
        >
          {category.name}
        </li>
      ) : (
        <li
          custom-value=""
          custom-tag=""
          key={category.name}
          role="option"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {category.name}
          <ul role="listbox">{renderDropDown(category.submenu)}</ul>
        </li>
      );
    });
  };
  return (
    //separated <ul> here...to avoid duplicating onClickHandler on <ul> tags
    <ul onClick={props.onClickHandler} role="listbox">
      {renderDropDown(categories)}
    </ul>
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
  let stopFocusUseEffect = false;

  const [state, setState] = useState<categoriesState>({
    //no conditional statements before useState or useEffect
    categoryName,
    categoryTag,
    closeDropdown: false,
  });
  const [isFocussed, setIfFocussed] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(isFocussed);
  const listItemsRef = useRef(
    categoriesRef.current?.querySelectorAll("ul > li") as
      | NodeListOf<HTMLLIElement>
      | undefined
  );
  let focussedElem: HTMLLIElement | null | undefined = null;

  /* --------------------------- Event handlers start(a11y) ------------------------------ */
  const focus = () => {
    listItemsRef.current?.forEach((li) => {
      li.classList.remove("active", "focus");
      li.setAttribute("aria-expanded", "false");
    });
    focussedElem?.classList.add("active");
    const childUl = focussedElem?.querySelector("ul");
    if (childUl) {
      focussedElem?.setAttribute("aria-expanded", "true");
    }
    const parentListItem = focussedElem?.parentElement?.parentElement;
    if (parentListItem?.tagName.toLowerCase() === "li") {
      parentListItem.setAttribute("aria-expanded", "true");
      parentListItem.classList.add("focus");
    }
  };

  const updateFocus = (focussed: boolean) => {
    focusRef.current = focussed;
    setIfFocussed(focussed);
  };

  const onSelectedCategoryFocus = () => {
    updateFocus(true);
  };

  const clickHandler = () => {};

  const mouseoverHandler = (elem: HTMLLIElement) => {
    focussedElem = elem;
    focus();
  };

  const keyupHandler = (event: any) => {
    event.preventDefault();
    const { key } = event;
    if (focusRef.current) {
      if (key === "ArrowDown") {
        const tempElem = focussedElem?.nextElementSibling as HTMLLIElement;
        if (!tempElem) {
          const parentElement = focussedElem?.parentElement?.parentElement;
          if (parentElement?.tagName.toLowerCase() === "li") {
            focussedElem = parentElement.querySelector(
              "ul > li:first-child"
            ) as HTMLLIElement;
          } else {
            focussedElem = listItemsRef.current![0];
          }
        } else {
          focussedElem = tempElem;
        }
        focus();
      } else if (key === "ArrowUp") {
        const tempElem = focussedElem?.previousElementSibling as HTMLLIElement;
        if (!tempElem) {
          const parentElement = focussedElem?.parentElement?.parentElement;
          if (parentElement?.tagName.toLowerCase() === "li") {
            focussedElem = parentElement.querySelector(
              "ul > li:last-child"
            ) as HTMLLIElement;
          } else {
            focussedElem = listItemsRef.current![
              listItemsRef.current?.length! - 1
            ];
          }
        } else {
          focussedElem = tempElem;
        }
        focus();
      } else if (key === "ArrowRight") {
        const tempElem = focussedElem?.querySelector("ul > li");
        if (tempElem) {
          focussedElem = tempElem as HTMLLIElement;
          focus();
        }
      } else if (key === "ArrowLeft") {
        const tempElem = focussedElem?.parentElement?.parentElement;
        if (tempElem?.tagName.toLowerCase() === "li") {
          focussedElem = tempElem as HTMLLIElement;
          focus();
        }
      } else if (key === "Escape") {
        updateFocus(false);
      }
    }
  };
  /* --------------------------- Event handlers end ------------------------------ */

  useEffect(() => {
    const categoriesElem = categoriesRef.current as HTMLDivElement;

    categoriesElem?.addEventListener("focus", onSelectedCategoryFocus);
    categoriesElem?.addEventListener("mouseover", onSelectedCategoryFocus);
    categoriesElem?.addEventListener("keyup", keyupHandler);

    return () => {
      categoriesElem?.removeEventListener("focus", onSelectedCategoryFocus);
      categoriesElem?.removeEventListener("mouseover", onSelectedCategoryFocus);
      categoriesElem.removeEventListener("keyup", keyupHandler);
    };
  }, []);

  useEffect(() => {
    if (isFocussed && !stopFocusUseEffect) {
      stopFocusUseEffect = true;
      listItemsRef.current = categoriesRef.current?.querySelectorAll("ul > li");
      listItemsRef.current?.forEach((elem: HTMLLIElement) => {
        elem.addEventListener("mouseover", () => mouseoverHandler(elem));
        elem.addEventListener("click", clickHandler);
      });
    }
  }, [isFocussed]);

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
      <div className="categories-dd" ref={categoriesRef} tabIndex={0}>
        <div
          className="selectedCategory"
          aria-label="Selected category"
          role="option"
          aria-haspopup="listbox"
        >
          {state.categoryName}
        </div>
        {isFocussed && (
          <CategoriesDropDown
            onClickHandler={(event) => changeCategory(event)}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;
