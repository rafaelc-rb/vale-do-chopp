"use client";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import Router from "next/router";

const LoadingIcon = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      console.log("routeChangeStart");
      setLoading(true);
    };
    const end = () => {
      console.log("routeChangeComplete or routeChangeError");
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  console.log(loading);

  if (!loading) return null;

  const containerStyle = {
    zIndex: "9999",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    position: "absolute",
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
};

export { LoadingIcon };
