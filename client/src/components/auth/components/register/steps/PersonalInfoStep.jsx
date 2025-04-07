import React from 'react';
import { UserIcon, PhoneIcon, AtSignIcon, CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StepWrapper from './StepWrapper';

const PersonalInfoStep = ({ form, animationDirection }) => {
  return (
    <StepWrapper 
      title="Personal Information"
      description="Enter your basic personal details"
      icon={<UserIcon className="w-6 h-6" />}
      animationDirection={animationDirection}
      stepKey="personal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Doe"
                  {...field}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  {...field}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
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
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <PhoneIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="1234567890"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <AtSignIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </FormControl>
              </div>
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
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
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
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    type="date"
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

export default PersonalInfoStep; 