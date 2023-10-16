import MainComponent from "@/components/main-component";
import StatisticsCard from "@/components/statistics-card";
import Grid from "@mui/material/Unstable_Grid2/";

export default function Home() {
  return (
    <MainComponent>
      <Grid container spacing={12} rowSpacing={2} justifyContent="center">
        <Grid
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <StatisticsCard title="Receitas" />
          <StatisticsCard title="Despesas" />
        </Grid>
        <Grid xs={5}>
          <StatisticsCard title="Estoque" />
        </Grid>
      </Grid>
    </MainComponent>
  );
}
