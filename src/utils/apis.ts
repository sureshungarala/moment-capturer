export const fetchImages = async (categoryTag: string) => {
  const response = await fetch(
    `https://api.momentcapturer.com/getData?category=${categoryTag.toLowerCase()}`,
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
