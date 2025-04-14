import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import FormatPrice from '@/components/common/FormatPrice'
import { CreditCard, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react'

const PaymentSummary = ({ paymentHistory }) => {
    // Calculate payment statistics
    const calculateStats = () => {
        if (!paymentHistory || paymentHistory.length === 0) {
            return { total: 0, successful: 0, pending: 0, failed: 0 }
        }
        
        const total = paymentHistory.reduce((sum, payment) => {
            return sum + parseFloat(payment.amount || 0)
        }, 0)
        
        const successful = paymentHistory.filter(payment => payment.status === 'captured').length
        const pending = paymentHistory.filter(payment => payment.status === 'created').length
        const failed = paymentHistory.filter(payment => payment.status === 'failed').length
        
        return { total, successful, pending, failed }
    }
    
    const stats = calculateStats()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-full">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Payments</div>
                            <div className="text-2xl font-bold mt-1">{paymentHistory?.length || 0}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        All transactions
                    </div>
                </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-l-4 border-l-emerald-500 shadow-sm hover:shadow transition-all duration-200 py-0">
                <CardContent className="p-0">
                    <div className="flex items-start p-4">
                        <div className="mr-4 bg-emerald-100 p-3 rounded-full">
                            <Wallet className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                            <div className="text-2xl font-bold mt-1">
                                <FormatPrice price={stats.total} showRupee={true} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Cumulative value
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
                            <div className="text-sm font-medium text-muted-foreground">Successful</div>
                            <div className="text-2xl font-bold mt-1 text-green-600">{stats.successful}</div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Completed payments
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
                            <div className="text-sm font-medium text-muted-foreground">Failed/Pending</div>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold mt-1 text-amber-600">{stats.failed + stats.pending}</div>
                                {stats.pending > 0 && (
                                    <div className="text-xs text-muted-foreground flex items-center mb-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {stats.pending} pending
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Unsuccessful attempts
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentSummary