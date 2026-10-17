// Removes files from the OLD version of the project that conflict with the new
// structure (app/(site)/...). Safe to run more than once.
//
//   node cleanup-old-files.js
//
const fs = require("fs");
const path = require("path");

const root = __dirname;
if (!fs.existsSync(path.join(root, "app", "(site)"))) {
    console.error("app/(site) not found — run this from the new project folder.");
    process.exit(1);
}

const OLD = [
    // old public pages (now in app/(site)/...)
    "app/page.tsx",
    "app/about",
    "app/courses",
    "app/test-series",
    "app/study-material",
    "app/faculty",
    "app/results",
    "app/cart",
    "app/login",
    "app/signup",
    // old shared components / helpers (replaced by app/components/site, app/hooks/useContent.ts)
    "app/components/Footer.tsx",
    "app/components/HeroSection.tsx",
    "app/components/HomeSections.tsx",
    "app/components/Navbar.tsx",
    "app/components/ui.tsx",
    "app/hooks/useSiteContent.ts",
    "app/lib/types.ts",
    "app/lib/firestoreMedia.ts",
    "app/lib/seedSiteContent.ts",
    // stale build output
    "app/.next",
    ".next",
];

let removed = 0;
for (const rel of OLD) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) {
        fs.rmSync(full, { recursive: true, force: true });
        console.log("removed", rel);
        removed++;
    }
}
console.log(removed ? `Done — removed ${removed} old item(s). Now run: npm run dev` : "Nothing to clean — project is already up to date.");
