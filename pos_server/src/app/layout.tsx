"use client";
import Layout from "@/Layout";
import "../styles/global.scss";
import { Inter } from "next/font/google";
import SWRContext from "@/context/SWRContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SWRContext>
        <body className={inter.className}>
          <Layout>{children}</Layout>
          <div id="portal"></div>
        </body>
      </SWRContext>
    </html>
  );
}
