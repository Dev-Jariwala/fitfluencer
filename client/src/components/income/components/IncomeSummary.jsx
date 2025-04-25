import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import FormatPrice from '@/components/common/FormatPrice'
import { CircleDollarSign, Users, TrendingUp, Landmark, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/store/commonStore'
import { cn } from '@/lib/utils'

const IncomeSummary = ({ incomeSummary }) => {
    const user = useAuthStore((state) => state.data);
    return (
        <div className={cn("grid sm:grid-cols-2 lg:grid-cols-5 gap-4", user?.role !== 'admin' && 'lg:grid-cols-4')}>
            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-full">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Clients</div>
                            <div className="text-2xl font-bold mt-1">{incomeSummary.totalClients || 0}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Paying clients
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-emerald-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-emerald-100 p-3 rounded-full">
                            <CircleDollarSign className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Payments</div>
                            <div className="text-2xl font-bold mt-1">
                                <FormatPrice price={incomeSummary.totalIncome || 0} showRupee={true} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Total payment value
                    </div>
                </CardContent>
            </Card>

            {user?.role === 'admin' && <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-purple-100 p-3 rounded-full">
                            <Landmark className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Fee</div>
                            <div className="text-2xl font-bold mt-1">
                                <FormatPrice price={incomeSummary.totalFee || 0} showRupee={true} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Platform fees
                    </div>
                </CardContent>
            </Card>}

            <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-green-100 p-3 rounded-full">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Your Income</div>
                            <div className="text-2xl font-bold mt-1 text-green-600">
                                <FormatPrice price={incomeSummary.personalIncome || 0} showRupee={true} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Personal earnings
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-amber-100 p-3 rounded-full">
                            <BarChart3 className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Downline Income</div>
                            <div className="text-2xl font-bold mt-1 text-amber-600">
                                <FormatPrice price={incomeSummary.downlineIncome || 0} showRupee={true} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Team earnings
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default IncomeSummary 