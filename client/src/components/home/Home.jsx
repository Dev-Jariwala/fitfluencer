import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Calendar, TrendingUp, Award, BarChart2, Clock, Star, FileText, MessageCircle, Bell, Settings, ChevronRight, Heart, Zap, Dumbbell, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger, } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/commonStore';

const MetricCard = ({ icon: Icon, title, value, trend, description, delay, colorClass }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                            <Icon className={`h-5 w-5 ${colorClass}`} />
                        </div>
                        {trend && (
                            <Badge variant={trend === 'up' ? 'success' : 'destructive'} className="text-xs">
                                {trend === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-1">{value}</div>
                    <CardDescription>{title}</CardDescription>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const NextSessionCard = ({ delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
                        Next Session
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h4 className="font-medium">Nutrition Consultation</h4>
                            <p className="text-slate-500 text-sm">with Dr. Sarah Johnson</p>
                        </div>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatar-nutritionist.jpg" alt="Dr. Sarah" />
                            <AvatarFallback className="bg-emerald-100 text-emerald-800">SJ</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Tomorrow, 10:00 AM - 11:00 AM</span>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                        Join Session
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const ProgressTrackerCard = ({ delay }) => {
    const goals = [
        { name: 'Weight Goal', current: 68, target: 65, unit: 'kg', progress: 66 },
        { name: 'Workout Goal', current: 16, target: 20, unit: 'sessions', progress: 80 },
        { name: 'Protein Intake', current: 85, target: 100, unit: 'g/day', progress: 85 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                        Progress Tracker
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {goals.map((goal, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{goal.name}</span>
                                    <span className="text-sm text-slate-500">
                                        {goal.current} / {goal.target} {goal.unit}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Progress value={goal.progress} className="h-2 flex-1" />
                                    <span className="ml-2 text-xs font-medium">{goal.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="link" size="sm" className="ml-auto p-0">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const MealPlanCard = ({ delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                        <Coffee className="h-5 w-5 mr-2 text-emerald-500" />
                        Today's Meal Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="bg-amber-100 text-amber-800 p-1.5 rounded-md mr-3">
                                <Coffee className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Breakfast</h4>
                                <p className="text-xs text-slate-500">Protein smoothie with berries</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-md mr-3">
                                <Coffee className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Lunch</h4>
                                <p className="text-xs text-slate-500">Grilled chicken salad with quinoa</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-indigo-100 text-indigo-800 p-1.5 rounded-md mr-3">
                                <Coffee className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Dinner</h4>
                                <p className="text-xs text-slate-500">Baked salmon with vegetables</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="link" size="sm" className="ml-auto p-0">
                        Full Meal Plan <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const WorkoutCard = ({ delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2 text-emerald-500" />
                        Today's Workout
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-md mr-3">
                                    <Dumbbell className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium">Core Circuit</h4>
                                    <p className="text-xs text-slate-500">15 mins • 4 exercises</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8">Start</Button>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-md mr-3">
                                    <Dumbbell className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium">Upper Body</h4>
                                    <p className="text-xs text-slate-500">25 mins • 6 exercises</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8">Start</Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="link" size="sm" className="ml-auto p-0">
                        Weekly Plan <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const Home = () => {
    const data = useAuthStore(state => state.data)
    // Mock data
    const user = {
        name: data?.username || 'Rahul Sharma',
        avatar: '/profile-avatar.jpg',
        plan: '3-Month Plan',
        joinDate: 'March 15, 2023',
        daysActive: 48,
        email: 'rahul.s@example.com',
        dietitian: 'Dr. Sarah Johnson',
        trainer: 'Mike Peterson'
    };

    const metrics = [
        { icon: Heart, title: 'Active Days', value: '48/90', colorClass: 'text-rose-500' },
        { icon: Zap, title: 'Current Streak', value: '7 days', colorClass: 'text-amber-500' },
        { icon: Award, title: 'Achievements', value: '12', colorClass: 'text-blue-500' },
        { icon: Star, title: 'Success Score', value: '86%', colorClass: 'text-emerald-500' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-8"
        >
            <div className="container px-4 mx-auto">
                {/* Header with user info */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl uppercase">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold">
                                    <span className="">Welcome back,</span>
                                    <span className="text-primary capitalize ml-1">{user.name.split(' ')[0]}</span>
                                </h1>
                                <div className="flex items-center text-muted-foreground">
                                    <Badge variant="outline" className="mr-2 bg-muted">{user.plan}</Badge>
                                    <span className="text-sm">Active since {user.joinDate}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex items-center">
                                <Bell className="h-4 w-4 mr-2" /> Notifications
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" /> Settings
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {metrics.map((metric, i) => (
                        <MetricCard
                            key={i}
                            icon={metric.icon}
                            title={metric.title}
                            value={metric.value}
                            delay={0.1 + (i * 0.05)}
                            colorClass={metric.colorClass}
                        />
                    ))}
                </div>

                <Tabs defaultValue="overview" className="mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                            <TabsTrigger value="workouts">Workouts</TabsTrigger>
                            <TabsTrigger value="progress">Progress</TabsTrigger>
                        </TabsList>
                    </motion.div>

                    <TabsContent value="overview" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <NextSessionCard delay={0.2} />
                            <ProgressTrackerCard delay={0.25} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MealPlanCard delay={0.3} />
                            <WorkoutCard delay={0.35} />
                        </div>
                    </TabsContent>

                    <TabsContent value="nutrition">
                        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-slate-500">Nutrition content will be displayed here</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="workouts">
                        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-slate-500">Workouts content will be displayed here</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="progress">
                        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-slate-500">Progress content will be displayed here</p>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Recent Activity & Appointments */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-emerald-500" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {['Completed core workout', 'Logged lunch meal', 'Completed weigh-in', 'Chatted with nutritionist'].map((activity, i) => (
                                        <div key={i} className="flex items-start pb-3 border-b last:border-0 last:pb-0">
                                            <div className={`p-2 rounded-full bg-slate-100 mr-3`}>
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity}</p>
                                                <p className="text-xs text-slate-500">{Math.floor(Math.random() * 12) + 1} hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" size="sm" className="ml-auto p-0">
                                    View All Activity <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <MessageCircle className="h-5 w-5 mr-2 text-emerald-500" />
                                    Your Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarFallback className="bg-emerald-100 text-emerald-800">SJ</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{user.dietitian}</p>
                                                <p className="text-xs text-slate-500">Nutritionist</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Message</Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarFallback className="bg-blue-100 text-blue-800">MP</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{user.trainer}</p>
                                                <p className="text-xs text-slate-500">Fitness Trainer</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Message</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Schedule Consultation</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home; 