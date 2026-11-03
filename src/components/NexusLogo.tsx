import { useEffect } from "react";
import nexusLogo from "@/assets/1793693791541.jpg";

interface NexusLogoProps {
  size?: number;
  rounded?: boolean;
  className?: string;
}

/** Sets the browser tab / app icon to the Nexus logo. */
export function useNexusFavicon() {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = nexusLogo;
    link.type = "image/jpeg";
    document.title = "Nexus-premium";
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
