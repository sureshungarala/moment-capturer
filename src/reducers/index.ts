import { Image, McAction, SET_CATEGORY, SET_IMAGES, ADD_IMAGES, FETCHING_IMAGES, FETCH_FAILED } from '../actions';
import categories from '../info/categories.json';

export interface McState {
    readonly category?: string,
    readonly images?: Array<Image>,
    readonly fetchingImages?: boolean,
    readonly fetchingFailed?: boolean
}

export const initState: McState = {
    category: categories[0].name,
    images: [],
    fetchingImages: false,
    fetchingFailed: false
}

export function reducer(state: McState = initState, action: McAction): McState {
    switch (action.type) {
        case SET_CATEGORY:
            return {
                ...state,
                category: action.category
            }
        case SET_IMAGES:
            return {
                ...state,
                images: action.images
            }
        case ADD_IMAGES:
            return {
                ...state,
                fetchingImages: false,
                fetchingFailed: false,
                images: state.images && action.images ?
                    [...state.images, ...action.images] :
                    action.images ? action.images : state.images
            }
        case FETCHING_IMAGES:
            return {
                ...state,
                fetchingImages: true,
                fetchingFailed: false
            }
        case FETCH_FAILED:
            return {
                ...state,
                fetchingImages: false,
                fetchingFailed: true
            }
        default:
            return state;
    }
}

export default reducer;