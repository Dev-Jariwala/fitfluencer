import React from 'react';
import { MapPinIcon, HomeIcon, BuildingIcon, GlobeIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import StepWrapper from './StepWrapper';

const AddressStep = ({ form, animationDirection }) => {
  return (
    <StepWrapper 
      title="Address Information"
      description="Your location details"
      icon={<MapPinIcon className="w-6 h-6" />}
      animationDirection={animationDirection}
      stepKey="address"
    >
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <HomeIcon className="h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="123 Fitness Street"
                    {...field}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <BuildingIcon className="h-4 w-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="New York"
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <GlobeIcon className="h-4 w-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="New York"
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
      </div>
    </StepWrapper>
  );
};

export default AddressStep; 