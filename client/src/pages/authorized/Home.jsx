import React from 'react'
import { motion } from 'framer-motion'
import Plans from '@/components/home/Plans'
const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
        >
            <Plans />
        </motion.div>
    )
}

export default Home