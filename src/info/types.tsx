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
}

export interface McState {
  readonly category?: string;
  readonly categoryTag?: string;
  readonly images?: McMoments;
  readonly fetchingImages?: boolean;
  readonly fetchingFailed?: boolean;
}
