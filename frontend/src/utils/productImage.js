const assetModules = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  import: "default",
});

const normalizeKey = (value) => value.replace(/\\/g, "/").toLowerCase();

const assetsByFileName = Object.entries(assetModules).reduce((assets, [path, url]) => {
  const normalizedPath = normalizeKey(path);
  const fileName = normalizedPath.split("/").pop();

  assets.set(fileName, url);
  assets.set(normalizedPath.replace("../assets/", ""), url);

  return assets;
}, new Map());

const getImagePath = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  try {
    return new URL(image, window.location.origin).pathname;
  } catch {
    return image;
  }
};

export const resolveProductImage = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }

  if (image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  const imagePath = decodeURIComponent(getImagePath(image)).replace(/^\/+/, "");
  const normalizedPath = normalizeKey(imagePath);
  const fileName = normalizedPath.split("/").pop();

  return (
    assetsByFileName.get(normalizedPath) ||
    assetsByFileName.get(normalizedPath.replace(/^storage\//, "")) ||
    assetsByFileName.get(normalizedPath.replace(/^storage\/products\//, "")) ||
    assetsByFileName.get(normalizedPath.replace(/^products\//, "")) ||
    assetsByFileName.get(fileName) ||
    image
  );
};
