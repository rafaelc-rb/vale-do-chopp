"use client";
import NewStockItemForm from "@/components/new-stock-item-form";
import { StockItemProps } from "@/context/@types";
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
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

async function getStock() {
  const res = await fetch("api/stock", {
    method: "GET",
  });
  return res.json();
}

async function postStock(body: StockItemProps) {
  const res = await fetch("api/stock", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

async function deleteStock(id: string) {
  const res = await fetch("api/stock", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res;
}

export default function Stock() {
  const [stock, setStock] = useState<Array<StockItemProps>>([]);
  const [stockItem, setStockItem] = useState<StockItemProps>({
    id: "",
    type: "",
    amount: 0,
    price: "",
    purchase_date: dayjs().format("DD/MM/YYYY"),
  });

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
    getStock().then((res) => setStock(res.stock));
  }, [realoadRequest]);

  const handleChange =
    (prop: keyof StockItemProps) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "amount") value = Number(value);
      else if (prop === "type") value = `${value}L`;
      setStockItem({ ...stockItem, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  const handleDateChange =
    (prop: keyof StockItemProps) => (value: Dayjs | null) => {
      setStockItem({
        ...stockItem,
        [prop]: value?.format("DD/MM/YYYY") || "",
      });
    };

  const validateStockItemFields = () => {
    const errors = {
      type: !stockItem.type,
      amount: !stockItem.amount || stockItem.amount < 1,
      price: !stockItem.price,
      purchase_date: !stockItem.purchase_date,
    };

    const messageHandler = {
      type: "Barril",
      amount: "Quantidade",
      price: "Valor",
      purchase_date: "Data da compra",
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
    if (validateStockItemFields()) {
      try {
        const response = await postStock(stockItem);
        if (response.status === 200) {
          setRealoadRequest(!realoadRequest);
          toast.success(
            `O item de R$${stockItem.price} foi registrado no estoque com sucesso!`
          );
          setOpen(false);
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar o item no estoque",
          icon: "error",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    await Swal.fire({
      title: "Deseja realmente deletar este item do estoque?",
      text: "Você não será capaz de reverter essa ação!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteStock(id);
          if (response.status === 200) {
            setRealoadRequest(!realoadRequest);
            toast.success("Item deletado do estoque com sucesso.");
          }
        } catch (err) {
          Swal.fire({
            title: "Ocorreu um erro ao tentar deletar este item do estoque",
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
        <NewStockItemForm
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          stockItem={stockItem}
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
          Listagem dos itens do estoque
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
              {stock.length > 0 &&
                stock
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.amount} UN</TableCell>
                      <TableCell>R${item.price}</TableCell>
                      <TableCell>{item.purchase_date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(item.id)}>
                          <DeleteOutlineRounded color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              {stock.length < 1 && (
                <TableCell colSpan={5}>
                  Nenhum item encontrado no estoque.
                </TableCell>
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
              Registrar novo item no estoque
            </Button>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={stock.length}
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
