import { AnyAction } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { McState } from '../reducers';

export interface Image {
    original: string,
    updateTime: number,
    srcSet: {
        [key: string]: string
    },
    description: string,
    biotc: boolean,
    panorama: boolean,
    portrait: boolean,
    resolution: string
}

export interface McMoments {
    biotc: Image,
    moments: Array<Image>
}

export interface McAction extends AnyAction {
    category?: string,
    categoryTag?: string,
    images?: McMoments
}

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_IMAGES = 'SET_IMAGES';
export const ADD_IMAGES = 'ADD_IMAGES';
export const FETCHING_IMAGES = 'FETCHING_IMAGES';
export const FETCH_FAILED = 'FETCH_FAILED';

export const initMoments: McMoments = {
    biotc: {
        original: '',
        updateTime: 0,
        srcSet: {},
        description: '',
        biotc: false,
        panorama: false,
        portrait: false,
        resolution: ''
    },
    moments: []
};

export function setCategory(category: string, categoryTag: string): ThunkAction<void, McState, {}, McAction> {
    return (dispatch: ThunkDispatch<McState, {}, McAction>) => {
        dispatch({
            type: SET_CATEGORY,
            category,
            categoryTag
        });
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
            const data = await response.json(), images: McMoments = JSON.parse(JSON.stringify(initMoments));
            (data.images as Image[]).forEach((image: Image) => {
                if (image.biotc) {
                    images.biotc = image;
                } else {
                    images.moments.push(image);
                }
            });
            dispatch({
                type: actionType,
                images
            })
        } catch (err) {
            dispatch({
                type: FETCH_FAILED
            })
        }
    }
}

export function setImages(category: string, images: McMoments): McAction {
    return {
        type: SET_IMAGES,
        images
    }
}

export function addImages(images: McMoments): McAction {
    return {
        type: ADD_IMAGES,
        images
    }
}