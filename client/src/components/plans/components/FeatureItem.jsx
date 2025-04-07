import { motion } from 'motion/react';
import { Check } from 'lucide-react';

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
export default FeatureItem