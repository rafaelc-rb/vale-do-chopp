import React, { ReactNode } from "react";
import MiniDrawer from "./menu";

function MainComponent({ children }: { children: ReactNode }) {
  return <MiniDrawer>{children}</MiniDrawer>;
}

export default MainComponent;
