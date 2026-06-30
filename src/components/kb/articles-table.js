// Figlio
import React, { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Chip } from "@mui/material";
import { formatDate } from "../../services/FormattedDate";
import { useParams } from "react-router-dom";

const STATUS_CONFIG = {
  published: { label: "Pubblicato", color: "success" },
  approved:  { label: "Approvato",  color: "info"    },
  draft:     { label: "Bozza",      color: "warning" },
  released:  { label: "Released",   color: "default" },
};

const LANG_CONFIG = {
  it: { label: "🇮🇹" },
  en: { label: "🇬🇧" },
};

export default function ArticlesTable({ articles = [], onEdit }) {
    const { lang: langFromUrl } = useParams();

    const handleEdit = (article) => {
        onEdit?.(
            article.id,
            article,
            article.lang,
            article.id,
            article.category,
            article.subcategory
        );
    };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 300 },
      { accessorKey: "title", header: "Titolo", size: 300 },
    //   { accessorKey: "category", header: "Categoria" },
    //   { accessorKey: "subcategory", header: "Sottocategoria" },
        {
        id: "categoryFull",
        header: "Categoria",
        accessorFn: (row) =>
            `${row.category ?? ""} / ${row.subcategory ?? ""}`,
        },
      { accessorKey: "lang", header: "Lingua", size: 60, filterVariant: 'multi-select',
        filterSelectOptions: Object.entries(LANG_CONFIG).map(([value, cfg]) => ({
            value,
            label: cfg.label,
        })),
            Cell: ({ cell }) => {
                const lang = cell.getValue();

                const flag = {
                    it: "🇮🇹",
                    en: "🇬🇧",
                }[lang] ?? "🌐";

                return <span style={{ fontSize: "1.2rem" }}>{flag}</span>;
            },
       },
    //    {labelIT} 🇮🇹 - {labelEN} 🇬🇧
        {
        accessorKey: "status",
        header: "Stato",
        filterVariant: 'multi-select',
        filterSelectOptions: Object.entries(STATUS_CONFIG).map(
            ([value, config]) => ({
                value,
                label: config.label,
            })
        ),
        size: 60,
        Cell: ({ cell }) => {
            const status = cell.getValue();
            const config = STATUS_CONFIG[status] ?? {
            label: status,
            color: "default",
            };

            return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                sx={{
                fontWeight: 600,
                fontSize: "0.7rem",
                }}
            />
            );
        },
        },
              
      { accessorKey: "version", header: "Versione", size: 30 },
      {
        accessorKey: "lastUpdated",
        header: "Ultimo agg.",
        Cell: ({ cell }) =>
        //   cell.getValue() ? new Date(cell.getValue()).toLocaleString("it-IT") : "",
          cell.getValue() ? formatDate(cell.getValue(), langFromUrl) : "",
      },
      { accessorKey: "author", header: "Autore" },
      {
        id: "actions",
        header: "Modifica",
        size: 60,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Tooltip title="Modifica articolo">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const data = useMemo(
    () =>
      articles.map((a, i) => ({
        ...a,
        id: String(a.id ?? `${a.title ?? "article"}-${i}`),
      })),
    [articles]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnOrdering: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "lastUpdated", desc: true }],
        columnPinning: {
            left: ["id"],       // 👈 ID sempre visibile a sinistra
            right: ["actions"], // 👈 matita sempre visibile a destra
        },
    },
    density: "compact",
    muiTablePaperProps: {
        sx: {
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: "1px solid #eee !important",
            "& table": {
                border: "0 !important"
            }
        },
    },
    muiTableHeadCellProps: {
        sx: {
            backgroundColor: "#f9fafb",
            fontWeight: 700,
            fontSize: "0.75rem",

            color: "#666",
            borderBottom: "1px solid #eee",
        },
    },
    muiTableBodyRowProps: ({ row, table }) => {
        const visibleRows = table.getRowModel().rows;
        const index = visibleRows.findIndex(r => r.id === row.id);

        return {
            sx: {
            backgroundColor: index % 2 === 0 ? "#ffffff" : "#fffae9",
                "&:hover": {
                    backgroundColor: "#fffae9",
                },
            },
        };
    },
    muiTableContainerProps: {
        sx: { maxHeight: 600 },
    },
    muiTableBodyCellProps: {
        sx: {
            padding: "4px 8px",
            fontSize: "0.75rem",
            borderBottom: "1px solid #f0f0f0",
        }
    },
    muiTopToolbarProps: {
        sx: {
            backgroundColor: "#fff",
            borderBottom: "1px solid #eee",
        },
    },
  });

  return <MaterialReactTable table={table} />;
}