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

export interface ModalDimensions {
  width: number;
  height: number;
}

export interface Category {
  name: string;
  tag: string;
  submenu?: Category[];
}

export interface CardImage {
  category: string;
  tag?: string;
  biotc?: boolean;
  srcSet: {
    [key: string]: string;
  };
}
