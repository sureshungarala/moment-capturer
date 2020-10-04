import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Auth } from "@aws-amplify/auth";

import { fetchImages } from "../../utils/apis";
import { Image, McMoments, McAction, McState } from "../../info/types";

export const SET_CATEGORY = "SET_CATEGORY";
export const SET_IMAGES = "SET_IMAGES";
export const ADD_IMAGES = "ADD_IMAGES";
export const FETCHING_IMAGES = "FETCHING_IMAGES";
export const FETCH_FAILED = "FETCH_FAILED";
export const SET_IF_USER_SIGNED_IN = "SET_IF_USER_SIGNED_IN";

export const initMoments: McMoments = {
  biotc: {
    original: "",
    updateTime: 0,
    srcSet: {},
    description: "",
    biotc: false,
    panorama: false,
    portrait: false,
    resolution: "",
  },
  moments: [],
};

export function setCategory(
  category: string,
  categoryTag: string
): ThunkAction<void, McState, {}, McAction> {
  return (dispatch: ThunkDispatch<McState, {}, McAction>) => {
    dispatch({
      type: SET_CATEGORY,
      category,
      categoryTag,
    });
  };
}

export function getImages(
  categoryTag: string
): ThunkAction<Promise<void>, McState, {}, McAction> {
  return async (
    dispatch: ThunkDispatch<McState, {}, McAction>
  ): Promise<void> => {
    dispatch({
      type: FETCHING_IMAGES,
    });
    try {
      const data = await fetchImages(categoryTag);
      const images: McMoments = JSON.parse(JSON.stringify(initMoments));
      (data.images as Image[]).forEach((image: Image) => {
        if (image.biotc) {
          images.biotc = image;
        } else {
          images.moments.push(image);
        }
      });
      dispatch({
        type: SET_IMAGES,
        images,
      });
    } catch (err) {
      dispatch({
        type: FETCH_FAILED,
      });
    }
  };
}

export function checkIfUserSignedIn(): ThunkAction<
  Promise<void>,
  McState,
  {},
  McAction
> {
  return async (
    dispatch: ThunkDispatch<McState, {}, McAction>
  ): Promise<void> => {
    try {
      await Auth.currentAuthenticatedUser();
      dispatch({
        type: SET_IF_USER_SIGNED_IN,
        userSignedIn: true,
      });
    } catch (error) {
      dispatch({
        type: SET_IF_USER_SIGNED_IN,
        userSignedIn: false,
      });
    }
  };
}

export function signOutUser(): ThunkAction<
  Promise<void>,
  McState,
  {},
  McAction
> {
  return async (
    dispatch: ThunkDispatch<McState, {}, McAction>,
    getState: () => McState
  ): Promise<void> => {
    try {
      await Auth.signOut();
      dispatch({
        type: SET_IF_USER_SIGNED_IN,
        userSignedIn: false,
      });
    } catch (error) {
      dispatch({
        type: SET_IF_USER_SIGNED_IN,
        userSignedIn: getState().userSignedIn,
      });
    }
  };
}
