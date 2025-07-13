import "../globals.css";
import Navigation from "../components/nav";
import { blanka, garnet, poppins } from "../fonts";

export const metadata = {
  title: {
    default: "RSGA",
    template: "%s | RSGA",
  },
  description:
    "RSGA is a youth-driven organization reshaping sports and gaming experiences across Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-[#131314] ${blanka.variable} ${poppins.variable} ${garnet.variable}`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
