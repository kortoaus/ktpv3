import Layout from "@/Layout";
import "../styles/global.scss";
import { Inter } from "next/font/google";
import SWRContext from "@/context/SWRContext";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Manager",
    template: `%s | Manager`,
  },
  description: "KORTOPOS V3",
};

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
        </body>
      </SWRContext>
    </html>
  );
}
