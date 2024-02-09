import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";

export default function loading() {
  const containerStyle = {
    zIndex: "9999",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box sx={containerStyle}>
      <Image
        src="/images/loadingBeer.gif"
        alt={"Loading icon"}
        width={150}
        height={150}
      />
    </Box>
  );
}
