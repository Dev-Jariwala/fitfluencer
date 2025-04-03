import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import Dashboard from '../components/admin/Dashboard';
import Plans from '../components/admin/Plans';
import Config from '../components/admin/Config';
import Commission from '../components/admin/Commission';
import { MdDashboard, MdOutlineDashboard } from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import { RiMoneyRupeeCircleFill, RiMoneyRupeeCircleLine } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { cn } from '@/lib/utils';

const tabs = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    activeIcon: <MdDashboard />,
    pasiveIcon: <MdOutlineDashboard />,
  },
  {
    label: 'Plans',
    value: 'plans',
    activeIcon: <CiBoxList />,
    pasiveIcon: <CiBoxList />,
  },
  {
    label: 'Config',
    value: 'config',
    activeIcon: <GrConfigure />,
    pasiveIcon: <GrConfigure />,
  },
  {
    label: 'Commission',
    value: 'commission',
    activeIcon: <RiMoneyRupeeCircleFill />,
    pasiveIcon: <RiMoneyRupeeCircleLine />
    ,
  }
]

const AdminPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild className={cn(
              "flex items-center gap-2",
              tab.value === "dashboard" && "bg-primary text-primary-foreground"
            )}>
              <div className="flex items-center gap-2">
                {tab.activeIcon}
                <span className='flex items-center gap-2'>
                  {tab.label}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <Card className="p-6">
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="plans">
            <Plans />
          </TabsContent>

          <TabsContent value="config">
            <Config />
          </TabsContent>

          <TabsContent value="commission">
            <Commission />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AdminPage; 