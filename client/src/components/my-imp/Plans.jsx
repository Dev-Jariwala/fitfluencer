import { getPlans } from '@/services/plansService';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight, Check, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClientPayment, verifyClientPayment } from '@/services/clientPaymentsService';

const Plans = () => {
    const { data: plans, isLoading: isPlansLoading, error: plansError } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const data = await getPlans();
            return data;
        }
    });

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(false);
            document.body.appendChild(script);
        });
    }
    const verifyClientPaymentMutation = useMutation({
        mutationFn: verifyClientPayment,
        onSuccess: (data) => {
            console.log(data);
            if (data.success) {
                toast.success('Payment verified successfully');
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message);
        }
    })

    const createClientPaymentMutation = useMutation({
        mutationFn: createClientPayment,
        onSuccess: (data) => {
            console.log(data);
            const paymentObject = new window.Razorpay({
                key: 'rzp_test_DHUBFnivFtHLhP',
                order_id: data.id,
                ...data,
                handler: (response) => {
                    console.log(response);
                    const otption2 = {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    }
                    verifyClientPaymentMutation.mutate(otption2);
                }
            });
            paymentObject.open();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message);
        }
    })

    const handlePaynow = (planId) => {
        createClientPaymentMutation.mutate({
            plan_id: planId,
        })
    }

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }, []);

    useEffect(() => {
        if (plansError) {
            toast.error(plansError.message);
        }
    }, [plansError]);


    return (
        <section className="py-16 md:py-24" id="plans">
            <div className="container">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-4 inline-block">
                        <motion.div
                            className="px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium text-sm"
                            animate={{
                                scale: [1, 1.03, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Zap className="w-4 h-4 inline-block mr-2" />
                            Find Your Perfect Plan
                        </motion.div>
                    </div>

                    <motion.h2
                        className="text-3xl sm:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        Simple, Transparent Pricing
                    </motion.h2>

                    <motion.p
                        className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Choose the perfect plan for your fitness journey and transform your life with expert guidance.
                    </motion.p>
                </motion.div>

                {isPlansLoading ? <div className="flex justify-center items-center h-64">
                    <div className="basic-loader"></div>
                </div> : <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans && plans.length > 0 ? plans?.sort((a, b) => a.offer_price - b.offer_price).map((plan, i) => (
                        <PricingCard key={i} {...plan} handlePaynow={handlePaynow} />
                    )) : <div className="flex justify-center items-center h-64">
                        <div className="">No plans found</div>
                    </div>}
                </div>}
            </div>
        </section>
    )
}

const PricingCard = ({
    id,
    name,
    description,
    price,
    offer_price,
    months,
    points,
    isPopular,
    delay,
    handlePaynow,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card className={`relative overflow-hidden transition-all duration-300 h-full ${isPopular ? 'border-emerald-500 shadow-lg' : ''} ${isHovered ? 'shadow-xl' : 'shadow'}`}>
                {isPopular && (
                    <motion.div
                        className="absolute top-0 right-0"
                        animate={{
                            scale: isHovered ? [1, 1.05, 1] : 1,
                        }}
                        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                    >
                        <Badge className="rounded-tl-none rounded-br-none bg-emerald-500 text-white">Most Popular</Badge>
                    </motion.div>
                )}
                <CardHeader className="pb-8 relative">
                    <CardTitle className="text-xl">{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    <div className="mt-4">
                        {price !== offer_price && (
                            <span className="text-slate-600 dark:text-slate-400 line-through mr-2">₹{Number(price).toFixed(0)}</span>
                        )}
                        <motion.span
                            className="text-4xl font-bold"
                            animate={{
                                color: isHovered && isPopular ? ["#10b981", "#0ea5e9", "#10b981"] : "#000000"
                            }}
                            transition={{ duration: 2, repeat: isHovered && isPopular ? Infinity : 0 }}
                        >
                            ₹{Number(offer_price).toFixed(0)}
                        </motion.span>
                        <span className="text-slate-600 dark:text-slate-400 ml-1">/ {months > 1 ? `${months} months` : `month`}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {points.map((point, i) => (
                            <FeatureItem key={i} feature={point} delay={delay + (i * 0.05)} />
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <motion.div
                        className="w-full"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button asChild className={`w-full ${isPopular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`} onClick={() => handlePaynow(id)}>
                            <div>
                                Pay Now
                                <motion.div
                                    className="ml-2"
                                    animate={{
                                        x: isHovered ? [0, 4, 0] : 0
                                    }}
                                    transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </motion.div>
                            </div>
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

const FeatureItem = ({ feature, delay }) => {
    return (
        <motion.li
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay }}
        >
            <motion.div
                whileHover={{ scale: 1.1, rotate: [0, 5, 0] }}
            >
                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            </motion.div>
            <span>{feature}</span>
        </motion.li>
    );
};

export default Plans