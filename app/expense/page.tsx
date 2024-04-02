"use client";
import {
  Box,
  Button,
  Modal,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
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
import { Expense } from "@/context/@types";
import NewExpenseForm from "@/components/new-expense-form";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

async function getExpense() {
  const res = await fetch("api/expense", {
    method: "GET",
  });
  return res.json();
}

async function postExpense(body: Expense) {
  const res = await fetch("api/expense", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

export default function Expense() {
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [expense, setExpense] = useState<Expense>({
    item_name: "",
    amount: 0,
    price: "",
    purchase_date: dayjs().format("DD/MM/YYYY"),
  });

  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const handleOpenRegister = () => setOpen(true);
  const handleCloseRegister = () => setOpen(false);

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
    getExpense().then((res) => setExpenses(res));
  }, []);

  const handleChange =
    (prop: keyof Expense) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent
    ) => {
      let value: string | number = event.target.value;
      if (prop === "price") value = formatCurrencyInput(value);
      else if (prop === "amount") value = Number(value);
      setExpense({ ...expense, [prop]: value });
    };

  function formatCurrencyInput(value: string) {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Convert to a number with two decimal places
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);

    return formattedValue;
  }

  const handleDateChange = (prop: keyof Expense) => (value: Dayjs | null) => {
    setExpense({
      ...expense,
      [prop]: value?.format("DD/MM/YYYY") || "",
    });
  };

  const validateExpenseFields = () => {
    const errors = {
      item_name: !expense.item_name,
      amount: !expense.amount || expense.amount < 1,
      price: !expense.price,
      purchase_date: !expense.purchase_date,
    };

    const messageHandler = {
      item_name: "Nome do item",
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
    if (validateExpenseFields()) {
      try {
        const response = await postExpense(expense);
        if (response.status === 200) {
          const ok = await Swal.fire({
            title: "Despesa registrada com sucesso",
            text: `A despesa de R$${expense.price} foi registrada!`,
            icon: "success",
          });
          if (ok) router.push("/");
        }
      } catch (err) {
        Swal.fire({
          title: "Ocorreu um erro ao tentar registrar a despesa",
          icon: "error",
        });
      }
    }
  };

  const columns = ["Item", "Quantidade", "Preço", "Data de compra"];

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseRegister}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <NewExpenseForm
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          expense={expense}
        />
      </Modal>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography variant="h4" alignSelf="start">
          Listagem das despesas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {columns.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableHead>
            <TableBody>
              {expenses.length > 0 &&
                expenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{expense.item_name}</TableCell>
                      <TableCell>{expense.amount} UN</TableCell>
                      <TableCell>R${expense.price}</TableCell>
                      <TableCell>{expense.purchase_date}</TableCell>
                    </TableRow>
                  ))}
              {expenses.length < 1 && (
                <TableCell colSpan={4}>Nenhuma despesa encontrada.</TableCell>
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
              Registrar nova despesa
            </Button>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={expenses.length}
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
