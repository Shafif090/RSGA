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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-[#131314] ${blanka.variable} ${poppins.variable} ${garnet.variable}`}>
        <Navigation />
        {children}
        {/* Footer */}
        <footer className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-8">
              <h3
                className={`text-3xl font-bold bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-2 ${blanka.className}`}>
                RSGA
              </h3>
              <p className={`text-gray-400 ${poppins.className}`}>
                Remians’ Sports & Gaming Association
              </p>
            </div>

            <p className={`text-gray-400 ${poppins.className} text-sm`}>
              © 2025 RSGA. All rights reserved. Empowering athletes through
              data-driven insights.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
