const filenames = [
  "7B7A5534.JPG", "7B7A5750.JPG", "7B7A5828.JPG", "7B7A5829.JPG", "7B7A5830.JPG",
  "7B7A5952.JPG", "7B7A5972.JPG", "7B7A5993.JPG", "7B7A6004.JPG", "7B7A6034.JPG",
  "7B7A6154.JPG", "7B7A6161.JPG", "7B7A6172.JPG", "7B7A6194.JPG", "7B7A6199.JPG",
  "7B7A6200.JPG", "7B7A6213.JPG", "7B7A6245.JPG", "7B7A6269.JPG", "7B7A6270.JPG",
  "7B7A6273.JPG", "7B7A6278.JPG", "7B7A6289.JPG", "7B7A6300.JPG", "IMG_6529.JPG",
  "IMG_6565.JPG", "IMG_6580.JPG",
];

const specificAlt: Record<string, string> = {
  "7B7A5972.JPG": "A DJ playing to a crowd at the Ek Saal gathering",
  "7B7A6161.JPG": "The crowd in a red-lit room at the Ek Saal gathering",
  "IMG_6529.JPG": "Two DJs behind the decks at the Ek Saal gathering",
};

export const ekSaalPhotos = filenames.map((filename) => ({
  src: `/media/photo%20gallery/ek-saal/${filename}`,
  alt: specificAlt[filename] ?? "Ek Saal event photograph",
}));

export const selectedHomePhotos = [
  ekSaalPhotos.find((photo) => photo.src.endsWith("7B7A5972.JPG"))!,
  ekSaalPhotos.find((photo) => photo.src.endsWith("7B7A6161.JPG"))!,
  ekSaalPhotos.find((photo) => photo.src.endsWith("IMG_6529.JPG"))!,
];
