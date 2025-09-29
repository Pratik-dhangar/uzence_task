import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className,
  emptyMessage = 'No data available',
  rowKey = 'id',
  onRowClick,
  size = 'md',
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: null });

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.direction) {
      return data;
    }

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      // For other types, convert to string and compare
      const aString = String(aValue);
      const bString = String(bValue);
      const comparison = aString.localeCompare(bString);
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortState(prevState => {
      if (prevState.key === columnKey) {
        if (prevState.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else if (prevState.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allKeys = new Set(sortedData.map((item, index) => getRowKey(item, index)));
      setSelectedRows(allKeys);
      onRowSelect?.(sortedData);
    }
  };

  const handleRowSelect = (record: T, index: number) => {
    const key = getRowKey(record, index);
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(key)) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }
    
    setSelectedRows(newSelectedRows);
    
    const selectedData = sortedData.filter((item, idx) => 
      newSelectedRows.has(getRowKey(item, idx))
    );
    onRowSelect?.(selectedData);
  };

  const handleRowClick = (record: T, index: number, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    onRowClick?.(record, index);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      cell: 'px-3 py-2 text-sm',
      header: 'px-3 py-2 text-sm font-medium',
    },
    md: {
      cell: 'px-4 py-3 text-base',
      header: 'px-4 py-3 text-sm font-medium',
    },
    lg: {
      cell: 'px-6 py-4 text-base',
      header: 'px-6 py-4 text-base font-medium',
    }
  };

  const currentSize = sizeClasses[size];

  const getSortIcon = (columnKey: string) => {
    if (sortState.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    
    return sortState.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
    );
  };

  const renderCellContent = (column: Column<T>, record: T, index: number) => {
    const value = record[column.dataIndex];
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    return value?.toString() || '';
  };

  if (loading) {
    return (
      <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              📊
            </div>
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Data table with sortable columns">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {selectable && (
                <th className={cn(currentSize.header, 'w-12 text-center')}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    currentSize.header,
                    'text-center text-gray-900 dark:text-gray-100',
                    column.align === 'left' && 'text-left',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer select-none group hover:bg-gray-100 dark:hover:bg-gray-700',
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  {...(column.sortable && {
                    role: 'button',
                    tabIndex: 0,
                    'aria-sort': sortState.key === column.key 
                      ? (sortState.direction === 'asc' ? 'ascending' : 'descending') 
                      : 'none',
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(column.key);
                      }
                    }
                  })}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = selectedRows.has(key);
              
              return (
                <tr
                  key={key}
                  className={cn(
                    'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={(e) => handleRowClick(record, index, e)}
                >
                  {selectable && (
                    <td className={cn(currentSize.cell, 'w-12 text-center')}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(record, index)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        currentSize.cell,
                        'text-center text-gray-900 dark:text-gray-100',
                        column.align === 'left' && 'text-left',
                        column.align === 'right' && 'text-right',
                      )}
                    >
                      {renderCellContent(column, record, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;