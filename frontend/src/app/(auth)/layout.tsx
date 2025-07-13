import type { ReactNode } from "react";
import { blanka, garnet, poppins } from "../fonts";
import "../globals.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className={`${blanka.variable} ${poppins.variable} ${garnet.variable}`}>
      {children}
    </main>
  );
}
