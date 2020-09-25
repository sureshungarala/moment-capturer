import { Image, ModalDimensions, Category } from "../info/types";
import categories from "../info/categories.json";

/**
 * represents max size of the upload image
 */
export const MAX_IMAGE_SIZE_IN_MB = 4.3;

/**
 * determines dimensions of the modal w.r.to clicked image and device
 * @param image
 */
export function getModalDimensions(image: Image): ModalDimensions {
  const deviceWidth = window.innerWidth - 20;
  const deviceHeight = window.innerHeight - 20;
  const deviceAspectRatio = deviceWidth / deviceHeight;
  const [imageWidth, imageHeight] = image.resolution.split(":").map(Number);
  const aspectRatio = imageWidth / imageHeight;

  let width: number = deviceWidth;
  let height: number = deviceHeight;

  if (image.portrait) {
    height = height > imageHeight ? imageHeight : height;
    width = height * aspectRatio;
  } else {
    width = width > imageWidth ? imageWidth : width;
    height = width / aspectRatio;
    if (height > deviceHeight) {
      height = deviceHeight;
      width = height * aspectRatio;
      if (width > deviceWidth) {
        // just in case, if it goes beyond device width :)
        width = height * deviceAspectRatio;
      }
    }
  }
  return {
    width,
    height,
  };
}

/**
 * returns first category from categories
 */
export function getFirstCategory(): Category {
  const categoryName = categories[0].tag.length
    ? categories[0].name
    : categories[0].submenu[0].name;
  const categoryTag = categories[0].tag.length
    ? categories[0].tag
    : categories[0].submenu[0].tag;

  return {
    name: categoryName,
    tag: categoryTag,
  };
}
