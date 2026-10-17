"use client";

import { useEffect } from "react";
import { useContent } from "../../hooks/useContent";

const COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const SIZE = /^\d{1,3}(\.\d+)?px$/;
const FONT = /^[a-zA-Z0-9 ]{2,40}$/;

/**
 * Applies the admin Theme settings (brand colour, navy colour, font and any
 * typography overrides) to the whole site by overriding CSS variables.
 */
export default function ThemeStyle() {
    const { data } = useContent("global");
    const theme = data.theme;

    const rules: string[] = [];
    if (theme?.brandColor && COLOR.test(theme.brandColor)) rules.push(`--color-brand:${theme.brandColor};`);
    if (theme?.navyColor && COLOR.test(theme.navyColor)) rules.push(`--color-navy:${theme.navyColor};`);
    if (theme?.fontFamily && FONT.test(theme.fontFamily)) rules.push(`--site-font:"${theme.fontFamily}";`);
    for (const [key, value] of Object.entries(theme?.typography ?? {})) {
        if (/^--fs-[a-z0-9-]+$/.test(key) && typeof value === "string" && SIZE.test(value.trim())) {
            rules.push(`${key}:${value.trim()};`);
        }
    }

    const font = theme?.fontFamily && FONT.test(theme.fontFamily) ? theme.fontFamily : "Inter";

    useEffect(() => {
        if (font === "Inter") return;
        const id = "site-font-link";
        let link = document.getElementById(id) as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800;900&display=swap`;
    }, [font]);

    useEffect(() => {
        if (data.favicon) {
            let icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
            if (!icon) {
                icon = document.createElement("link");
                icon.rel = "icon";
                document.head.appendChild(icon);
            }
            icon.href = data.favicon;
        }
    }, [data.favicon]);

    if (rules.length === 0) return null;
    return <style>{`:root{${rules.join("")}}`}</style>;
}
