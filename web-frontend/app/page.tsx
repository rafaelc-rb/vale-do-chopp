import MainComponent from "@/components/main-component";
import StatisticsCard from "@/components/statistics-card";
import Grid from "@mui/material/Unstable_Grid2/";

export default function Home() {
  return (
    <MainComponent>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid xs={4}>
          <StatisticsCard title="Receitas" />
        </Grid>
        <Grid xs={4}>
          <StatisticsCard title="Despesas" />
        </Grid>
        <Grid xs={4}>
          <StatisticsCard title="Estoque" />
        </Grid>
      </Grid>
    </MainComponent>
  );
}
