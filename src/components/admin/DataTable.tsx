"use client";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T extends { _id?: string }>({ columns, data, onEdit, onDelete }: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-fg-dim text-sm py-8 text-center">No items found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fg-dim/15">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-2 px-3 text-fg-dim font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right py-2 px-3 text-fg-dim font-medium">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id || i} className="border-b border-fg-dim/10 hover:bg-fg-dim/5 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-2 px-3 text-fg-muted">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-2 px-3 text-right space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-accent hover:text-accent/80 text-xs transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-t-red hover:text-t-red/80 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
