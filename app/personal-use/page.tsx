"use client";
import NewTotoUse from "@/components/new-toto-use";
import NewXuxuUse from "@/components/new-xuxu-use";
import { DeleteOutlineRounded } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export interface PersonalUseProps {
  id: string;
  who: string;
  type: string;
  amount: number;
  date: string;
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

async function deleteUse(id: string) {
  const res = await fetch("api/personal-use", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res;
}

export default function PersonalUse() {
  const [totoUseQtd, setTotoUseQtd] = useState<Array<PersonalUseProps>>();
  const [xuxuUseQtd, setXuxuUseQtd] = useState<Array<PersonalUseProps>>();
  const [uses, setUses] = useState<Array<PersonalUseProps>>([]);

  const [totoUse, setTotoUse] = useState<PersonalUseProps>({
    id: "",
    who: "Toto",
    type: "",
    amount: 0,
    date: dayjs().format("DD/MM/YYYY"),
  });

  const [xuxuUse, setXuxuUse] = useState<PersonalUseProps>({
    id: "",
    who: "Xuxu",
    type: "",
    amount: 0,
    date: dayjs().format("DD/MM/YYYY"),
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const [realoadRequest, setRealoadRequest] = useState<boolean>(false);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getUses().then((uses) => {
      setTotoUseQtd(
        uses.useSummary.filter((e: PersonalUseProps) => e.who === "Toto")
      );
      setXuxuUseQtd(
        uses.useSummary.filter((e: PersonalUseProps) => e.who === "Xuxu")
      );
      setUses(uses.uses);
    });
  }, [realoadRequest]);

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
      date: !who.date,
    };

    const messageHandler = {
      type: "Barril",
      amount: "Quantidade",
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

  const handleSubmitToto = async () => {
    if (validateFields(totoUse)) {
      try {
        const response = await postPersonalUse(totoUse);
        if (response.status === 200) {
          toast.success("Consumo registrado com sucesso");
          setRealoadRequest(!realoadRequest);
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
          toast.success("Consumo registrado com sucesso");
          setRealoadRequest(!realoadRequest);
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

  const columns = ["Usuário", "Barril", "Quantidade", "Ações"];

  const handleDeleteUse = async (id: string) => {
    await Swal.fire({
      title: "Deseja realmente deletar este uso?",
      text: "Você não será capaz de reverter essa ação!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUse(id);
          if (response.status === 200) {
            toast.success("Uso deletada com sucesso.");
            setRealoadRequest(!realoadRequest);
          }
        } catch (err) {
          Swal.fire({
            title: "Ocorreu um erro ao tentar deletar o uso",
            icon: "error",
          });
        }
      }
    });
  };

  const handleDateChange = (who: "toto" | "xuxu") => (value: Dayjs | null) => {
    if (who === "toto") {
      setTotoUse({
        ...totoUse,
        date: value?.format("DD/MM/YYYY") || "",
      });
    } else if (who === "xuxu") {
      setXuxuUse({
        ...xuxuUse,
        date: value?.format("DD/MM/YYYY") || "",
      });
    }
  };

  return (
    <Grid container spacing={12} rowSpacing={5} justifyContent="center">
      <Grid
        xs={12}
        lg={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <NewTotoUse
          totoUseQtd={totoUseQtd}
          handleChangeToto={handleChangeToto}
          totoUse={totoUse}
          handleSubmitToto={handleSubmitToto}
          handleDateChange={handleDateChange}
        />
      </Grid>
      <Grid
        xs={12}
        lg={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <NewXuxuUse
          xuxuUseQtd={xuxuUseQtd}
          handleChangeXuxu={handleChangeXuxu}
          xuxuUse={xuxuUse}
          handleSubmitXuxu={handleSubmitXuxu}
          handleDateChange={handleDateChange}
        />
      </Grid>
      <Grid xs={12}>
        <Typography variant="h4" alignSelf="start" m="0 0rem 0.5rem 1rem">
          Listagem das usos pessoais
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {columns.map((col) => (
                <TableCell key={col} align={col === "Ações" ? "right" : "left"}>
                  {col}
                </TableCell>
              ))}
            </TableHead>
            <TableBody>
              {uses.length > 0 &&
                uses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((use, index) => (
                    <TableRow key={index}>
                      <TableCell>{use.who}</TableCell>
                      <TableCell>{use.type}</TableCell>
                      <TableCell>{use.amount} UN</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteUse(use.id)}>
                          <DeleteOutlineRounded color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              {uses.length < 1 && (
                <TableCell colSpan={5}>
                  Nenhum uso pessoal encontrado.
                </TableCell>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={uses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Grid>
    </Grid>
  );
}
