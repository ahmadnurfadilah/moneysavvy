"use client";

import { useUserStore } from "@/lib/store";
import { shortDid } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChevronDown, Copy, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export default function AuthdUser() {
  const user = useUserStore((state) => state.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar className="w-9 h-9">
          <AvatarImage src={`https://source.boringavatars.com/beam/120/${user?.did}?colors=75F862,FFF480,FF6B00`} />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <ChevronDown className="w-4 h-4 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{shortDid(user?.did)}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CopyToClipboard text={user?.did} onCopy={() => toast.success("Copied!")}>
          <DropdownMenuItem className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            <span className="text-sm text-black/70 font-medium">Copy My DID</span>
          </DropdownMenuItem>
        </CopyToClipboard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
