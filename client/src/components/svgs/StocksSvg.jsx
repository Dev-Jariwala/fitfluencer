import { Avatar, AvatarImage } from '../ui/avatar'

const StocksSvg = () => {
    return (
        <Avatar className="tw-w-6 tw-h-6 tw-rounded-none">
            <AvatarImage src={`/sidebar/stocks.svg`} />
        </Avatar>
    )
}

export default StocksSvg