import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  colSpan: number;
}

export default function EmptyState({ message, colSpan }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center">
          <SearchX className="w-8 h-8 text-gray-300 mb-3" />
          <p>{message}</p>
        </div>
      </td>
    </tr>
  );
}
