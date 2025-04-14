import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react'

const InviteSummary = ({ inviteLinksHistory }) => {
    // Calculate invite statistics
    const calculateStats = () => {
        if (!inviteLinksHistory || inviteLinksHistory.length === 0) {
            return { total: 0, active: 0, used: 0, expired: 0 }
        }
        
        const total = inviteLinksHistory.length
        const now = new Date()
        
        const active = inviteLinksHistory.filter(invite => 
            !invite.is_consumed && new Date(invite.expires_at) > now
        ).length
        
        const used = inviteLinksHistory.filter(invite => 
            invite.is_consumed
        ).length
        
        const expired = inviteLinksHistory.filter(invite => 
            !invite.is_consumed && new Date(invite.expires_at) <= now
        ).length
        
        return { total, active, used, expired }
    }
    
    const stats = calculateStats()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-full">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Invites</div>
                            <div className="text-2xl font-bold mt-1">{stats.total}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        All invitations sent
                    </div>
                </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Used Invites</div>
                            <div className="text-2xl font-bold mt-1 text-green-600">{stats.used}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Successfully registered users
                    </div>
                </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-full">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Active Invites</div>
                            <div className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Available for registration
                    </div>
                </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-amber-100 p-3 rounded-full">
                            <XCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Expired</div>
                            <div className="text-2xl font-bold mt-1 text-amber-600">{stats.expired}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Unused and expired
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default InviteSummary 