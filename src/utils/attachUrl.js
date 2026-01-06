const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function attachUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BASE_URL}/${path}`;
}
