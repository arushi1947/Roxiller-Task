// src/components/Table.jsx
import React from 'react';

export default function Table({ columns, data, onSort, sortBy }) {
  return (
    <div className="overflow-x-auto bg-white border rounded">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.accessor}
                className="text-left p-3 text-sm font-medium text-gray-600"
                onClick={() => col.sortable && onSort && onSort(col.accessor)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {sortBy?.key === col.accessor && <span className="text-xs">{sortBy.dir === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td className="p-4" colSpan={columns.length}>No records</td></tr>
          ) : data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              {columns.map(col => <td key={col.accessor} className="p-3 text-sm">{col.cell ? col.cell(row) : row[col.accessor]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
