import { AuthClass } from '@aws-amplify/auth/lib-esm/Auth';

export const fetchBestImagePerCategory = async (categoryTag: String) =>
  fetch(
    `https://api.momentcapturer.com/getBestImagePerCategory?category=${categoryTag}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

export const fetchImages = async (categoryTag: string) => {
  const response = await fetch(
    `https://api.momentcapturer.com/getData?category=${categoryTag}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  );
  const images = await response.json();
  return images;
};

export const editImage = (idToken: string, body: string) =>
  fetch('https://api.momentcapturer.com/editImageMetadata', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: idToken,
    },
    body,
  });

export const deleteImage = (idToken: string, body: string) =>
  fetch('https://api.momentcapturer.com/deleteImage', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: idToken,
    },
    body,
  });

export const checkIfUserSignedIn = async (Auth: AuthClass) => {
  let isUserSignedIn = false;
  try {
    await Auth.currentAuthenticatedUser();
    isUserSignedIn = true;
  } catch (error) {
    isUserSignedIn = false;
  }
  return isUserSignedIn;
};

export const signOutUser = async (Auth: AuthClass) => {
  let userSignedOut = false;
  try {
    await Auth.signOut();
    userSignedOut = true;
  } catch (error) {
    userSignedOut = false;
  }
  return userSignedOut;
};

export const signIn = (Auth: AuthClass, userName: string, password: string) =>
  Auth.signIn(userName, password);

export const changePassword = (
  Auth: AuthClass,
  currentUser: Object,
  newPassword: string
) => Auth.completeNewPassword(currentUser, newPassword);
