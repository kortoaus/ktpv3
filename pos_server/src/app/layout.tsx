"use client";
import Layout from "@/Layout";
import "../styles/global.scss";
import { Inter } from "next/font/google";
import SWRContext from "@/context/SWRContext";
import { socket } from "@/libs/webSocket";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sk = socket;

  const reload = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.location.reload();
  };

  useEffect(() => {
    sk.on("connect_error", (e) => {
      window.alert("Connection Error!, Please tap the ok button to reload.");
      reload();
    });
  }, []);

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
