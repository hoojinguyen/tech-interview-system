'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionsByDifficultyProps {
  data: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export function QuestionsByDifficultyChart({ data }: QuestionsByDifficultyProps) {
  const chartData = [
    { name: 'Easy', value: data.easy, color: '#10b981' },
    { name: 'Medium', value: data.medium, color: '#f59e0b' },
    { name: 'Hard', value: data.hard, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions by Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface QuestionsByTypeProps {
  data: {
    coding: number;
    conceptual: number;
    'system-design': number;
    behavioral: number;
  };
}

export function QuestionsByTypeChart({ data }: QuestionsByTypeProps) {
  const chartData = [
    { name: 'Coding', value: data.coding, color: '#3b82f6' },
    { name: 'Conceptual', value: data.conceptual, color: '#8b5cf6' },
    { name: 'System Design', value: data['system-design'], color: '#06b6d4' },
    { name: 'Behavioral', value: data.behavioral, color: '#f59e0b' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface MockInterviewsByLevelProps {
  data: {
    junior: number;
    mid: number;
    senior: number;
  };
}

export function MockInterviewsByLevelChart({ data }: MockInterviewsByLevelProps) {
  const chartData = [
    { name: 'Junior', value: data.junior, color: '#10b981' },
    { name: 'Mid-level', value: data.mid, color: '#f59e0b' },
    { name: 'Senior', value: data.senior, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Interviews by Level</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ContentApprovalStatusProps {
  data: {
    approved: number;
    pending: number;
  };
}

export function ContentApprovalStatusChart({ data }: ContentApprovalStatusProps) {
  const chartData = [
    { name: 'Approved', value: data.approved, color: '#10b981' },
    { name: 'Pending', value: data.pending, color: '#f59e0b' },
  ];

  const COLORS = ['#10b981', '#f59e0b'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Approval Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Mock data for usage trends (since we don't have historical data yet)
const mockUsageData = [
  { name: 'Mon', questions: 120, interviews: 45 },
  { name: 'Tue', questions: 150, interviews: 52 },
  { name: 'Wed', questions: 180, interviews: 38 },
  { name: 'Thu', questions: 200, interviews: 67 },
  { name: 'Fri', questions: 170, interviews: 89 },
  { name: 'Sat', questions: 90, interviews: 34 },
  { name: 'Sun', questions: 80, interviews: 28 },
];

export function UsageTrendsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="questions" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Questions Viewed"
            />
            <Line 
              type="monotone" 
              dataKey="interviews" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Mock Interviews"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}