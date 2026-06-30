export const mockKnowledgeBase = [
  {
    id: "hr",
    name: "HR",
    type: "folder",
    children: [
      {
        id: "smartworking",
        name: "Smartworking",
        type: "folder",
        children: [
          {
            id: "doc-sw-it",
            type: "file",
            name: "Regolamento Smartworking (IT).docx",
            language: "IT",
            status: "Approved",
            officeLocation: ["Italy", "Canada"],
            keywords: ["smartworking", "hr"],
            url: "#"
          },
            {
            id: "doc-sw-it-asdkhjsa",
            type: "file",
            name: "Regolamento Note",
            language: "IT",
            status: "Approved",
            officeLocation: ["Italy", "Canada"],
            keywords: ["smartworking", "hr"],
            url: "#"
          },
          {
            id: "doc-sw-en",
            type: "file",
            name: "Smartworking Policy (EN).docx",
            language: "EN",
            status: "Approved",
            officeLocation: ["Canada"],
            keywords: ["smartworking", "hr"],
            url: "#"
          }
        ]
      }
    ]
  },
  {
    id: "planning",
    name: "Planning",
    type: "folder",
    children: [
      {
        id: "regolamenti",
        name: "Regolamenti",
        type: "folder",
        children: [
          {
            id: "doc-plan-it",
            type: "file",
            name: "Regolamento Pianificazione (IT).docx",
            language: "IT",
            status: "Approved",
            officeLocation: ["Italy"],
            keywords: ["planning"],
            url: "#"
          }
        ]
      },
            {
        id: "poajni",
        name: "Pianificazione",
        type: "folder",
        children: [
          {
            id: "doc-plan-itasdsa",
            type: "file",
            name: "Documento 99999",
            language: "IT",
            status: "Approved",
            officeLocation: ["Italy"],
            keywords: ["planning"],
            url: "#"
          }
        ]
      }
    ]
  }
];
