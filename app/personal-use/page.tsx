"use client";
import StatisticsCard from "@/components/ui/statistics-card";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export interface PersonalUseProps {
  who: string;
  type: string;
  amount: number;
}

async function postPersonalUse(body: PersonalUseProps) {
  const res = await fetch("api/personal-use", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

async function getUses() {
  const res = await fetch("api/personal-use", {
    method: "GET",
  });
  return res.json();
}

export default function PersonalUse() {
  const [totoUseQtd, setTotoUseQtd] = useState<Array<PersonalUseProps>>();
  const [xuxuUseQtd, setXuxuUseQtd] = useState<Array<PersonalUseProps>>();
  const [totoUse, setTotoUse] = useState<PersonalUseProps>({
    who: "Toto",
    type: "",
    amount: 0,
  });

  const [xuxuUse, setXuxuUse] = useState<PersonalUseProps>({
    who: "Xuxu",
    type: "",
    amount: 0,
  });

  const router = useRouter();

  useEffect(() => {
    getUses().then((uses) => {
      if (!uses) return;
      setTotoUseQtd(uses.filter((e: PersonalUseProps) => e.who === "Toto"));
      setXuxuUseQtd(uses.filter((e: PersonalUseProps) => e.who === "Xuxu"));
    });
  }, []);

  const handleChangeToto =
    (prop: keyof PersonalUseProps) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "amount") value = Number(value);
      else if (prop === "type") value = `${value}L`;
      setTotoUse({ ...totoUse, [prop]: value });
    };

  const handleChangeXuxu =
    (prop: keyof PersonalUseProps) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "amount") value = Number(value);
      else if (prop === "type") value = `${value}L`;
      setXuxuUse({ ...xuxuUse, [prop]: value });
    };

  const validateFields = (who: PersonalUseProps) => {
    const errors = {
      type: !who.type,
      amount: !who.amount || who.amount < 1,
    };

    const messageHandler = {
      type: "Barril",
      amount: "Quantidade",
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

  const handleSubmitToto = async () => {
    if (validateFields(totoUse)) {
      try {
        const response = await postPersonalUse(totoUse);
        if (response.status === 200) {
          const ok = await Swal.fire({
            title: "Consumo registrado com sucesso",
            icon: "success",
          });
          if (ok) router.refresh();
        } else if (response.status === 404) {
          Swal.fire({
            title: `Sem estoque para barril de ${totoUse.type}`,
            text: `Adicione mais barris ao estoque para ser consumido.`,
            icon: "error",
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar o consumo",
          text: `Detalhes do erro: ${err.message}`,
          icon: "error",
        });
      }
    }
  };

  const handleSubmitXuxu = async () => {
    if (validateFields(xuxuUse)) {
      try {
        const response = await postPersonalUse(xuxuUse);
        if (response.status === 200) {
          const ok = await Swal.fire({
            title: "Consumo registrado com sucesso",
            icon: "success",
          });
          if (ok) router.refresh();
        } else if (response.status === 404) {
          Swal.fire({
            title: `Sem estoque para barril de ${xuxuUse.type}`,
            text: `Adicione mais barris ao estoque para ser consumido.`,
            icon: "error",
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar o consumo",
          text: `Detalhes do erro: ${err.message}`,
          icon: "error",
        });
      }
    }
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
        <StatisticsCard title="Toto" personalUses={totoUseQtd} />
        <TextField
          label="Quantidade de barris"
          type="number"
          onChange={handleChangeToto("amount")}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Tipo do barril</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={totoUse.type.split("L")[0]}
            label="Tipo do barril"
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
        <StatisticsCard title="Xuxu" personalUses={xuxuUseQtd} />
        <TextField
          label="Quantidade de barris"
          type="number"
          onChange={handleChangeXuxu("amount")}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Tipo do barril</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={xuxuUse.type.split("L")[0]}
            label="Tipo do barril"
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
