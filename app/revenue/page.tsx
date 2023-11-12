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

interface Revenue {
  type: string;
  amount: number;
  price: string;
  date: string;
}

async function postRevenue(body: Revenue) {
  const res = await fetch("api/revenue", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

export default function Revenue() {
  const [revenue, setRevenue] = useState<Revenue>({
    type: "",
    amount: 0,
    price: "",
    date: "",
  });

  const router = useRouter();

  const handleChange =
    (prop: keyof Revenue) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "type") value = `${value}L`;
      setRevenue({ ...revenue, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  const handleDateChange = (prop: keyof Revenue) => (value: Dayjs | null) => {
    setRevenue({
      ...revenue,
      [prop]: value?.format("DD/MM/YYYY") || "",
    });
  };

  const validateRevenueFields = () => {
    const errors = {
      type: !revenue.type,
      amount: !revenue.amount,
      price: !revenue.price,
      date: !revenue.date,
    };

    const messageHandler = {
      type: "Barril",
      amount: "Quantidade",
      price: "Valor",
      date: "Data da venda",
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
    if (validateRevenueFields()) {
      try {
        await postRevenue(revenue);
        const ok = await Swal.fire({
          title: "Receita registrada com sucesso",
          text: `A receita de R$${revenue.price} foi registrada!`,
          icon: "success",
        });
        if (ok) {
          router.push("/");
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar a receita",
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
        Nova Receita
      </Typography>
      <Paper sx={{ padding: "1rem", width: "30vw" }}>
        <Grid container spacing={2} rowSpacing={2}>
          <Grid xs={8}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Barril</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={revenue.type.split("L")[0]}
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
              label="Valor"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              value={revenue.price}
              onChange={handleChange("price")}
            />
          </Grid>
          <Grid xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data da venda"
                openTo="month"
                views={["year", "month", "day"]}
                format="DD/MM/YYYY"
                value={
                  revenue.date && dayjs(revenue.date, "DD/MM/YYYY").isValid()
                    ? dayjs(revenue.date, "DD/MM/YYYY")
                    : null
                }
                onChange={handleDateChange("date")}
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
