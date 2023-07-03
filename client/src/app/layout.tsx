import Layout from "@/Layout";
import "../styles/global.scss";
import { Inter } from "next/font/google";
import SWRContext from "@/context/SWRContext";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        </body>
      </SWRContext>
    </html>
  );
}
