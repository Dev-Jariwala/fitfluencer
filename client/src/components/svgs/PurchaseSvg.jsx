import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'

const PurchaseSvg = () => {
    return (
        <Avatar className="tw-w-6 tw-h-6 tw-rounded-none">
            <AvatarImage src={`/sidebar/purchases.svg`} />
        </Avatar>

    )
}

export default PurchaseSvg