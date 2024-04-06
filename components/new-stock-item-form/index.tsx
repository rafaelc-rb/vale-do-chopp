import { StockItemProps } from "@/context/@types";
import {
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
import { ChangeEvent } from "react";

interface NewStockItemFormProps {
  handleChange: (
    prop: keyof StockItemProps
  ) => (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => void;
  handleDateChange: (
    prop: keyof StockItemProps
  ) => (value: Dayjs | null) => void;
  stockItem: StockItemProps;
  handleSubmit: () => void;
}

export default function NewStockItemForm(props: NewStockItemFormProps) {
  const {
    handleChange,
    handleDateChange,
    handleSubmit,
    stockItem,
  }: NewStockItemFormProps = props;
  return (
    <Paper
      sx={{
        padding: "2rem 3rem",
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" sx={{ alignSelf: "left" }}>
        Novo item para o estoque
      </Typography>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Barril</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stockItem.type.split("L")[0]}
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
            value={stockItem.price}
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
                stockItem.purchase_date &&
                dayjs(stockItem.purchase_date, "DD/MM/YYYY").isValid()
                  ? dayjs(stockItem.purchase_date, "DD/MM/YYYY")
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
