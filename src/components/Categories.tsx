import React, { useState, useEffect } from 'react';
import categories from '../info/categories.json';


interface category {
    name: string,
    submenu: Array<category>
}

interface dropDownProps {
    onClickHandler: (event: React.MouseEvent | React.KeyboardEvent) => void
}

const CategoriesDropDown: React.FunctionComponent<dropDownProps> = (props: dropDownProps) => {

    const renderDropDown = (categories: Array<category>) => {
        return (
            categories.map((category) => {
                return !category.submenu.length ?
                    <li custom-value={category.name} key={category.name}>{category.name}</li> :
                    <li custom-value="" key={category.name}>{category.name}
                        <ul>
                            {
                                renderDropDown(category.submenu)
                            }
                        </ul>
                    </li>
            })
        )
    }
    return (
        //separated <ul> here...to avoid duplicating onClickHandler on <ul> tags
        <ul onClick={props.onClickHandler}>
            {
                renderDropDown(categories)
            }
        </ul>
    );
}

interface categoriesState {
    category: string,
    closeDropdown: boolean
}

interface categoriesProps {
    onSelectCategory: (category: string) => void
}

const Categories: React.FunctionComponent<categoriesProps> = (props: categoriesProps) => {

    const [state, setState] = useState<categoriesState>({ category: categories[0].name, closeDropdown: false });  //observe router later for category

    useEffect(() => {
        if (state.closeDropdown) {
            setState({
                ...state, closeDropdown: !state.closeDropdown
            });
            props.onSelectCategory && props.onSelectCategory(state.category);
        }
    }, [state.closeDropdown]);

    const changeCategory = (event: React.MouseEvent | React.KeyboardEvent) => {
        const selectedCategory = (event.target as HTMLLIElement).getAttribute('custom-value');
        console.log(selectedCategory);
        selectedCategory && selectedCategory.length && selectedCategory !== state.category &&
            setState({
                category: '' + selectedCategory,
                closeDropdown: true
            });
    }

    return (
        <div className="categories">
            <span className="title">Category: </span>
            <div className="categories-dd">
                <div className="selectedCategory">
                    {state.category}
                </div>
                {
                    !state.closeDropdown &&
                    <CategoriesDropDown onClickHandler={changeCategory} />
                }
            </div>
        </div>
    );
}

export default Categories;