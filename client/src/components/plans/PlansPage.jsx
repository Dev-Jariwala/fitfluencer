import { getPlans } from '@/services/plansService';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { createClientPayment, verifyClientPayment } from '@/services/clientPaymentsService';
import PricingCard from './components/PricingCard';
import { usePlansStore } from '@/store/commonStore';

const Plans = () => {
    const plans = usePlansStore(state => state.plans);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(false);
            document.body.appendChild(script);
        });
    }

    const createClientPaymentMutation = useMutation({
        mutationFn: createClientPayment,
        onSuccess: (data) => {
            const paymentObject = new window.Razorpay({
                key: 'rzp_test_j4omQ2EqVnTtIh',
                order_id: data.id,
                ...data,

                handler: (response) => {
                    console.log(response);
                    setTimeout(() => window.location.href = '/', 500);
                }
            });
            paymentObject.open();
        },
        onError: (error) => {
            toast.error(`Error creating payment: ${JSON.stringify(error)}`);
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

    return (
        <section className="py-0" id="plans">
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

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans && plans.length > 0 ? plans?.sort((a, b) => a.offer_price - b.offer_price).map((plan, i) => (
                        <PricingCard key={i} {...plan} handlePaynow={handlePaynow} />
                    )) : <div className="flex justify-center items-center h-64">
                        <div className="">No plans found</div>
                    </div>}
                </div>
            </div>
        </section>
    )
}

export default Plans