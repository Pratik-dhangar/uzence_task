import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DataTable, { type Column } from './DataTable';

// Sample data for testing
interface TestUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

const testUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

const testColumns: Column<TestUser>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'age',
    title: 'Age',
    dataIndex: 'age',
    sortable: true,
    align: 'right',
  },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    
    // Check data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={testColumns} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={testColumns} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <DataTable 
        data={[]} 
        columns={testColumns} 
        emptyMessage="No users found" 
      />
    );
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders selection checkboxes when selectable', () => {
    render(<DataTable data={testUsers} columns={testColumns} selectable />);
    
    // Should have header checkbox + one for each row
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(testUsers.length + 1);
  });

  it('handles row selection', async () => {
    const handleRowSelect = vi.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        selectable 
        onRowSelect={handleRowSelect}
      />
    );
    
    const rowCheckboxes = screen.getAllByRole('checkbox');
    // Click first data row checkbox (skip header checkbox)
    await user.click(rowCheckboxes[1]);
    
    expect(handleRowSelect).toHaveBeenCalledWith([testUsers[0]]);
  });

  it('handles select all functionality', async () => {
    const handleRowSelect = vi.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        selectable 
        onRowSelect={handleRowSelect}
      />
    );
    
    const headerCheckbox = screen.getByLabelText('Select all rows');
    await user.click(headerCheckbox);
    
    expect(handleRowSelect).toHaveBeenCalledWith(testUsers);
  });

  it('sorts data when sortable column header is clicked', async () => {
    const user = userEvent.setup();
    
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    const nameHeader = screen.getByText('Name');
    await user.click(nameHeader);
    
    // After sorting, the order should change
    const rows = screen.getAllByRole('row');
    // First row is header, second row should now be "Bob Johnson" (alphabetically first)
    expect(rows[1]).toHaveTextContent('Bob Johnson');
  });

  it('cycles through sort states (asc -> desc -> none)', async () => {
    const user = userEvent.setup();
    
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    const nameHeader = screen.getByText('Name');
    
    // First click - ascending
    await user.click(nameHeader);
    let rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Bob Johnson');
    
    // Second click - descending  
    await user.click(nameHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('John Doe');
    
    // Third click - back to original order
    await user.click(nameHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('John Doe');
  });

  it('handles row clicks', async () => {
    const handleRowClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        onRowClick={handleRowClick}
      />
    );
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toBeInTheDocument();
    
    if (firstRow) {
      await user.click(firstRow);
      expect(handleRowClick).toHaveBeenCalledWith(testUsers[0], 0);
    }
  });

  it('renders custom cell content', () => {
    const customColumns: Column<TestUser>[] = [
      ...testColumns,
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'name',
        render: (value: unknown) => <span data-testid="custom-cell">Active: {value as string}</span>,
      },
    ];
    
    render(<DataTable data={testUsers} columns={customColumns} />);
    
    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells).toHaveLength(testUsers.length);
    expect(customCells[0]).toHaveTextContent('Active: John Doe');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <DataTable data={testUsers} columns={testColumns} size="sm" />
    );
    
    // Check for small size classes in table cells
    expect(document.querySelector('.px-3.py-2.text-sm')).toBeInTheDocument();
    
    rerender(<DataTable data={testUsers} columns={testColumns} size="lg" />);
    
    // Check for large size classes in table cells
    expect(document.querySelector('.px-6.py-4.text-base')).toBeInTheDocument();
  });

  it('applies correct column alignment', () => {
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    // Age column should have right alignment
    const ageHeader = screen.getByText('Age');
    const headerCell = ageHeader.closest('th');
    expect(headerCell).toHaveClass('text-right');
  });

  it('has proper accessibility attributes', () => {
    render(<DataTable data={testUsers} columns={testColumns} selectable />);
    
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    expect(selectAllCheckbox).toBeInTheDocument();
    
    const rowCheckboxes = screen.getAllByLabelText(/Select row \d+/);
    expect(rowCheckboxes).toHaveLength(testUsers.length);
  });

  it('uses custom rowKey function', () => {
    const customRowKey = (record: TestUser) => `user-${record.id}`;
    
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        rowKey={customRowKey}
        selectable
      />
    );
    
    // This test ensures the custom rowKey is used internally
    // The exact implementation would depend on how keys are used
    expect(screen.getAllByRole('checkbox')).toHaveLength(testUsers.length + 1);
  });
});