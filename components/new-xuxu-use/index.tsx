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

interface NewXuxuUseProps {
  xuxuUseQtd: Array<PersonalUseProps> | undefined;
  handleChangeXuxu: (
    prop: keyof PersonalUseProps
  ) => (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => void;
  xuxuUse: PersonalUseProps;
  handleSubmitXuxu: () => void;
  handleDateChange: (who: "toto" | "xuxu") => (value: Dayjs | null) => void;
}

export default function NewXuxuUse(props: NewXuxuUseProps) {
  const {
    xuxuUseQtd,
    handleChangeXuxu,
    xuxuUse,
    handleSubmitXuxu,
    handleDateChange,
  }: NewXuxuUseProps = props;

  return (
    <>
      <StatisticsCard title="Xuxu" personalUses={xuxuUseQtd} />
      <Stack direction="row" gap="1rem">
        <TextField
          fullWidth
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
      </Stack>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Data da venda"
          openTo="month"
          views={["year", "month", "day"]}
          format="DD/MM/YYYY"
          value={
            xuxuUse.date && dayjs(xuxuUse.date, "DD/MM/YYYY").isValid()
              ? dayjs(xuxuUse.date, "DD/MM/YYYY")
              : null
          }
          onChange={handleDateChange("xuxu")}
        />
      </LocalizationProvider>
      <Button variant="outlined" onClick={handleSubmitXuxu}>
        Salvar
      </Button>
    </>
  );
}
