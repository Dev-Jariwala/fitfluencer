import React from 'react';
import { MoveIcon, HeartIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StepWrapper from './StepWrapper';

const PhysicalStatsStep = ({ form, animationDirection }) => {
  return (
    <StepWrapper 
      title="Physical Statistics"
      description="Your physical measurements and goals"
      icon={<MoveIcon className="w-6 h-6" />}
      animationDirection={animationDirection}
      stepKey="physical"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="175"
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
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="70"
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
          name="fitnessGoal"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Fitness Goal</FormLabel>
              <div className="flex items-center space-x-2 mb-2">
                <HeartIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-gray-500">Select your primary fitness objective</span>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="endurance">Improve Endurance</SelectItem>
                  <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                  <SelectItem value="overall-fitness">Overall Fitness</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </StepWrapper>
  );
};

export default PhysicalStatsStep; 