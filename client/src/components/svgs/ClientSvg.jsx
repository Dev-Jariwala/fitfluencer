import { Avatar, AvatarImage } from '../ui/avatar'

const ClientSvg = () => {
    return (
        <Avatar className="tw-w-6 tw-h-6 tw-rounded-none">
            <AvatarImage src={`/sidebar/clients.svg`} />
        </Avatar>
    )
}

export default ClientSvg