export const metadata = {
  title: {
    default: "RSGA",
    template: "%s | RSGA",
  },
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "RSGA is a youth-driven organization reshaping sports and gaming experiences across Bangladesh.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
