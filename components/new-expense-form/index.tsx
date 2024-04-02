import { Expense } from "@/context/@types";
import {
  Button,
  InputAdornment,
  Paper,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent } from "react";

interface NewExpenseFormProps {
  handleChange: (
    prop: keyof Expense
  ) => (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => void;
  handleDateChange: (prop: keyof Expense) => (value: Dayjs | null) => void;
  expense: Expense;
  handleSubmit: () => void;
}

export default function NewExpenseForm(props: NewExpenseFormProps) {
  const {
    handleChange,
    handleDateChange,
    handleSubmit,
    expense,
  }: NewExpenseFormProps = props;
  return (
    <Paper
      sx={{
        padding: "1rem",
        width: "30vw",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" sx={{ alignSelf: "left" }}>
        Nova Despesa
      </Typography>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid xs={8}>
          <TextField
            fullWidth
            label="Nome do Item"
            onChange={handleChange("item_name")}
          />
        </Grid>
        <Grid xs={4}>
          <TextField
            label="Qtd"
            type="number"
            onChange={handleChange("amount")}
          />
        </Grid>
        <Grid xs={6}>
          <TextField
            label="Valor Total"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
            value={expense.price}
            onChange={handleChange("price")}
          />
        </Grid>
        <Grid xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data da compra"
              openTo="month"
              views={["year", "month", "day"]}
              format="DD/MM/YYYY"
              value={
                expense.purchase_date &&
                dayjs(expense.purchase_date, "DD/MM/YYYY").isValid()
                  ? dayjs(expense.purchase_date, "DD/MM/YYYY")
                  : null
              }
              onChange={handleDateChange("purchase_date")}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={handleSubmit}>
            Salvar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
