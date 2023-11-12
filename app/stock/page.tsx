"use client";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

interface Stock {
  type: string;
  amount: number;
  price: string;
  purchase_date: string;
}

async function postStock(body: Stock) {
  const res = await fetch("api/stock", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

export default function Stock() {
  const [stock, setStock] = useState<Stock>({
    type: "",
    amount: 0,
    price: "",
    purchase_date: dayjs().format("DD/MM/YYYY"),
  });

  const router = useRouter();

  const handleChange =
    (prop: keyof Stock) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "amount") value = Number(value);
      else if (prop === "type") value = `${value}L`;
      setStock({ ...stock, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  const handleDateChange = (prop: keyof Stock) => (value: Dayjs | null) => {
    setStock({
      ...stock,
      [prop]: value?.format("DD/MM/YYYY") || "",
    });
  };

  const validateStockFields = () => {
    const errors = {
      type: !stock.type,
      amount: !stock.amount || stock.amount < 1,
      price: !stock.price,
      purchase_date: !stock.purchase_date,
    };

    const messageHandler = {
      type: "Barril",
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
    if (validateStockFields()) {
      try {
        const response = await postStock(stock);
        if (response.status === 200) {
          const ok = await Swal.fire({
            title: "Estoque adicionado com sucesso",
            text: `O estoque de R$${stock.price} foi registrado!`,
            icon: "success",
          });
          if (ok) router.push("/");
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar o estoque",
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
        Novo Estoque
      </Typography>
      <Paper sx={{ padding: "1rem", width: "30vw" }}>
        <Grid container spacing={2} rowSpacing={2}>
          <Grid xs={8}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Barril</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stock.type.split("L")[0]}
                label="Barril"
                onChange={handleChange("type")}
              >
                <MenuItem value={10}>10 litros</MenuItem>
                <MenuItem value={30}>30 litros</MenuItem>
                <MenuItem value={50}>50 litros</MenuItem>
              </Select>
            </FormControl>
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
              value={stock.price}
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
                  stock.purchase_date &&
                  dayjs(stock.purchase_date, "DD/MM/YYYY").isValid()
                    ? dayjs(stock.purchase_date, "DD/MM/YYYY")
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
