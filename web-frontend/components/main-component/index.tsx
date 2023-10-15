import React, { ReactNode } from "react";
import MiniDrawer from "./menu";

function MainComponent({ children }: { children: ReactNode }) {
  return (
    <div>
      <MiniDrawer />
      {children}
    </div>
  );
}

export default MainComponent;
