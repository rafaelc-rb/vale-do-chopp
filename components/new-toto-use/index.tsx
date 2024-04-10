import React, { ChangeEvent } from "react";
import StatisticsCard from "../ui/statistics-card";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { PersonalUseProps } from "@/app/personal-use/page";

interface NewTotoUseProps {
  totoUseQtd: Array<PersonalUseProps> | undefined;
  handleChangeToto: (
    prop: keyof PersonalUseProps
  ) => (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => void;
  totoUse: PersonalUseProps;
  handleSubmitToto: () => void;
}

export default function NewTotoUse(props: NewTotoUseProps) {
  const {
    totoUseQtd,
    handleChangeToto,
    totoUse,
    handleSubmitToto,
  }: NewTotoUseProps = props;

  return (
    <>
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
      <Button variant="outlined" onClick={handleSubmitToto}>
        Salvar
      </Button>
    </>
  );
}
