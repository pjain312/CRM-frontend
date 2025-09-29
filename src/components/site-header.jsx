import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../lib/nav-data";
import axios from "axios";
import { clearTokens, getRefreshToken } from "../utils/auth";
import { toast } from "sonner";

export function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = data.navMain.find((item) => item.url === pathname);
  const logout = async () =>{
    const refreshToken = getRefreshToken();
    await axios.post('http://localhost:9005/auth/logout', {refreshToken});
    clearTokens()
    navigate("/login");
    toast.success("Logout successful!")
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{page?.title || "Dashboard"}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button className="cursor-pointer">Admin</Button>
          <Button className="cursor-pointer" onClick={logout}>Log out</Button>
        </div>
      </div>
    </header>
  );
}
