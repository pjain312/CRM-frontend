import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import config from "../config/environment";
import { getNavData } from "../lib/nav-data";
import { clearTokens, getRefreshToken } from "../utils/auth";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = getNavData()?.find((item) => item.url === pathname);
  const logout = async () => {
    const refreshToken = getRefreshToken();
    await axios.post(`${config.api.baseURL}/auth/logout`, { refreshToken });
    clearTokens();
    navigate("/login");
    toast.success("Logout successful!");
  };
  const { Name, TotalRevenue } = JSON.parse(localStorage.getItem("userDetails"));
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{page?.title || ""}</h1>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-green-600 font-semibold text-lg">
            Total Revenue: ₹{parseFloat(TotalRevenue).toFixed(2)}
          </div>
          {Name ? (
            <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-xl text-white">
              {Name ? Name.charAt(0).toUpperCase() : ""}
            </div>
          ) : (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}

          <Button className="cursor-pointer" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
