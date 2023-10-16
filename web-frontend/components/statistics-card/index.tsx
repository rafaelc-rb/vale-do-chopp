import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

interface Stock {
  type: string;
  amount: number;
}
interface StatisticsCardProps {
  title: string;
  stock?: Stock;
}

function StatisticsCard(props: StatisticsCardProps) {
  const { title, stock }: StatisticsCardProps = props;
  return (
    <Paper
      sx={{
        padding: "1rem 2rem 1rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {title === "Receitas" && <AttachMoneyOutlinedIcon color="success" />}
          {title === "Despesas" && <AttachMoneyOutlinedIcon color="error" />}
          {title === "Estoque" && <Inventory2OutlinedIcon />}
          {title}
        </Box>
        {title !== "Estoque" && (
          <Typography color={title === "Despesas" ? "error" : "inherit"}>
            R$0,00
          </Typography>
        )}
      </Box>
      {title === "Estoque" && (
        <Box>
          Barril de 10 litros: {stock?.amount ? String(stock.amount) : "0"}
          <br />
          Barril de 30 litros: {stock?.amount ? String(stock.amount) : "0"}
          <br />
          Barril de 50 litros: {stock?.amount ? String(stock.amount) : "0"}
        </Box>
      )}
    </Paper>
  );
}

export default StatisticsCard;
