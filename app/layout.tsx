import MainComponent from "@/components/main-component";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Vale do Chopp",
  description: "Gestor de estoque do vale do chopp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <MainComponent>{children}</MainComponent>
      </body>
    </html>
  );
}
