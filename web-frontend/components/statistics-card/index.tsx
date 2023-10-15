import { Box, Paper } from "@mui/material";
import React from "react";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

interface StatisticsCardProps {
  title: string;
}

function StatisticsCard(props: StatisticsCardProps) {
  const { title }: StatisticsCardProps = props;
  return (
    <Paper
      sx={{
        display: "flex",
        padding: "1rem 2rem 1rem 1rem",
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
      {title !== "Estoque" && <>R$0,00</>}
    </Paper>
  );
}

export default StatisticsCard;
