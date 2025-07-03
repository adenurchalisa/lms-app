import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverview } from "@/service/overviewService";
import { useQuery } from "@tanstack/react-query";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { data: dataOverview, isPending } = useQuery({
    queryKey: ["overview"],
    queryFn: getOverview,
  });

  return (
    <div className="ml-10">
      {isPending ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Lagi loading...</div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-bold">Dashboard</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {dataOverview.totalCourses}
                  </div>
                  <div className="text-sm text-gray-600">Total Course</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {dataOverview.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Student Join
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-bold">
                  Chart Student Join Course
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-white rounded-xl shadow p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dataOverview.dailyStats}
                    margin={{ top: 5, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "Jumlah Student",
                        position: "insideRigth",
                        angle: -90,
                      }}
                    />
                    <Legend align="right" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
