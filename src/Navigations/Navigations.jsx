import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { NavigationProvider } from "./navigation.context";

const Navigations = () => {
  return (
    <NavigationProvider>
      <div>
        <Sidebar />
        <Navbar />
      </div>
    </NavigationProvider>
  );
};

export default Navigations;
