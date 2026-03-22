import { BarComparisonChart } from "@/components/charts/bar-comparison-chart";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { RadarPerformanceChart } from "@/components/charts/radar-performance-chart";
import { ChartCard } from "@/components/chart-card";
import { ReportView } from "@/components/report-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireRole } from "@/lib/auth/session";
import { getAthleteWorkspace } from "@/lib/data/service";

export default async function AnalyticsPage() {
  const session = await requireRole(["athlete"]);
  const workspace = await getAthleteWorkspace(session.user.id);

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        {["overview", "physical", "technical", "match", "nutrition", "wellness", "mental", "reports"].map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Training + readiness overview">
          <LineTrendChart
            data={workspace.analytics.overviewTrend}
            lines={[
              { key: "trainingLoad", color: "#b5ff5d" },
              { key: "readiness", color: "#38bdf8" },
              { key: "recovery", color: "#fb7185" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Personal best focus areas">
          <RadarPerformanceChart data={workspace.analytics.technical.radar} />
        </ChartCard>
      </TabsContent>

      <TabsContent value="physical">
        <ChartCard title="Physical trend">
          <LineTrendChart
            data={workspace.analytics.physical.line}
            lines={[
              { key: "sprintVolume", color: "#b5ff5d" },
              { key: "consistency", color: "#38bdf8" },
            ]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="technical">
        <ChartCard title="Technical comparison">
          <BarComparisonChart
            data={workspace.analytics.technical.bar}
            keys={[
              { key: "current", color: "#b5ff5d" },
              { key: "previous", color: "#1d4ed8" },
            ]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="match">
        <ChartCard title="Practice vs match workload">
          <BarComparisonChart
            data={workspace.analytics.match.comparison.map((entry) => ({
              name: entry.label,
              current: entry.value,
            }))}
            keys={[{ key: "current", color: "#b5ff5d" }]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="nutrition">
        <ChartCard title="Nutrition adherence">
          <BarComparisonChart
            data={workspace.analytics.nutrition.bars.map((entry) => ({
              name: entry.name,
              current: entry.value,
              previous: entry.target,
            }))}
            keys={[
              { key: "current", color: "#b5ff5d" },
              { key: "previous", color: "#0f766e" },
            ]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="wellness">
        <ChartCard title="Wellness trend">
          <LineTrendChart
            data={workspace.analytics.wellness.trend.map((entry) => ({
              name: entry.label,
              readiness: entry.readiness,
              recovery: entry.recovery,
              sleep: entry.sleep,
            }))}
            lines={[
              { key: "readiness", color: "#b5ff5d" },
              { key: "recovery", color: "#38bdf8" },
              { key: "sleep", color: "#f59e0b" },
            ]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="mental">
        <ChartCard title="Mental performance">
          <BarComparisonChart
            data={workspace.analytics.mental.trend.map((entry) => ({
              name: entry.name,
              current: entry.current,
            }))}
            keys={[{ key: "current", color: "#b5ff5d" }]}
          />
        </ChartCard>
      </TabsContent>

      <TabsContent value="reports">
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportView title="Weekly report" items={workspace.reports.weekly} />
          <ReportView title="Monthly report" items={workspace.reports.monthly} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
