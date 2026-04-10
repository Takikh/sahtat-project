import { useEffect } from "react";

type SeoInput = {
  title: string;
  description?: string | null;
  canonicalPath?: string;
  image?: string | null;
  type?: "website" | "article";
};

function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector(`meta[name=\"${name}\"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector(`meta[property=\"${property}\"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let el = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function useSeo({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
}: SeoInput) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = title;

    if (description) {
      upsertMetaByName("description", description);
      upsertMetaByName("twitter:description", description);
      upsertMetaByProperty("og:description", description);
    }

    upsertMetaByName("twitter:title", title);
    upsertMetaByProperty("og:title", title);
    upsertMetaByProperty("og:type", type);

    const origin = window.location.origin;
    const canonicalUrl = canonicalPath ? `${origin}${canonicalPath}` : window.location.href;
    upsertCanonical(canonicalUrl);
    upsertMetaByProperty("og:url", canonicalUrl);

    if (image) {
      upsertMetaByProperty("og:image", image);
      upsertMetaByName("twitter:image", image);
    }
  }, [title, description, canonicalPath, image, type]);
}
