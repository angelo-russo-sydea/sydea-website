export const formatDate = (value, lang = "it", options = {}) => {
  if (!value) return "-";

  try {
    // Trasforma "2026-03-16 10:44" in formato Date valido
    const date = new Date(value.replace(" ", "T") + "Z");
    if (isNaN(date)) return "-";

    // Imposta la locale in base alla lingua
    const locale = lang === "it" ? "it-IT" : "en-GB";

    // Formattazione: giorno/mese/anno (4 cifre) + ore/minuti
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",      // anno a 4 cifre
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,        // 24h
      ...options            // permette di sovrascrivere dateStyle/timeStyle se vuoi
    }).format(date);

  } catch {
    return "-";
  }
};