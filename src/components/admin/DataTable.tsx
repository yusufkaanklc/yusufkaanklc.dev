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
    return (
      <div className="admin-section text-center py-12">
        <p className="text-fg-dim text-sm font-mono">No items found.</p>
      </div>
    );
  }

  return (
    <div className="admin-section p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fg-dim/10 bg-bg-secondary/50">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 text-fg-dim font-medium text-xs uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right py-3 px-4 text-fg-dim font-medium text-xs uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item._id || i} className="border-b border-fg-dim/5 last:border-0 hover:bg-accent/[0.03] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-fg-muted">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="py-3 px-4 text-right space-x-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-accent/70 hover:text-accent text-xs transition-colors px-2 py-1 rounded hover:bg-accent/10"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-t-red/60 hover:text-t-red text-xs transition-colors px-2 py-1 rounded hover:bg-t-red/10"
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
    </div>
  );
}
