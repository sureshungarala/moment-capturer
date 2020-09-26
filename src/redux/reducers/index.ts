import {
  initMoments,
  SET_CATEGORY,
  SET_IMAGES,
  ADD_IMAGES,
  FETCHING_IMAGES,
  FETCH_FAILED,
  SET_IF_USER_SIGNED_IN,
} from "../actions";
import { McAction, McState } from "../../info/types";
import { getFirstCategory } from "../../utils/helpers";

const firstCategory = getFirstCategory();

export const initState: McState = {
  category: firstCategory.name,
  categoryTag: firstCategory.tag,
  images: initMoments,
  fetchingImages: false,
  fetchingFailed: false,
  userSignedIn: false,
};

export function reducer(state: McState = initState, action: McAction): McState {
  switch (action.type) {
    case SET_CATEGORY:
      return {
        ...state,
        category: action.category,
        categoryTag: action.categoryTag,
      };
    case SET_IMAGES:
      return {
        ...state,
        fetchingImages: false,
        images: action.images,
      };
    case ADD_IMAGES:
      return {
        ...state,
        fetchingImages: false,
        fetchingFailed: false,
        images:
          state.images && action.images
            ? {
                biotc: state.images.biotc,
                moments: [...state.images.moments, ...action.images.moments],
              }
            : action.images
            ? action.images
            : state.images,
      };
    case FETCHING_IMAGES:
      return {
        ...state,
        fetchingImages: true,
        fetchingFailed: false,
      };
    case FETCH_FAILED:
      return {
        ...state,
        fetchingImages: false,
        fetchingFailed: true,
      };
    case SET_IF_USER_SIGNED_IN:
      return {
        ...state,
        userSignedIn: action.userSignedIn,
      };
    default:
      return state;
  }
}

export default reducer;
