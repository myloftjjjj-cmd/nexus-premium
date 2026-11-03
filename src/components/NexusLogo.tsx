import { useEffect } from "react";
import nexusLogo from "@/assets/1793693791541.jpg";

interface NexusLogoProps {
  size?: number;
  rounded?: boolean;
  className?: string;
}

/** Sets the browser tab, Apple home-screen, and installable-app (PWA) icon to the Nexus logo. */
export function useNexusFavicon() {
  useEffect(() => {
    const iconUrl = new URL(nexusLogo, window.location.origin).href;

    const setLink = (rel: string, href: string, type?: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      if (type) link.type = type;
    };

    setLink("icon", iconUrl, "image/jpeg");
    setLink("apple-touch-icon", iconUrl);

    const manifest = {
      name: "Nexus-premium",
      short_name: "Nexus",
      description: "Nexus-premium, powered by the Nexus AI assistant",
      start_url: window.location.pathname,
      display: "standalone",
      background_color: "#070B1F",
      theme_color: "#070B1F",
      icons: [
        { src: iconUrl, sizes: "512x512", type: "image/jpeg", purpose: "any maskable" },
      ],
    };
    const manifestUrl = URL.createObjectURL(
      new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }),
    );
    setLink("manifest", manifestUrl);

    document.title = "Nexus-premium";
    return () => URL.revokeObjectURL(manifestUrl);
  }, []);
}

export default function NexusLogo({ size = 40, rounded = true, className = "" }: NexusLogoProps) {
  return (
    <img
      src={nexusLogo}
      alt="Nexus-premium logo"
      width={size}
      height={size}
      draggable={false}
      className={`${rounded ? "rounded-xl" : ""} shrink-0 object-cover shadow-[0_0_18px_rgba(61,213,255,0.35)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
