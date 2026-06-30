import { translateFolder } from "./folderTranslations";

export default function FolderTree({ items, language, onSelect }) {
  return (
    <ul>
      {items.map(item => {
        const hasSubFolders =
          item.children?.some(child => child.type === "folder");

        return (
          <li key={item.id}>
            {item.type === "folder" && (
              <>
                <span
                  style={{
                    cursor: "pointer",
                    fontWeight: hasSubFolders ? "bold" : "normal"
                  }}
                  onClick={() => {
                    if (!hasSubFolders) {
                      onSelect(item);
                    }
                  }}
                >
                  {translateFolder(item.name, language)}
                </span>

                {hasSubFolders && (
                  <FolderTree
                    items={item.children}
                    language={language}
                    onSelect={onSelect}
                  />
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
