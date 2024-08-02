"use client";
import Layout from "@/Layout";
import "../styles/global.scss";
import { Inter } from "next/font/google";
import SWRContext from "@/context/SWRContext";
import { socket } from "@/libs/webSocket";
import { useEffect } from "react";
import { Metadata } from "next";

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
      // window.alert("Connection Error!, Please tap the ok button to reload.");
      reload();
    });
  }, [sk]);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </head>
      <SWRContext>
        <body className={inter.className}>
          <Layout>{children}</Layout>
          <div id="portal"></div>
        </body>
      </SWRContext>
    </html>
  );
}
