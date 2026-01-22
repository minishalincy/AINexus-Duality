"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  School,
  LogOut,
} from "lucide-react";

// --- School Data (Matches Login/Onboarding) ---
const SCHOOLS = [
  "Government Primary School, Delhi",
  "Kendriya Vidyalaya, Mumbai",
  "Sarvodaya Vidyalaya, Bangalore",
  "Government High School, Chennai",
  "Zilla Parishad School, Pune",
  "Government Senior Secondary School, Jaipur",
  "Municipal Corporation School, Kolkata",
  "Government Model School, Hyderabad",
  "Prathamik Vidyalaya, Lucknow",
  "Rajkiya Pratibha Vikas Vidyalaya, Delhi",
];

// --- Mock Data for Charts ---

// 1. Active Teachers (Bar Chart)
const DATA_ACTIVE_TEACHERS = [
  { month: "Jan", active: 45 },
  { month: "Feb", active: 52 },
  { month: "Mar", active: 48 },
  { month: "Apr", active: 61 },
  { month: "May", active: 55 },
  { month: "Jun", active: 67 },
];

// 2. Feedback Outcomes (Pie Chart)
const DATA_FEEDBACK_OUTCOMES = [
  { name: "Worked Successfully", value: 65, color: "#10B981" }, // Green
  { name: "Partially Worked", value: 25, color: "#F59E0B" }, // Amber
  { name: "Did Not Work", value: 10, color: "#EF4444" }, // Red
];

// 3. Subject Difficulty (Bar Chart - Categories)
const DATA_SUBJECT_DIFFICULTY = [
  { subject: "Math", Easy: 20, Medium: 40, Difficult: 30 },
  { subject: "Science", Easy: 30, Medium: 30, Difficult: 20 },
  { subject: "English", Easy: 40, Medium: 30, Difficult: 10 },
  { subject: "Social", Easy: 50, Medium: 20, Difficult: 5 },
];

// 4. School Impact (Custom Scatter/Bubble or Bar)
// Mapping schools to impact categories
const DATA_SCHOOL_IMPACT = SCHOOLS.map((school, index) => {
  // Simulate mock impact data based on index
  let impact = "Low";
  let engagement = 30;
  if (index % 3 === 0) {
    impact = "Highly Improved";
    engagement = 85 + (index * 2);
  } else if (index % 2 === 0) {
    impact = "Moderately Engaged";
    engagement = 60 + (index * 2);
  } else {
    impact = "Low Usage";
    engagement = 20 + (index * 2);
  }
  return {
    school: school.split(",")[1] || school.split(" ")[0], // Short name for label
    fullName: school,
    impact,
    engagement,
    index: index + 1
  };
});

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 p-2 rounded-lg text-white">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Assist<span className="text-orange-600">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-500 mt-1">
            Data-driven insights across all schools and teachers.
          </p>
        </div>

        {/* 1. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Teachers"
            value="10"
            icon={<Users className="text-blue-600" />}
            trend="+2 this week"
            trendUp={true}
            bg="bg-blue-50"
          />
          <SummaryCard
            title="Total Queries"
            value="42"
            icon={<MessageSquare className="text-purple-600" />}
            trend="+5 this week"
            trendUp={true}
            bg="bg-purple-50"
          />
          <SummaryCard
            title="Engagement Rate"
            value="78%"
            icon={<Activity className="text-green-600" />}
            trend="+2% vs last month"
            trendUp={true}
            bg="bg-green-50"
          />
          <SummaryCard
            title="Usage Growth"
            value="Rapid"
            icon={<TrendingUp className="text-orange-600" />}
            trend="High Adoption"
            trendUp={true}
            bg="bg-orange-50"
          />
        </div>

        {/* 2. Visualizations - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Active Teachers */}
          <ChartCard title="Active Teachers (Monthly)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DATA_ACTIVE_TEACHERS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="active" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Feedback Outcomes */}
          <ChartCard title="Feedback Outcomes">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={DATA_FEEDBACK_OUTCOMES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_FEEDBACK_OUTCOMES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* 3. Visualizations - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 3: Subject Difficulty */}
          <ChartCard title="Subject Difficulty Levels">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={DATA_SUBJECT_DIFFICULTY} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} width={60} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend verticalAlign="top" />
                <Bar dataKey="Difficult" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Easy" stackId="a" fill="#10B981" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 4: School Impact */}
          <ChartCard title="School Impact Analysis">
            <div className="h-[350px] overflow-y-auto custom-scrollbar pr-2">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">School Name</th>
                    <th className="px-4 py-3">Impact Level</th>
                    <th className="px-4 py-3">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DATA_SCHOOL_IMPACT.map((school) => (
                    <tr key={school.fullName} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{school.fullName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${school.impact === 'Highly Improved' ? 'bg-green-100 text-green-700' :
                            school.impact === 'Moderately Engaged' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'}`}>
                          {school.impact}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200">
                          <div className={`h-1.5 rounded-full ${school.engagement > 80 ? 'bg-green-500' : school.engagement > 50 ? 'bg-blue-500' : 'bg-gray-500'}`} style={{ width: `${school.engagement}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

      </main>
    </div>
  );
}

// --- Helper Components ---

function SummaryCard({ title, value, icon, trend, trendUp, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          {icon}
        </div>
      </div>
      <div className={`flex items-center text-sm ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        <TrendingUp className="w-4 h-4 mr-1" />
        <span className="font-medium">{trend}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
      {children}
    </div>
  );
}
