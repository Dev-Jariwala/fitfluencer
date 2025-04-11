import React from 'react';
import { KeyIcon, UserIcon, PhoneIcon, ShieldIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import StepWrapper from './StepWrapper';

const AccountInfoStep = ({ form, animationDirection }) => {
  return (
    <StepWrapper
      title="Account Information"
      description="Create your account credentials"
      icon={<KeyIcon className="w-6 h-6" />}
      animationDirection={animationDirection}
      stepKey="account"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="johndoe"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Your unique username for logging in
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 bg-accent" >
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="1234567890"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <ShieldIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </FormControl>
              </div>
              <FormDescription>
                Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <ShieldIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </StepWrapper>
  );
};

export default AccountInfoStep; 