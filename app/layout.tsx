import type { Metadata } from "next";
import "./globals.css";
import DarkToggle from "./DarkToggle";

export const metadata: Metadata = {
  title: "EndoTrack",
  description: "Symptom tracking for endometriosis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DarkToggle />
        {children}
      </body>
    </html>
  );
}
