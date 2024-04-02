import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { PersonalUseProps } from "@/app/personal-use/page";

interface Stock {
  type: string;
  amount: number;
}
interface StatisticsCardProps {
  title: string;
  amount?: string;
  stock?: Array<Stock>;
  personalUses?: Array<PersonalUseProps>;
}

function StatisticsCard(props: StatisticsCardProps) {
  const { title, stock, amount, personalUses }: StatisticsCardProps = props;
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
          <Typography fontWeight={700} variant="h6">
            {title}
          </Typography>
        </Box>
        {title !== "Estoque" && title !== "Toto" && title !== "Xuxu" && (
          <Typography color={title === "Despesas" ? "error" : "inherit"}>
            R${amount ? amount : "0.00"}
          </Typography>
        )}
        {(title === "Toto" || title === "Xuxu") && (
          <Box>
            {personalUses?.map((e, index) => {
              return (
                <Typography key={index}>
                  Barril de {e.type}:{" "}
                  <strong>{e.amount ? e.amount : "0"} unidades</strong>
                </Typography>
              );
            })}
          </Box>
        )}
      </Box>
      {title === "Estoque" && (
        <Box>
          {stock &&
            stock.length > 0 &&
            stock.map((e, index) => {
              return (
                <Typography key={index} variant="subtitle1">
                  Barril de {e.type}: <strong>{e.amount} unidades</strong>
                </Typography>
              );
            })}
          {(!stock || stock.length === 0) && (
            <>
              <Typography variant="subtitle1">O estoque está vazio!</Typography>
              <Typography variant="subtitle1">
                Registre novos itens para fazer o monitoramento.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default StatisticsCard;
