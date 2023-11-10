"use client";
import StatisticsCard from "@/components/statistics-card";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";

async function getRevenue() {
  const res = await fetch("api/revenue", {
    method: "GET",
  });
  return res.json();
}

export default function Home() {
  const [revenues, setRevenues] = useState<{ price: number }[]>();

  useEffect(() => {
    getRevenue().then((res) => setRevenues(res));
  }, []);

  const handleRevenueValues = () => {
    if (!revenues) return;
    const total = revenues.reduce((sum, e) => sum + Number(e.price), 0);
    return total.toFixed(2);
  };

  return (
    <Grid container spacing={12} rowSpacing={2} justifyContent="center">
      <Grid
        xs={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <StatisticsCard title="Receitas" amount={handleRevenueValues()} />
        <StatisticsCard title="Despesas" />
      </Grid>
      <Grid xs={5}>
        <StatisticsCard title="Estoque" />
      </Grid>
    </Grid>
  );
}
