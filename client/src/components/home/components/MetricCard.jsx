import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MetricCard = ({ icon: Icon, title, value, trend, delay, colorClass }) => {
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