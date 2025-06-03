import React from 'react';
import { Pencil, Trash, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const MealsGridView = ({ meals, globalFilter, onEdit, onDelete }) => {
    // Filter meals based on global filter
    const filteredMeals = globalFilter
        ? meals.filter((meal) =>
            meal.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
            (meal.description && meal.description.toLowerCase().includes(globalFilter.toLowerCase()))
        )
        : meals;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMeals.length > 0 ? (
                filteredMeals.map((meal) => (
                    <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow py-0">
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                            {meal.attachment ? (
                                <img
                                    src={meal.attachment}
                                    alt={meal.name}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <div className="mb-3">
                                <h3 className="font-semibold text-lg truncate" title={meal.name}>{meal.name}</h3>
                                <p className="text-muted-foreground text-sm truncate" title={meal.description || 'No description'}>
                                    {meal.description || 'No description'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <p>{meal.quantity} {meal.unit}</p>
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Calories:</span>
                                    <p>{meal.calories} kcal</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">P: {meal.protein}g</Badge>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">C: {meal.carbs}g</Badge>
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">F: {meal.fat}g</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => onEdit(meal)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button variant="ghost" size="icon" title="View Details">
                                <Info className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(meal)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="col-span-full text-center p-8 text-muted-foreground">
                    No meals found. Try adjusting your search criteria.
                </div>
            )}
        </div>
    );
};

export default MealsGridView; 