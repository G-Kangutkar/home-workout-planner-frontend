
// ─────────────────────────────────────────────────────────────────
// Performance tracking page with charts showing workout stats
// Uses Recharts for data visualization
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Flame, Clock } from "lucide-react";

// API calls
import { getPerformanceStats } from "@/lib/api";

// Colors for charts
const COLORS = {
  lime: "#a3e635",
  blue: "#60a5fa",
  purple: "#c084fc",
  orange: "#fb923c",
  pink: "#f472b6",
  cyan: "#22d3ee",
  yellow: "#fbbf24",
  red: "#f87171"
};

const MUSCLE_COLORS = [
  COLORS.lime, COLORS.orange, COLORS.blue, COLORS.purple,
  COLORS.pink, COLORS.cyan, COLORS.yellow, COLORS.red
];

// Background decoration
function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
    </div>
  );
}

// Stats card component
function StatCard({ icon: Icon, label, value, sublabel, color = "lime" }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
              {label}
            </p>
            <p className="text-3xl font-black text-white">{value}</p>
            {sublabel && (
              <p className="text-xs text-zinc-500 mt-1">{sublabel}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-400/10 border border-${color}-400/30`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-zinc-500 font-semibold mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <p className="text-sm text-white font-semibold">
            {entry.name}: {entry.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function PerformancePage() {
  const [period, setPeriod] = useState("30days");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getPerformanceStats(period);
      setStats(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-lime-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-zinc-500 text-sm">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <BackgroundDecor />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#a3e635" }}>
              <TrendingUp className="w-4 h-4 text-zinc-900" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Performance</h1>
              <p className="text-xs text-zinc-600">Track your workout progress</p>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex gap-2">
            {["7days", "30days", "90days", "all"].map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                onClick={() => setPeriod(p)}
                className={period === p
                  ? "bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500 bg-zinc-900"
                }
              >
                {p === "7days" ? "7D" : p === "30days" ? "30D" : p === "90days" ? "90D" : "All"}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            label="Total Workouts"
            value={stats?.summary?.totalWorkouts || 0}
            sublabel={`Avg ${stats?.summary?.avgDurationPerWorkout || 0} min/workout`}
            color="lime"
          />
          <StatCard
            icon={Flame}
            label="Calories Burned"
            value={(stats?.summary?.totalCalories || 0).toLocaleString()}
            sublabel={`Avg ${stats?.summary?.avgCaloriesPerWorkout || 0} cal/workout`}
            color="orange"
          />
          <StatCard
            icon={Clock}
            label="Total Time"
            value={`${Math.floor((stats?.summary?.totalMinutes || 0) / 60)}h ${(stats?.summary?.totalMinutes || 0) % 60}m`}
            sublabel="Training duration"
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Duration"
            value={`${stats?.summary?.avgDurationPerWorkout || 0} min`}
            sublabel="Per workout"
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Calories over time - Line chart */}
          <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Calories Burned Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.charts?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke={COLORS.orange} 
                    strokeWidth={3}
                    dot={{ fill: COLORS.orange, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly workouts - Bar chart */}
          <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-400" />
                Weekly Workout Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.charts?.weekly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="workouts" fill={COLORS.lime} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Muscle groups - Pie chart */}
          <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                💪 Most Trained Muscle Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats?.charts?.muscleGroups || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#a3e635"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(stats?.charts?.muscleGroups || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MUSCLE_COLORS[index % MUSCLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Duration over time - Line chart */}
          <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Workout Duration Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.charts?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#71717a"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#71717a' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke={COLORS.blue} 
                    strokeWidth={3}
                    dot={{ fill: COLORS.blue, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* No data state */}
        {stats?.summary?.totalWorkouts === 0 && (
          <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.2)" }}>
                <TrendingUp className="w-10 h-10 text-lime-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">No Workouts Yet</h3>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                Complete your first workout to start tracking your performance. Your stats will appear here.
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}