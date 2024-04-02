import LabTabs from "@/components/tabs";
import { Box, Typography } from "@mui/material";

const revenuesTable = () => (
  <Box>
    <Typography>Tabela de receitas ainda não implementada!</Typography>
  </Box>
);

const expensesTable = () => (
  <Box>
    <Typography>Tabela de despesas ainda não implementada!</Typography>
  </Box>
);

export default function Log() {
  return (
    <>
      <LabTabs tabNames={["Receitas", "Despesas"]}>
        {revenuesTable()}
        {expensesTable()}
      </LabTabs>
    </>
  );
}
