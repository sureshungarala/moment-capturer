import { McMoments } from '../info/types';

export type CategoryHomeState = {
  images: McMoments;
  fetchingImages: boolean;
  fetchingFailed: boolean;
  userSignedIn: boolean;
};

export type CategoryHomeAction = {
  type: CategoryHomeActions;
  images?: McMoments;
  userSignedIn?: boolean;
};

export enum CategoryHomeActions {
  FETCHING_IMAGES = 'FETCHING_IMAGES',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAILED = 'FETCH_FAILED',
}

export function CategoryHomeReducer(
  state: CategoryHomeState,
  action: CategoryHomeAction
): CategoryHomeState {
  const { type, images, userSignedIn = false } = action;
  switch (type) {
    case CategoryHomeActions.FETCHING_IMAGES:
      return {
        ...state,
        fetchingImages: true,
        fetchingFailed: false,
      };
    case CategoryHomeActions.FETCH_SUCCESS:
      return {
        ...state,
        images: images!,
        userSignedIn,
        fetchingImages: false,
        fetchingFailed: false,
      };
    case CategoryHomeActions.FETCH_FAILED:
      return {
        ...state,
        fetchingImages: false,
        fetchingFailed: true,
      };
    default:
      return state;
  }
}
