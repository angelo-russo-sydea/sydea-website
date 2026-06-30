export default function DocumentList({
  items,
  language,
  officeLocation
}) {
  const documents = items.filter(
    d =>
      d.type === "file" &&
      d.status === "Approved" &&
      d.language === language &&
      d.officeLocation.includes(officeLocation)
  );

  if (!documents.length) {
    return <p>Nessun documento disponibile</p>;
  }

  return (
    <ul>
      {documents.map(doc => (
        <li key={doc.id}>
          <a href={doc.url}>{doc.name}</a>
        </li>
      ))}
    </ul>
  );
}
