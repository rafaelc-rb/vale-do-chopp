"use client";
import {
  Box,
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
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface Expense {
  item_name: string;
  amount: number;
  price: string;
  purchase_date: string;
}

async function postExpense(body: Expense) {
  const res = await fetch("api/expense", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

export default function Expense() {
  const [expense, setExpense] = useState<Expense>({
    item_name: "",
    amount: 0,
    price: "",
    purchase_date: "",
  });

  const router = useRouter();

  const handleChange =
    (prop: keyof Expense) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "amount") value = Number(value);
      setExpense({ ...expense, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  const handleDateChange = (prop: keyof Expense) => (value: Dayjs | null) => {
    setExpense({
      ...expense,
      [prop]: value?.format("DD/MM/YYYY") || "",
    });
  };

  const validateExpenseFields = () => {
    const errors = {
      item_name: !expense.item_name,
      amount: !expense.amount || expense.amount < 1,
      price: !expense.price,
      purchase_date: !expense.purchase_date,
    };

    const messageHandler = {
      item_name: "Nome do item",
      amount: "Quantidade",
      price: "Valor",
      purchase_date: "Data da compra",
    };

    const emptyFields = Object.keys(errors)
      .filter((key) => errors[key as keyof typeof errors])
      .map((key) => messageHandler[key as keyof typeof messageHandler])
      .join("; ");

    if (emptyFields.length > 0) {
      toast.error(
        `O(s) campo(s) a seguir devem ser preenchidos: ${emptyFields}`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateExpenseFields()) {
      try {
        const response = await postExpense(expense);
        if (response.status === 200) {
          const ok = await Swal.fire({
            title: "Despesa registrada com sucesso",
            text: `A despesa de R$${expense.price} foi registrada!`,
            icon: "success",
          });
          if (ok) router.push("/");
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar a despesa",
          icon: "error",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ alignSelf: "left" }}>
        Nova Despesa
      </Typography>
      <Paper sx={{ padding: "1rem", width: "30vw" }}>
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
            <Button variant="outlined" onClick={() => handleSubmit()}>
              Salvar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
