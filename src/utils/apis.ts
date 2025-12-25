import {
  getCurrentUser,
  signOut,
  signIn,
  confirmSignIn,
  SignInInput,
} from 'aws-amplify/auth';

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

/**
 * Gets a pre-signed URL for direct S3 upload
 */
export const getUploadUrl = async (
  idToken: string,
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; objectKey: string }> => {
  const response = await fetch('https://api.momentcapturer.com/getUploadUrl', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: idToken,
    },
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }
  return response.json();
};

/**
 * Uploads file directly to S3 using pre-signed URL
 */
export const uploadToS3 = async (
  uploadUrl: string,
  file: File
): Promise<boolean> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  return response.ok;
};

/**
 * Triggers image processing after S3 upload
 */
export const processUpload = (idToken: string, body: string) =>
  fetch('https://api.momentcapturer.com/processUpload', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: idToken,
    },
    body,
  });

export const checkIfUserSignedIn = async () => {
  let isUserSignedIn = false;
  try {
    await getCurrentUser();
    isUserSignedIn = true;
  } catch (error) {
    isUserSignedIn = false;
  }
  return isUserSignedIn;
};

export const signOutUser = async () => {
  let userSignedOut = false;
  try {
    await signOut();
    userSignedOut = true;
  } catch (error) {
    userSignedOut = false;
  }
  return userSignedOut;
};

export const signInUser = (username: string, password: string) =>
  signIn({ username, password });

export const changePassword = (
  currentUser: Object, // kept for compatibility but not used in v6 confirmSignIn directly if flow is simple, but we might need it if the logic implies something else. Actually confirmSignIn just takes input.
  newPassword: string
) => confirmSignIn({ challengeResponse: newPassword });
