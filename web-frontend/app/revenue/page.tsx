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
import { useState } from "react";

interface Revenue {
  type: "";
  amount: "";
  price: "";
}

export default function Revenue() {
  const [revenue, setRevenue] = useState({
    type: "",
    amount: "",
    price: "",
  });

  const handleChange =
    (prop: keyof Revenue) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value = event.target.value as string;
      if (prop === "price") {
        value = formatCurrencyInput(value);
      }
      setRevenue({ ...revenue, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h4">Nova Receita</Typography>
      <Paper sx={{ padding: "1rem", width: "40vw" }}>
        <Grid container spacing={2} rowSpacing={2}>
          <Grid xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Barril</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={revenue.type}
                label="Barril"
                onChange={handleChange("type")}
              >
                <MenuItem value={10}>10 litros</MenuItem>
                <MenuItem value={30}>30 litros</MenuItem>
                <MenuItem value={50}>50 litros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            <TextField
              label="Qtd"
              type="number"
              onChange={handleChange("amount")}
            />
          </Grid>
          <Grid xs={3}>
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
          <Grid xs={12}>
            <Button onClick={() => console.table(revenue)}>Salvar</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
