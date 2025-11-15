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
  const { Name, TotalRevenue , RoleId} = JSON.parse(localStorage.getItem("userDetails"));
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4 hidden sm:block"
        />
        <h1 className="text-sm sm:text-base font-medium truncate max-w-[120px] sm:max-w-none">{page?.title || ""}</h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {RoleId == 1 && (
            <>
              <div className="hidden md:block text-green-600 font-semibold text-base lg:text-lg">
                Total Collection: ₹{parseFloat(TotalRevenue).toFixed(2)}
              </div>
              <div className="md:hidden text-green-600 font-semibold text-sm">
                ₹{parseFloat(TotalRevenue).toFixed(2)}
              </div>
            </>
          )}
          {Name ? (
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-orange-500 rounded-full flex items-center justify-center text-base sm:text-xl text-white flex-shrink-0">
              {Name ? Name.charAt(0).toUpperCase() : ""}
            </div>
          ) : (
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
          )}

          <Button className="cursor-pointer text-xs sm:text-sm px-2 sm:px-4" onClick={logout}>
            <span className="hidden sm:inline">Log out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
