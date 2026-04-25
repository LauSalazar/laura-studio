import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Laura — Arte Generativo & Mundos Digitales",
    template: "%s | Laura Studio",
  },
  description:
    "Portafolio de Laura. Arte generativo, experimentos artísticos, proyectos 3D y creación de contenido digital.",
  keywords: ["arte generativo", "3D", "WebGL", "creative coding", "portafolio"],
  authors: [{ name: "Laura" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Laura Studio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
