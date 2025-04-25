import React from 'react'
import IncomeTable from './components/IncomeTable'
import { useAuthStore } from '@/store/commonStore';

const IncomePage = () => {
    const user = useAuthStore((state) => state.data);
    return (
        <div className="space-y-6 px-5 pb-10 pt-5">
            {/* Page Header */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Income</h2>
            </div> */}
            <IncomeTable />
        </div>
    )
}

export default IncomePage