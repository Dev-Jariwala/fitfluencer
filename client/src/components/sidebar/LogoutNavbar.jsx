import { AiOutlineMenu } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import Theme from "../ui/theme/theme";
import { Button } from "../ui/button";
import { logoutUser } from "@/services/userService";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/commonStore";

const LogoutNavbar = () => {
    const logout = useAuthStore(state => state.logout);
    const logoutUserMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: (data) => {
            toast.success(data?.data?.message || 'Logout successful');
            logout();
            window.location.href = '/login';
            return
        },
        onError: (error) => {
            toast.error(`Error logging out: ${JSON.stringify(error)}`);
        }
    })
    return (
        <div className="bg-background sticky z-10 top-0 left-0 border-b border-muted h-16 flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
            </div>
            <div className="flex items-center space-x-3">
                <Theme />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="">
                            <AvatarImage src="/logo.png" />
                            <AvatarFallback className='border border-input bg-background hover:bg-accent hover:text-accent-foreground' >DA</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => logoutUserMutation.mutate()} >Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default LogoutNavbar;