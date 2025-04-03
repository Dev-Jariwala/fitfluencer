import { Avatar, AvatarImage } from "../ui/avatar";

const CollectionsSvg = () => {
    return (
        <Avatar className="tw-w-6 tw-h-6 tw-rounded-none">
            <AvatarImage src={`/sidebar/collections.svg`} />
        </Avatar>
    );
};

export default CollectionsSvg;
