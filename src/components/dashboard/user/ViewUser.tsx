"use client";

import { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/user";

function UserAction({ user }: { user: User }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="text-white hover:text-[#C9A94D]" onClick={() => setOpen(true)}>
                <Eye className="h-5 w-5" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#2D3546] text-white border border-[#C9A94D] rounded-lg max-w-sm p-0 userdetails">
                    <DialogHeader className="border-b border-[#C9A94D] p-4">
                        <DialogTitle className="text-[#C9A94D] text-lg font-semibold flex items-center justify-between">
                            <h1>Result</h1>
                            <p>Host</p>
                            <MessageCircle />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-2 text-sm text-[#C9A94D] p-4">
                        <div>{user.name}</div>
                        <div>
                            <span>Email:</span> {user.email}
                        </div>
                        <div>
                            <span>Phone:</span> {user.phone}
                        </div>
                        <div>
                            <span>Booking:</span> $4
                        </div>
                        <div>
                            <span>Message:</span> $4
                        </div>
                        <div>
                            <span>Earning:</span> $4
                        </div>
                        <div>
                            <span>Guest Fees Spent:</span> $4
                        </div>
                    </div>

                    {/* Bottom custom close button */}
                    <div className="text-right p-4">
                        <button className="px-4 py-2 bg-[#C9A94D] text-white rounded hover:bg-[#af8d28]" onClick={() => setOpen(false)}>
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UserAction;
