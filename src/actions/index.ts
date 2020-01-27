import { AnyAction } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { McState } from '../reducers';

export interface Image {
    original: string,
    updateTime: number,
    srcSet: {
        [key: string]: string
    },
    description: string
}

export interface McAction extends AnyAction {
    category?: string,
    categoryTag?: string,
    images?: Array<Image>
}

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_IMAGES = 'SET_IMAGES';
export const ADD_IMAGES = 'ADD_IMAGES';
export const FETCHING_IMAGES = 'FETCHING_IMAGES';
export const FETCH_FAILED = 'FETCH_FAILED';

export function setCategory(category: string, categoryTag: string): McAction {
    return {
        type: SET_CATEGORY,
        category,
        categoryTag
    }
}

export function getImages(category: string, actionType: string): ThunkAction<Promise<void>, McState, {}, McAction> {
    return async (dispatch: ThunkDispatch<McState, {}, McAction>): Promise<void> => {
        dispatch({
            type: FETCHING_IMAGES
        })
        try {
            const response = await fetch(`https://api.momentcapturer.com/getData?category=${category.toLowerCase()}`, {
                headers: {
                    'accept': 'application/json'
                }
            });
            const data = await response.json();
            dispatch({
                type: actionType,
                images: data.images
            })
        } catch (err) {
            dispatch({
                type: FETCH_FAILED
            })
        }
    }
}

export function setImages(category: string, images: Array<Image>): McAction {
    return {
        type: SET_IMAGES,
        images
    }
}

export function addImages(images: Array<Image>): McAction {
    return {
        type: ADD_IMAGES,
        images
    }
}