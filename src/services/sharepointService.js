export async function getKnowledgeBaseDocuments(
  token,
  siteId,
  listId,
  officeLocation
) {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items
?$expand=fields
&$filter=fields/DocumentStatus eq 'Approved'
and fields/OfficeLocation/any(o:o eq '${officeLocation}')`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Errore nel recupero documenti");
  }

  return response.json();
}
