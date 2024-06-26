import React, { ChangeEvent } from "react";
import StatisticsCard from "../ui/statistics-card";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
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
  handleDateChange: (who: "toto" | "xuxu") => (value: Dayjs | null) => void;
}

export default function NewTotoUse(props: NewTotoUseProps) {
  const {
    totoUseQtd,
    handleChangeToto,
    totoUse,
    handleSubmitToto,
    handleDateChange,
  }: NewTotoUseProps = props;

  return (
    <>
      <StatisticsCard title="Toto" personalUses={totoUseQtd} />
      <Stack direction="row" gap="1rem">
        <TextField
          fullWidth
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
      </Stack>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Data da venda"
          openTo="month"
          views={["year", "month", "day"]}
          format="DD/MM/YYYY"
          value={
            totoUse.date && dayjs(totoUse.date, "DD/MM/YYYY").isValid()
              ? dayjs(totoUse.date, "DD/MM/YYYY")
              : null
          }
          onChange={handleDateChange("toto")}
        />
      </LocalizationProvider>
      <Button variant="outlined" onClick={handleSubmitToto}>
        Salvar
      </Button>
    </>
  );
}
