import { createContext, useContext, useState } from "react";

const NavigationContext = createContext({
  clickedMenu: 1,
  setClickedMenu: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [clickedMenu, setClickedMenu] = useState(1);

  const navigationValues = {
    clickedMenu,
    setClickedMenu,
  };
  return (
    <NavigationContext.Provider value={navigationValues}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  return useContext(NavigationContext);
};
