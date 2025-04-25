import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { getInitials, getUniqueColor, getUserSrNo } from "@/utils/helper"

export function AvatarStack({ users = [], maxAvatars = 3, size = "md", className }) {
    if (!users.length) return null

    const visibleUsers = users?.slice(0, maxAvatars) || []
    const remainingCount = users?.length - maxAvatars || 0

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    }

    return (
        <HoverCard>
            <HoverCardTrigger>
                <div className={cn("flex items-center", className)}>
                    {visibleUsers?.map((user, index) => {
                        const srNo = getUserSrNo(user?.username);
                        const uniqueColor = getUniqueColor(srNo);
                        console.log(uniqueColor);
                        return (
                            <Avatar
                                key={user?.id || index}
                                className={cn(
                                    sizeClasses[size],
                                    "ring-2 ring-background",
                                    index > 0 && "-ml-2",
                                    "transition-transform hover:z-10 hover:-translate-y-1 border-none outline-none",
                                )}
                            >
                                <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.username} />
                                <AvatarFallback className={cn("text-foreground/80")} style={{ background: `${uniqueColor}90`, border: `1px solid ${uniqueColor}` }}>{getInitials(user?.username)}</AvatarFallback>
                            </Avatar>
                        )
                    })}

                    {remainingCount > 0 && (
                        <Avatar
                            className={cn(
                                sizeClasses[size],
                                "ring-2 ring-background",
                                "-ml-2",
                                "transition-transform hover:z-10 hover:-translate-y-1",
                            )}
                        >
                            <AvatarFallback className={cn("text-foreground/80 bg-sky-500/30 border-[1px] border-blue-500")}>+{remainingCount}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Team Members ({users?.length})</h4>
                    <div className="max-h-[300px] overflow-y-auto">
                        {users?.map((user) => {
                            const srNo = getUserSrNo(user?.username);
                            const uniqueColor = getUniqueColor(srNo);
                            return (
                                <div key={user?.id} className="flex items-center gap-2 py-1">
                                    <Avatar className={cn(sizeClasses[size])}>
                                        <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.username} />
                                        <AvatarFallback className={cn("text-foreground/80")} style={{ background: `${uniqueColor}90`, border: `1px solid ${uniqueColor}` }}>{getInitials(user?.username)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                                        {/* {user?.email && <p className="text-xs text-muted-foreground">{user?.email}</p>} */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
