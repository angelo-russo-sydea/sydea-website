import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const MeetEntry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.toLowerCase().startsWith("it") ? "it" : "en";

    navigate(`/${lang}/meet`, { replace: true });
  }, [navigate]);

  return null;
};