import React from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Services
import { deleteMeal } from '@/services/mealsService';

const DeleteMealDialog = ({ open, onOpenChange, deletingMeal }) => {
    const queryClient = useQueryClient();

    // Delete meal mutation
    const deleteMealMutation = useMutation({
        mutationFn: (id) => deleteMeal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
            onOpenChange(false);
            toast.success('Meal deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete meal: ${error.message}`);
        },
    });

    // Handle confirm delete
    const confirmDelete = () => {
        if (deletingMeal) {
            deleteMealMutation.mutate(deletingMeal.id);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the meal
                        <span className="font-semibold"> {deletingMeal?.name}</span> and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={confirmDelete}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {deleteMealMutation.isPending ? (
                            <div className="flex items-center">
                                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                Deleting...
                            </div>
                        ) : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMealDialog; 