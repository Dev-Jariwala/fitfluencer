import React, { useState } from 'react'
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import FeatureItem from './FeatureItem';

const PricingCard = ({ id, name, description, price, offer_price, months, points, isPopular, delay, handlePaynow, }) => {
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

export default PricingCard