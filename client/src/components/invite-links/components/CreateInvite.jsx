import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRolesStore } from '@/store/commonStore'
import { useNavigate } from 'react-router-dom'

const CreateInvite = () => {
    const navigate = useNavigate();
    const roles = useRolesStore(state => state.roles);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        expiryDays: 7,
        roleId: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.roleId) {
            toast.error('Please select a role');
            return;
        }

        try {
            setIsLoading(true);
            // Here you would integrate with your API to create an invite
            // const response = await createInviteLink(formData);
            
            // For demo, let's simulate success:
            setTimeout(() => {
                toast.success('Invite link created successfully');
                setIsLoading(false);
                navigate('/invite-links');
            }, 1000);
        } catch (error) {
            console.error('Error creating invite link:', error);
            toast.error('Failed to create invite link');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create Invite Link</CardTitle>
                    <CardDescription>
                        Generate a new invitation link for users to join the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select 
                                value={formData.roleId} 
                                onValueChange={(value) => handleSelectChange('roleId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role for the invitee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles?.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Expiry (days)</label>
                            <Input 
                                type="number" 
                                name="expiryDays"
                                value={formData.expiryDays}
                                onChange={handleChange}
                                min={1}
                                max={365}
                            />
                            <p className="text-xs text-muted-foreground">
                                Number of days before this invite expires
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes (optional)</label>
                            <Input 
                                type="text" 
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add any notes about this invite"
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/invite-links')}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Create Invite
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CreateInvite 