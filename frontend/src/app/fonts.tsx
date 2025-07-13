import localFont from "next/font/local";

export const blanka = localFont({
  src: "../fonts/Blanka-Regular.woff",
  display: "swap",
  variable: "--font-blanka",
});

export const garnet = localFont({
  src: "../fonts/GarnetCapitals-Regular.ttf",
  display: "swap",
  variable: "--font-garnet",
});

export const poppins = localFont({
  src: [
    {
      path: "../fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-poppins",
});
