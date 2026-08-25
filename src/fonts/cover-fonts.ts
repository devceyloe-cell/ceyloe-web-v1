import localFont from "next/font/local";

export const bellMt = localFont({
  src: [{ path: "./BellMT-Bold.ttf", weight: "700", style: "normal" }],
  variable: "--font-bell",
  display: "swap",
});

export const poppins = localFont({
  src: [
    { path: "./Poppins-Regular.otf", weight: "400", style: "normal" },
    { path: "./Poppins-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
