export const folderTranslations = {
  HR: { IT: "HR", EN: "Human Resources" },
  Smartworking: { IT: "Smartworking", EN: "Smartworking Policy" },
  Planning: { IT: "Planning", EN: "Planning" },
  Regolamenti: { IT: "Regolamenti", EN: "Regulations" }
};

export function translateFolder(name, lang) {
  return folderTranslations[name]?.[lang] || name;
}
