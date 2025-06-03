import * as React from "react"
import { ChevronRight, CreditCard, Fingerprint, KeyRound, LayoutDashboard, ListTodo, MessageCircle, Soup, UserPlus } from 'lucide-react';
import { Sidebar as SidebarComponent, SidebarContent, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/sidebar/Navbar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import { MdGroups } from "react-icons/md";
import { useAuthStore } from "@/store/commonStore";

const data = {
    navMain: [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            className: 'text-pink-500',
            link: '/',
            isCollapsible: false,
            forRoles: ['admin', 'dietitian', 'client']
        },
        {
            title: 'Payment History',
            icon: CreditCard,
            className: 'text-fuchsia-500',
            link: '/payment-history',
            isCollapsible: false,
            forRoles: ['client']
        },
        {
            title: 'Invite Links',
            icon: UserPlus,
            className: 'text-blue-500',
            link: '/invite-links',
            isCollapsible: false,
            forRoles: ['admin', 'dietitian']
        },
        {
            title: 'Team',
            icon: MdGroups,
            className: 'text-orange-500 size-6',
            link: '/team',
            isCollapsible: false,
            forRoles: ['admin', 'dietitian']
        },
        {
            title: 'Income',
            icon: CreditCard,
            className: 'text-fuchsia-500',
            link: '/income',
            isCollapsible: false,
            forRoles: ['admin', 'dietitian']
        },
        {
            title: 'Meals',
            icon: Soup,
            className: 'text-green-100',
            link: '/meals',
            isCollapsible: false,
            forRoles: ['admin']
        }
    ]
}
const Sidebar = () => {

    const user = useAuthStore(state => state.data);

    const filteredData = React.useMemo(() => {
        const result = { navMain: [] };
        const filteredNavMain = data.navMain.filter(item => {
            if (item.forRoles.includes(user?.role?.key)) {
                result.navMain.push(item);
            }
            return false;
        })
        return result;
    }, [user]);

    const location = useLocation()

    const isActive = (link) => {
        return location.pathname.split('/')[1] === link.split('/')[1]
    }

    const isActiveSubMenu = (link) => {
        return location.pathname.split('/')[2] === link.split('/')[2]
    }

    return (
        <SidebarProvider>
            <SidebarComponent className='shadow-xl' collapsible="icon" style={{ fontFamily: 'Nunito, "Segoe UI", arial' }} >
                <SidebarHeader className="mb-3">
                    <SidebarMenu>
                        <SidebarMenuItem asChild>
                            <Link className="flex items-center justify-center gap-1 rounded-lg h-12 cursor-pointer">
                                <Avatar>
                                    <AvatarImage src="/logo.png" />
                                </Avatar>
                                <div className="group-data-[collapsible=icon]:hidden">
                                    <div className={`font-semibold text-2xl`}>
                                        <span className="text-secondary">Fit</span>
                                        <span className="text-primary">Fluencer</span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu className="space-y-2">
                            {filteredData.navMain.map((item) => (
                                <React.Fragment key={item.title}>
                                    {item.isCollapsible ? (
                                        <Collapsible asChild defaultOpen={isActive(item.link)} className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={item.title} isActive={isActive(item.link)}>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items?.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={isActiveSubMenu(subItem.link)} aria-disabled={subItem.isDisabled}>
                                                                    <Link className="no-underline" to={subItem.link}>
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive(item.link)}
                                                tooltip={item.title}
                                                className="group-data-[collapsible=icon]:h-10! group-data-[collapsible=icon]:w-12!"
                                            >
                                                <Link className={cn("no-underline text-inherit !h-10", isActive(item.link) ? '!bg-primary !text-primary-foreground' : 'hover:!bg-primary/10')} to={item.link}>
                                                    <span className="mx-1">
                                                        {item.icon && <item.icon className={item.className} />}
                                                    </span>
                                                    <span className=" animate-fade animate-duration-300">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )}
                                </React.Fragment>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </SidebarComponent>
            <SidebarInset className='flex flex-col relative w-full h-[100dvh] overflow-hidden'>
                <Navbar />
                <main className=" flex-1 overflow-y-auto h-[calc(100dvh-4rem)]">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Sidebar