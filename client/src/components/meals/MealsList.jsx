import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Services
import { getMeals } from '@/services/mealsService';

// Custom Components
import MealsTableView from './MealsTableView';
import MealsGridView from './MealsGridView';
import MealFormDialog from './MealFormDialog';
import DeleteMealDialog from './DeleteMealDialog';

const MealsList = () => {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingMeal, setDeletingMeal] = useState(null);
    const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'

    // Fetch meals data
    const { data: mealsData, isLoading, isError, error } = useQuery({
        queryKey: ['meals'],
        queryFn: getMeals,
    });

    const meals = mealsData?.data || [];

    // Handle editing a meal
    const handleEdit = (meal) => {
        setEditingMeal(meal);
        setIsFormDialogOpen(true);
    };

    // Handle adding a new meal
    const handleAddNew = () => {
        setEditingMeal(null);
        setIsFormDialogOpen(true);
    };

    // Handle deleting a meal
    const handleDelete = (meal) => {
        setDeletingMeal(meal);
        setIsDeleteDialogOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto p-6">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Meals</CardTitle>
                            <CardDescription>
                                Manage your meal options and nutrition information
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search meals..."
                                    className="pl-8 w-[250px]"
                                    value={globalFilter || ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleAddNew} className="flex items-center gap-1">
                                <PlusCircle className="h-4 w-4 mr-1" />
                                Add Meal
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="grid" value={viewType} onValueChange={setViewType} className="mb-6">
                            <TabsList className="grid w-[200px] grid-cols-2">
                                <TabsTrigger value="grid">Grid</TabsTrigger>
                                <TabsTrigger value="table">Table</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : isError ? (
                            <div className="text-center p-8 text-red-500">
                                Error loading meals. Please try again.
                                {JSON.stringify(error)}
                            </div>
                        ) : (
                            <div>
                                {viewType === 'table' ? (
                                    <MealsTableView 
                                        meals={meals} 
                                        globalFilter={globalFilter}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <MealsGridView 
                                        meals={meals} 
                                        globalFilter={globalFilter}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Meal Form Dialog */}
            <MealFormDialog 
                open={isFormDialogOpen} 
                onOpenChange={setIsFormDialogOpen}
                editingMeal={editingMeal}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteMealDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                deletingMeal={deletingMeal}
            />
        </motion.div>
    );
};

export default MealsList; 