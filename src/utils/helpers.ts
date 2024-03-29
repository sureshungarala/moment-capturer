import { Image, ModalDimensions, Category, McMoments } from '../info/types';
import { signIncustomEventName, initMoments } from './constants';
import categories from '../info/categories.json';

/**
 * represents max size of the upload image
 */
export const MAX_IMAGE_SIZE_IN_MB = 4.3;

/**
 * Re-Orders and distributes images evenly on screen
 * @param moments Image[]
 * @returns McMoments
 */
export function reOrderImages(moments: Image[]) {
  const images: McMoments = JSON.parse(JSON.stringify(initMoments));
  const carry: { portraits: Image[]; landscapes: Image[] } = {
    portraits: [],
    landscapes: [],
  };
  (moments as Image[]).forEach((image: Image) => {
    if (image.biotc) {
      images.biotc = image;
    } else if (image.panorama) {
      images.moments.push(image);
    } else if (image.portrait) {
      carry.portraits.push(image);
      if (carry.portraits.length === 3) {
        images.moments.push(...carry.portraits);
        carry.portraits = [];
      }
    } else {
      carry.landscapes.push(image);
      if (carry.landscapes.length === 2) {
        images.moments.push(...carry.landscapes);
        carry.landscapes = [];
      }
    }
  });
  if (carry.portraits.length) {
    images.moments.push(...carry.portraits);
  }
  if (carry.landscapes.length) {
    images.moments.push(...carry.landscapes);
  }
  return images;
}

/**
 * determines dimensions of the modal w.r.to clicked image and device
 * @param image
 */
export function getModalDimensions(image: Image): ModalDimensions {
  const deviceWidth = window.innerWidth - 20;
  const deviceHeight = window.innerHeight - 20;
  const deviceAspectRatio = deviceWidth / deviceHeight;
  const [imageWidth, imageHeight] = image.resolution.split(':').map(Number);
  const aspectRatio = imageWidth / imageHeight;
  let width: number = deviceWidth;
  let height: number = deviceHeight;

  if (image.portrait) {
    height = height > imageHeight ? imageHeight : height;
    width = height * aspectRatio;
    if (width > deviceWidth) {
      width = deviceWidth;
      height = width / aspectRatio;
      if (height > deviceHeight) {
        height = width / deviceAspectRatio;
      }
    }
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
 * @returns first category from categories
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

/**
 * @returns category by categoryTag
 * @param categoryTag
 */
export function getMappedCategory(
  categoryTag: string,
  categoriesArr: Category[] = categories
): Category {
  let mappedcategory = getFirstCategory();
  for (const category of categoriesArr) {
    let tempCategory = mappedcategory;
    if (category.tag.toLowerCase() === categoryTag.trim().toLowerCase()) {
      tempCategory = category;
    } else if (category.submenu?.length) {
      tempCategory = getMappedCategory(categoryTag, category.submenu);
    }
    if (tempCategory.tag !== mappedcategory.tag) {
      return tempCategory;
    }
  }
  return mappedcategory;
}

/**
 * @param categoriesArr
 * @returns all category tags
 */
export function getAllCategories(categoriesArr?: Category[]) {
  let allCategories: Category[] = [];

  for (const category of categoriesArr || categories) {
    if (category.tag.length) {
      allCategories.push({
        tag: category.tag,
        name: category.name,
      });
    } else {
      allCategories = allCategories.concat(getAllCategories(category.submenu));
    }
  }
  return allCategories;
}

/**
 * Dispatches "User Signed-in event"
 */
export function dispachSignedInEvent() {
  document.dispatchEvent(
    new CustomEvent(signIncustomEventName, { detail: true })
  );
}
