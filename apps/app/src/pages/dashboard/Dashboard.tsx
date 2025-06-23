import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import { OptionsGrid } from "@/components/ui/grids";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  const client = useStore(queryClient);

  const { data = [] } = useQuery(
    {
      queryKey: ["dashboard"],
      queryFn: async () => (await api.get("/dashboard")).data,
    },
    client
  );

  const chartConfig = {
    y: {
      label: "Completado:",
      color: "#2563eb",
    },
    x: {
      label: "Fecha",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <>
      <OptionsGrid
        title="Dashboard"
        subtitle="Visualiza el historial de producción"
      >
        <></>
      </OptionsGrid>

      <Card className="py-6 pr-4 h-[30rem]">
        {data[0] && (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="x" />
              <YAxis tickFormatter={(v) => v + "%"} ticks={[100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="y"
                fill="var(--chart-3)"
                radius={4}
                animationDuration={0}
              />
            </BarChart>
          </ChartContainer>
        )}
      </Card>
    </>
  );
}
