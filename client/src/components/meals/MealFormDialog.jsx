import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Services
import { createMeal, updateMeal } from '@/services/mealsService';

// Form validation schema
const mealSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }).optional(),
    quantity: z.coerce.number().positive({ message: 'Quantity must be positive' }),
    unit: z.string().min(1, { message: 'Please select a unit' }),
    calories: z.coerce.number().int().positive({ message: 'Calories must be a positive integer' }),
    protein: z.coerce.number().positive({ message: 'Protein must be positive' }),
    carbs: z.coerce.number().positive({ message: 'Carbs must be positive' }),
    fat: z.coerce.number().positive({ message: 'Fat must be positive' }),
    attachment: z.instanceof(File).optional(),
});

const MealFormDialog = ({ open, onOpenChange, editingMeal }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const queryClient = useQueryClient();

    // Form setup
    const form = useForm({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: '',
            description: '',
            quantity: '',
            unit: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            attachment: undefined,
        },
    });

    // Reset form when dialog changes or editing meal changes
    useEffect(() => {
        if (open) {
            if (editingMeal) {
                form.reset({
                    name: editingMeal.name,
                    description: editingMeal.description || '',
                    quantity: editingMeal.quantity,
                    unit: editingMeal.unit,
                    calories: editingMeal.calories,
                    protein: editingMeal.protein,
                    carbs: editingMeal.carbs,
                    fat: editingMeal.fat,
                });

                if (editingMeal.attachment) {
                    setImagePreview(editingMeal.attachment);
                }
            } else {
                form.reset({
                    name: '',
                    description: '',
                    quantity: '',
                    unit: '',
                    calories: '',
                    protein: '',
                    carbs: '',
                    fat: '',
                    attachment: undefined,
                });
                setImagePreview(null);
            }
        }
    }, [open, editingMeal, form]);

    // Create meal mutation
    const createMealMutation = useMutation({
        mutationFn: (data) => createMeal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
            onOpenChange(false);
            toast.success('Meal created successfully');
        },
        onError: (error) => {
            toast.error(`Failed to create meal: ${error.message}`);
        },
    });

    // Update meal mutation
    const updateMealMutation = useMutation({
        mutationFn: ({ id, data }) => updateMeal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
            onOpenChange(false);
            toast.success('Meal updated successfully');
        },
        onError: (error) => {
            toast.error(`Failed to update meal: ${error.message}`);
        },
    });

    // Handle form submission
    const onSubmit = (data) => {
        const formData = new FormData();

        // Add all form fields to FormData
        Object.keys(data).forEach(key => {
            if (key === 'attachment' && data[key]) {
                formData.append(key, data[key]);
            } else if (key !== 'attachment') {
                formData.append(key, data[key]);
            }
        });

        if (editingMeal) {
            updateMealMutation.mutate({ id: editingMeal.id, data: formData });
        } else {
            createMealMutation.mutate(formData);
        }
    };

    // Handle image file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setValue('attachment', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const isPending = createMealMutation.isPending || updateMealMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Grilled Chicken Breast" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="g">Grams (g)</SelectItem>
                                                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                                                    <SelectItem value="cup">Cup</SelectItem>
                                                    <SelectItem value="piece">Piece</SelectItem>
                                                    <SelectItem value="serving">Serving</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the meal..."
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="calories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Calories (kcal)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="250" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="protein"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Protein (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="20" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="carbs"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Carbs (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="fat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fat (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="5" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Meal Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="meal-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full max-w-xs"
                                />
                                {imagePreview && (
                                    <div className="relative w-20 h-20">
                                        <img
                                            src={imagePreview}
                                            alt="Meal preview"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            onClick={() => {
                                                setImagePreview(null);
                                                form.setValue('attachment', undefined);
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    editingMeal ? 'Update Meal' : 'Add Meal'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MealFormDialog; 