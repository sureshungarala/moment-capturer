import React, { useState, useEffect } from 'react';

interface categoryState {
    category: string,
    closeDropdown: boolean
}

const Categories: React.FunctionComponent = () => {

    const [state, setState] = useState<categoryState>({ category: "Abstract", closeDropdown: false });  //observe router later for category

    useEffect(() => {
        if (state.closeDropdown) {
            setState({
                ...state, closeDropdown: !state.closeDropdown
            })
        }
    }, [state.closeDropdown]);

    const changeCategory = (event: React.MouseEvent | React.KeyboardEvent) => {
        const selectedCategory = (event.target as HTMLLIElement).getAttribute('custom-value');
        console.log(selectedCategory);
        selectedCategory && selectedCategory.length && setState({
            category: '' + selectedCategory,
            closeDropdown: true
        });
    }

    return (
        <div className="categories">
            <span className="title">Categories: </span>
            <div className="categories-dd">
                <div className="selectedCategory">
                    {state.category}
                </div>
                {
                    !state.closeDropdown &&
                    <ul onClick={changeCategory}>
                        <li custom-value="Travel">Travel</li>
                        <li custom-value="Abstract">Abstract</li>
                        <li custom-value="">Wild life
                            <ul>
                                <li custom-value="Country">Country</li>
                                <li custom-value="Safari">Safari</li>
                            </ul>
                        </li>
                        <li custom-value="Fashion">Fashion</li>
                    </ul>
                }
            </div>
        </div>
    );
}

export default Categories;