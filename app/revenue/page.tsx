"use client";
import NewRevenueForm from "@/components/new-revenue-form";
import { RevenueProps } from "@/context/@types";
import { DeleteOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
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
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

async function getRevenue() {
  const res = await fetch("api/revenue", {
    method: "GET",
  });
  return res.json();
}

async function postRevenue(body: RevenueProps) {
  const res = await fetch("api/revenue", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

async function deleteRevenue(id: string) {
  const res = await fetch("api/revenue", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res;
}

export default function Revenue() {
  const [revenues, setRevenues] = useState<Array<RevenueProps>>([]);
  const [revenue, setRevenue] = useState<RevenueProps>({
    id: "",
    type: "",
    amount: 0,
    price: "",
    date: dayjs().format("DD/MM/YYYY"),
  });

  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const handleOpenRegister = () => setOpen(true);
  const handleCloseRegister = () => setOpen(false);

  const [realoadRequest, setRealoadRequest] = useState<boolean>(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getRevenue().then((res) => setRevenues(res));
  }, [realoadRequest]);

  const handleChange =
    (prop: keyof RevenueProps) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "amount") value = Number(value);
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

  const handleDateChange =
    (prop: keyof RevenueProps) => (value: Dayjs | null) => {
      setRevenue({
        ...revenue,
        [prop]: value?.format("DD/MM/YYYY") || "",
      });
    };

  const validateRevenueFields = () => {
    const errors = {
      type: !revenue.type,
      amount: !revenue.amount || revenue.amount < 1,
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
        const response = await postRevenue(revenue);
        if (response.status === 200) {
          setRealoadRequest(!realoadRequest);
          toast.success(
            `A receita de R$${revenue.price} foi registrada com sucesso!`
          );
          setOpen(false);
          window.location.reload();
        } else if (response.status === 404) {
          Swal.fire({
            title: `Sem estoque para barril de ${revenue.type}`,
            text: `Adicione mais barris ao estoque para ser vendido.`,
            icon: "error",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar a receita",
          icon: "error",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    await Swal.fire({
      title: "Deseja realmente deletar esta receita?",
      text: "Você não será capaz de reverter essa ação!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteRevenue(id);
          if (response.status === 200) {
            setRealoadRequest(!realoadRequest);
            toast.success("Receita deletada com sucesso.");
          }
        } catch (err) {
          Swal.fire({
            title: "Ocorreu um erro ao tentar deletar a receita",
            icon: "error",
          });
        }
      }
    });
  };

  const columns = ["Tipo", "Quantidade", "Preço", "Data de compra", "Ações"];

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseRegister}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <NewRevenueForm
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          revenue={revenue}
        />
      </Modal>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" alignSelf="start">
          Listagem das receitas
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
              {revenues.length > 0 &&
                revenues
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((revenue, index) => (
                    <TableRow key={index}>
                      <TableCell>{revenue.type}</TableCell>
                      <TableCell>{revenue.amount} UN</TableCell>
                      <TableCell>R${revenue.price}</TableCell>
                      <TableCell>{revenue.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(revenue.id)}>
                          <DeleteOutlineRounded color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              {revenues.length < 1 && (
                <TableCell colSpan={5}>Nenhuma receita encontrada.</TableCell>
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              width: "100%",
              p: "0.5rem 0.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleOpenRegister}
              sx={{ height: "auto" }}
            >
              Registrar nova receita
            </Button>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={revenues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </TableContainer>
      </Box>
    </>
  );
}
