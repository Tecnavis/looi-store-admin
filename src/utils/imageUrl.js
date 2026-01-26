import { BASE_URL } from "../config/axiosconfig";

export const getImageUrl = (image) => {
  if (!image) return "";

  // Already a full URL (Cloudinary, CDN, etc.)
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }

  // If backend still returns only filename/path, fallback to API host
  const clean = String(image).replace(/^\//, "");
  return `${BASE_URL}/${clean}`;
};
