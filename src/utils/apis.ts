import { Auth } from "@aws-amplify/auth";

export const fetchImages = async (categoryTag: string) => {
  const response = await fetch(
    `https://api.momentcapturer.com/getData?category=${categoryTag}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
  const images = await response.json();
  return images;
};

export const editImage = (idToken: string, body: string) =>
  fetch("https://api.momentcapturer.com/editImageMetadata", {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: idToken,
    },
    body,
  });

export const deleteImage = (idToken: string, body: string) =>
  fetch("https://api.momentcapturer.com/deleteImage", {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: idToken,
    },
    body,
  });

export const checkIfUserSignedIn = async () => {
  let isUserSignedIn = false;
  try {
    await Auth.currentAuthenticatedUser();
    isUserSignedIn = true;
  } catch (error) {
    isUserSignedIn = false;
  }
  return isUserSignedIn;
};

export const signOutUser = async () => {
  let userSignedOut = false;
  try {
    await Auth.signOut();
    userSignedOut = true;
  } catch (error) {
    userSignedOut = false;
  }
  return userSignedOut;
};

export const signIn = (userName: string, password: string) =>
  Auth.signIn(userName, password);

export const changePassword = (currentUser: Object, newPassword: string) =>
  Auth.completeNewPassword(currentUser, newPassword);
