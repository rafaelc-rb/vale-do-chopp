"use client";
import StatisticsCard from "@/components/statistics-card";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useState } from "react";
import Swal from "sweetalert2";

interface PersonalUse {
  who: string;
  type: string;
  amount: string;
}

export default function PersonalUse() {
  const [totoUse, setTotoUse] = useState<PersonalUse>({
    who: "Toto",
    type: "",
    amount: "",
  });

  const [xuxuUse, setXuxuUse] = useState<PersonalUse>({
    who: "Toto",
    type: "",
    amount: "",
  });

  const handleChangeToto =
    (prop: keyof PersonalUse) => (event: SelectChangeEvent) => {
      setTotoUse({ ...totoUse, [prop]: event.target.value });
    };

  const handleChangeXuxu =
    (prop: keyof PersonalUse) => (event: SelectChangeEvent) => {
      setXuxuUse({ ...xuxuUse, [prop]: event.target.value });
    };

  const handleSubmitToto = () => {
    console.table(totoUse);
    Swal.fire({
      title: "Estoque adicionado com sucesso",
      text: `O estoque de R$${totoUse.type} foi registrado!`,
      icon: "success",
    });
  };

  const handleSubmitXuxu = () => {
    console.table(xuxuUse);
    Swal.fire({
      title: "Estoque adicionado com sucesso",
      text: `O estoque de R$${xuxuUse.type} foi registrado!`,
      icon: "success",
    });
  };

  return (
    <Grid container spacing={12} rowSpacing={2} justifyContent="center">
      <Grid
        xs={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <StatisticsCard title="Toto" />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Barril</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={totoUse.type}
            label="Barril"
            onChange={handleChangeToto("type")}
          >
            <MenuItem value={10}>10 litros</MenuItem>
            <MenuItem value={30}>30 litros</MenuItem>
            <MenuItem value={50}>50 litros</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => handleSubmitToto()}>
          Salvar
        </Button>
      </Grid>
      <Grid
        xs={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <StatisticsCard title="Xuxu" />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Barril</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={xuxuUse.type}
            label="Barril"
            onChange={handleChangeXuxu("type")}
          >
            <MenuItem value={10}>10 litros</MenuItem>
            <MenuItem value={30}>30 litros</MenuItem>
            <MenuItem value={50}>50 litros</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => handleSubmitXuxu()}>
          Salvar
        </Button>
      </Grid>
    </Grid>
  );
}
