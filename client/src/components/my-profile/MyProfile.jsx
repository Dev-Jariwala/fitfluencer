import React, { useState } from 'react';
import { useAuthStore } from '@/store/commonStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { User, CreditCard, Link, DollarSign, FileText } from 'lucide-react';

const ProfileInfo = () => {
    const userData = useAuthStore(state => state.data) || {};
    
    // Mock data - in a real app, this would come from API
    const userDetails = {
        username: userData.username || 'user123',
        firstName: userData.firstName || 'John',
        lastName: userData.lastName || 'Doe',
        role: 'client',
        dietitianName: 'Dr. Sarah Smith',
        profilePhoto: '/avatar.jpg',
        height: '175',
        weight: '70'
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={userDetails.profilePhoto} alt={`${userDetails.firstName} ${userDetails.lastName}`} />
                            <AvatarFallback className="text-4xl">
                                {userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-xl font-medium">{userDetails.firstName} {userDetails.lastName}</h3>
                            <Badge variant="outline" className="mt-1">{userDetails.role}</Badge>
                        </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Username</p>
                            <p className="font-medium">{userDetails.username}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Dietitian</p>
                            <p className="font-medium">{userDetails.dietitianName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Height</p>
                            <p className="font-medium">{userDetails.height} cm</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="font-medium">{userDetails.weight} kg</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const InviteLinks = () => {
    // Mock data
    const invites = [
        { id: 1, link: 'https://fitfluencer.com/invite/abc123', status: 'active', created: '2023-05-15' },
        { id: 2, link: 'https://fitfluencer.com/invite/def456', status: 'used', created: '2023-04-20' },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Invite Links</CardTitle>
                <CardDescription>Share these links to invite others</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {invites.map(invite => (
                        <div key={invite.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                                <Link className="text-primary" size={20} />
                                <div>
                                    <p className="font-medium">{invite.link}</p>
                                    <p className="text-xs text-muted-foreground">Created: {invite.created}</p>
                                </div>
                            </div>
                            <Badge variant={invite.status === 'active' ? 'default' : 'outline'}>
                                {invite.status}
                            </Badge>
                        </div>
                    ))}
                    
                    {invites.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No invite links available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const PaymentHistory = () => {
    // Mock data
    const payments = [
        { id: 1, amount: 99.99, plan: '3-Month Plan', date: '2023-06-01', status: 'completed' },
        { id: 2, amount: 49.99, plan: '1-Month Plan', date: '2023-03-01', status: 'completed' },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Record of your payments</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {payments.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-primary" size={20} />
                                <div>
                                    <p className="font-medium">${payment.amount} - {payment.plan}</p>
                                    <p className="text-xs text-muted-foreground">Date: {payment.date}</p>
                                </div>
                            </div>
                            <Badge variant={payment.status === 'completed' ? 'default' : 'outline'}>
                                {payment.status}
                            </Badge>
                        </div>
                    ))}
                    
                    {payments.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No payment history available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const Income = () => {
    // Mock data
    const earnings = [
        { id: 1, amount: 25.00, source: 'Referral Bonus', date: '2023-06-15', status: 'paid' },
        { id: 2, amount: 15.00, source: 'Affiliate Commission', date: '2023-05-30', status: 'pending' },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Income</CardTitle>
                <CardDescription>Your earnings and commissions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {earnings.map(earning => (
                        <div key={earning.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-primary" size={20} />
                                <div>
                                    <p className="font-medium">${earning.amount} - {earning.source}</p>
                                    <p className="text-xs text-muted-foreground">Date: {earning.date}</p>
                                </div>
                            </div>
                            <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                                {earning.status}
                            </Badge>
                        </div>
                    ))}
                    
                    {earnings.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No income records available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const ActivePlan = () => {
    // Mock data
    const plan = {
        name: '3-Month Weight Loss Plan',
        startDate: '2023-05-01',
        endDate: '2023-08-01',
        progress: '45%',
        status: 'active'
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Active Plan</CardTitle>
                <CardDescription>Your current fitness plan</CardDescription>
            </CardHeader>
            <CardContent>
                {plan ? (
                    <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-lg">{plan.name}</h3>
                                <Badge>{plan.status}</Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Duration: </span>
                                    {plan.startDate} to {plan.endDate}
                                </p>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{plan.progress}</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-primary h-full rounded-full" 
                                            style={{ width: plan.progress }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No active plan</p>
                )}
            </CardContent>
        </Card>
    );
};

const MyProfile = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-8 px-4"
        >
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <User className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">My Profile</h1>
                </div>
                
                <ProfileInfo />
                
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="invite-links">Invite Links</TabsTrigger>
                        <TabsTrigger value="payment-history">Payment History</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="active-plan">Active Plan</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="mt-6">
                        <ProfileInfo />
                    </TabsContent>
                    
                    <TabsContent value="invite-links" className="mt-6">
                        <InviteLinks />
                    </TabsContent>
                    
                    <TabsContent value="payment-history" className="mt-6">
                        <PaymentHistory />
                    </TabsContent>
                    
                    <TabsContent value="income" className="mt-6">
                        <Income />
                    </TabsContent>
                    
                    <TabsContent value="active-plan" className="mt-6">
                        <ActivePlan />
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    );
};

export default MyProfile;