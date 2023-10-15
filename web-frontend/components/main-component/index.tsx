import React, { ReactNode } from "react";
import Menu from "./menu";
import Head from "./head";

function MainComponent({ children }: { children: ReactNode }) {
  return (
    <div>
      <Head />
      <Menu />
      {children}
    </div>
  );
}

export default MainComponent;
