import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LMNTARY Performance | Train Your Mind Like You Train Your Body",
  description:
    "Performance psychology for those who refuse to settle. 20+ years of elite coaching. One system. Learn, Manage, Nurture, Thrive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oxanium:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#f0f0f0" }}>
        <div className="site-frame">
          <Nav />
          <main className="grid-overlay" style={{ paddingTop: "96px", flex: 1, position: "relative" }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
