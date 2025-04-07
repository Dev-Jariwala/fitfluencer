import React from 'react'
import LogoutNavbar from './LogoutNavbar'

const LogoutLayout = ({ children }) => {
    return (
        <div className='flex flex-col relative w-full h-[100dvh] overflow-hidden'>
            <LogoutNavbar />
            <main className=" flex-1 overflow-y-auto h-[calc(100dvh-4rem)]">
                {children}
            </main>
        </div>
    )
}

export default LogoutLayout