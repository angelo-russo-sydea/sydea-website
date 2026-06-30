import { mockKnowledgeBase } from "./mockData";

export async function getKnowledgeBaseTree() {
//   const useMock = process.env.REACT_APP_USE_MOCK === "true";
  const useMock = true;

  if (useMock) {
    return Promise.resolve(mockKnowledgeBase);
  }

  // QUI IN FUTURO: Microsoft Graph
  return [];
}
