import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, Users, CreditCard, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts
  const monthlySales = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 1800 },
    { name: 'Mar', total: 2200 },
    { name: 'Apr', total: 2400 },
    { name: 'May', total: 2800 },
    { name: 'Jun', total: 3600 },
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '3,240',
      change: '+15%',
      isIncrease: true,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Total Revenue',
      value: '$84,254',
      change: '+20%',
      isIncrease: true,
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: 'Active Plans',
      value: '573',
      change: '+8%',
      isIncrease: true,
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '-3%',
      isIncrease: false,
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs flex items-center ${
                stat.isIncrease ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.isIncrease ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>
            Revenue generated over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlySales}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Bar dataKey="total" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 