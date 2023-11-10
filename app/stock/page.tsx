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
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";

interface Stock {
  type: string;
  amount: string;
  price: string;
  purchase_date: string;
}

export default function Stock() {
  const [stock, setStock] = useState<Stock>({
    type: "",
    amount: "",
    price: "",
    purchase_date: "",
  });

  const handleChange =
    (prop: keyof Stock) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value = event.target.value as string;
      if (prop === "price") {
        value = formatCurrencyInput(value);
      }
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

  const handleSubmit = async () => {
    console.table(stock);
    Swal.fire({
      title: "Estoque adicionado com sucesso",
      text: `O estoque de R$${stock.price} foi registrado!`,
      icon: "success",
    });
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
                value={stock.type}
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
