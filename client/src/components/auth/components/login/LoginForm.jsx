import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/commonStore'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/services/userService'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const createLoginSchema = (loginMethod) => z.object({
    loginId: loginMethod === 'email'
        ? z.string().email({ message: 'Please enter a valid email address' })
        : z.string().regex(/^[0-9]{10}$/, { message: 'Please enter a valid 10-digit mobile number' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

const LoginForm = ({ loginMethod }) => {
    const [showPassword, setShowPassword] = useState(false);
    const setToken = useAuthStore(state => state.setToken);
    const setData = useAuthStore(state => state.setData);
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(createLoginSchema(loginMethod)),
        defaultValues: {
            loginId: '',
            password: '',
        },
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (res) => {
            toast.success(res?.data?.message || "Login successful");
            setToken(res?.data?.token || null);
            setData(res?.data?.data || null);
            // navigate('/', { replace: true });
            window.location.href = '/';
        },
        onError: (error) => {
            toast.error(`Error logging in: ${JSON.stringify(error)}`);
        }
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };
    return (
        <>
            {/* Login Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    <FormField
                        control={form.control}
                        name="loginId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Input
                                            className="w-full px-4 py-5 pl-12 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                            placeholder={loginMethod === 'email' ? 'Enter your email address' : 'Enter your mobile number'}
                                            {...field} />
                                        {loginMethod === 'email' ? <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" /> : <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full px-4 py-5 pl-12 pr-12 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-3 rounded-lg shadow-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Don't have an account?{' '}
                            <a href="#" className="text-emerald-500 hover:text-emerald-600 font-medium">
                                Create account
                            </a>
                        </p>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default LoginForm