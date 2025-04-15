import { useState } from "react";
import InviteLinksTable from "./components/InviteLinksTable";
import InviteLinkPage from "./invite-link/InviteLinkPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";


const InviteLinks = () => {
    const [invitingState, setInvitingState] = useState(false);
    return (
        <div className="space-y-6 px-5 pb-10 pt-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Invite Links</h2>
                <div className="flex flex-wrap items-center gap-2">
                    {invitingState ? (
                        <Button
                            variant="secondary-outline"
                            className="flex items-center gap-2 transition-all"
                            onClick={() => setInvitingState(false)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Invites
                        </Button>
                    ) : (
                        <Button
                            variant="secondary-outline"
                            className="flex items-center gap-2 transition-all"
                            onClick={() => setInvitingState(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Invite
                        </Button>
                    )}
                </div>
            </div>
            {invitingState ? <InviteLinkPage /> : <InviteLinksTable />}
        </div>
    )
}

export default InviteLinks