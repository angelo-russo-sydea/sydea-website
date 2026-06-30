import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const StyleNavbar = () => {
  const { pathname } = useLocation();
  const { lang } = useParams();

  useEffect(() => {
    try{
      let navbar_id = window.getComputedStyle(document.getElementById('main-nav')).display === "none" ? 'main-nav-mob' : 'main-nav';
      if (pathname === `/${lang}`) {
        document.getElementById(navbar_id).classList.add("navbar-transparent");
      } else {
        document.getElementById(navbar_id).classList.remove("navbar-transparent");
      }
    }
    catch(e){}
  }, [pathname]);

  const toggleVisible = () => {
    try {
      let navbar_id = window.getComputedStyle(document.getElementById('main-nav')).display === "none" ? 'main-nav-mob' : 'main-nav';
      if (pathname !== `/${lang}`) {
        document.getElementById(navbar_id).classList.remove("navbar-transparent");
        return 
      }
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 200) {
        document.getElementById(navbar_id).classList.remove("navbar-transparent");
      } else {
        document.getElementById(navbar_id).classList.add("navbar-transparent");
      } 
    } catch (error) {}
  };

  window.addEventListener("scroll", toggleVisible);
};

export default StyleNavbar;
