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
