import { Avatar, AvatarImage } from '../ui/avatar'

const ProductSvg = () => {
    return (
        <Avatar className="tw-w-6 tw-h-6 tw-rounded-none">
            <AvatarImage src={`/sidebar/products.svg`} />
        </Avatar>

    )
}

export default ProductSvg