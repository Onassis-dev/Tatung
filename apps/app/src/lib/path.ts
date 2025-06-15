import { atom } from "nanostores";
export const currentPath = atom(
  typeof window !== "undefined" ? window.location.pathname : ""
);

if (typeof window !== "undefined") {
  document.addEventListener("astro:page-load", () => {
    currentPath.set(window.location.pathname);
  });
}
