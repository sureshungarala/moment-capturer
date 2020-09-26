import { AnyAction } from "redux";

export interface Image {
  original: string;
  updateTime: number;
  srcSet: {
    [key: string]: string;
  };
  description: string;
  biotc: boolean;
  panorama: boolean;
  portrait: boolean;
  resolution: string;
}

export interface McMoments {
  biotc: Image;
  moments: Array<Image>;
}

export interface McAction extends AnyAction {
  category?: string;
  categoryTag?: string;
  images?: McMoments;
  userSignedIn?: boolean;
}

export interface McState {
  readonly category?: string;
  readonly categoryTag?: string;
  readonly images?: McMoments;
  readonly fetchingImages?: boolean;
  readonly fetchingFailed?: boolean;
  readonly userSignedIn?: boolean;
}

export interface ModalDimensions {
  width: number;
  height: number;
}

export interface Category {
  name: string;
  tag: string;
}
