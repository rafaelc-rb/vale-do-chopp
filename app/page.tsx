"use client";
import StatisticsCard from "@/components/ui/statistics-card";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";

async function getRevenue() {
  const res = await fetch("api/revenue", {
    method: "GET",
  });
  return res.json();
}

async function getExpense() {
  const res = await fetch("api/expense", {
    method: "GET",
  });
  return res.json();
}

async function getStock() {
  const res = await fetch("api/stock", {
    method: "GET",
  });
  return res.json();
}

export default function Home() {
  const [revenues, setRevenues] = useState<{ price: number }[]>([]);
  const [expenses, setExpenses] = useState<{ price: number }[]>([]);
  const [stock, setStock] = useState<{ type: string; amount: number }[]>([]);

  useEffect(() => {
    getRevenue().then((res) => setRevenues(res));
    getExpense().then((res) => setExpenses(res));
    getStock().then((res) => setStock(res));
  }, []);

  const handleSumPrices = (pricesArray: { price: number }[] | undefined) => {
    if (!pricesArray) return;
    const total = pricesArray.reduce((sum, e) => sum + Number(e.price), 0);
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
          gap: "1rem",
        }}
      >
        <StatisticsCard title="Receitas" amount={handleSumPrices(revenues)} />
        <StatisticsCard title="Despesas" amount={handleSumPrices(expenses)} />
      </Grid>
      <Grid xs={5}>
        <StatisticsCard title="Estoque" stock={stock} />
      </Grid>
    </Grid>
  );
}
