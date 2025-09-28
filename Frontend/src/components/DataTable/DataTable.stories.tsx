import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DataTable, { type Column } from './DataTable';

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  age: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2023-01-15',
    age: 32,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2023-03-22',
    age: 28,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'inactive',
    joinDate: '2023-02-10',
    age: 45,
  },
  {
    id: 4,
    name: 'Alice Wilson',
    email: 'alice@example.com',
    role: 'User',
    status: 'pending',
    joinDate: '2023-04-05',
    age: 24,
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2023-01-30',
    age: 35,
  },
];

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 25,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Coffee Mug',
    category: 'Home',
    price: 12.99,
    stock: 100,
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Running Shoes',
    category: 'Sports',
    price: 89.99,
    stock: 15,
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Notebook',
    category: 'Office',
    price: 5.99,
    stock: 200,
    rating: 4.0,
  },
];

// Column definitions
const userColumns: Column<User>[] = [
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
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (value: User['status']) => {
      const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    },
  },
  {
    key: 'joinDate',
    title: 'Join Date',
    dataIndex: 'joinDate',
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

const productColumns: Column<Product>[] = [
  {
    key: 'name',
    title: 'Product Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'category',
    title: 'Category',
    dataIndex: 'category',
    sortable: true,
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    sortable: true,
    align: 'right',
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    key: 'stock',
    title: 'Stock',
    dataIndex: 'stock',
    sortable: true,
    align: 'center',
    render: (value: number) => {
      const stockColor = value < 20 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
      return <span className={stockColor}>{value}</span>;
    },
  },
  {
    key: 'rating',
    title: 'Rating',
    dataIndex: 'rating',
    sortable: true,
    align: 'center',
    render: (value: number) => {
      const stars = '★'.repeat(Math.floor(value)) + '☆'.repeat(5 - Math.floor(value));
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-yellow-400">{stars}</span>
          <span className="text-sm text-gray-500">({value})</span>
        </div>
      );
    },
  },
];

const meta: Meta<any> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible data table component with sorting, selection, loading states, and customizable rendering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the table is in a loading state',
    },
    selectable: {
      control: 'boolean',
      description: 'Whether rows can be selected',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the table cells',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to show when there is no data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic table
export const Default: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
  },
};

// With selection
export const WithSelection: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    selectable: true,
  },
  render: () => {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {selectedRows.length} row(s)
          {selectedRows.length > 0 && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              [{selectedRows.map(row => row.name).join(', ')}]
            </span>
          )}
        </div>
        <DataTable
          data={sampleUsers}
          columns={userColumns}
          selectable
          onRowSelect={setSelectedRows}
        />
      </div>
    );
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: [],
    columns: userColumns,
    loading: true,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: 'No users found. Try adjusting your search criteria.',
  },
};

// Different data and columns
export const ProductTable: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
  },
};

// Different sizes
export const Sizes: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Size</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={userColumns}
          size="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Size (Default)</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={userColumns}
          size="md"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Size</h3>
        <DataTable
          data={sampleUsers.slice(0, 3)}
          columns={userColumns}
          size="lg"
        />
      </div>
    </div>
  ),
};

// Interactive example with row clicks
export const Interactive: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    selectable: true,
  },
  render: () => {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [clickedRow, setClickedRow] = useState<User | null>(null);
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {selectedRows.length} row(s)
          {clickedRow && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              Last clicked: <strong>{clickedRow.name}</strong> ({clickedRow.email})
            </div>
          )}
        </div>
        <DataTable
          data={sampleUsers}
          columns={userColumns}
          selectable
          onRowSelect={setSelectedRows}
          onRowClick={(record) => setClickedRow(record)}
        />
      </div>
    );
  },
};

// Custom columns with actions
export const WithActions: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
  },
  render: () => {
    const [users, setUsers] = useState(sampleUsers);
    
    const actionColumns: Column<User>[] = [
      ...userColumns,
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        render: (_value, record) => (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`Edit user: ${record.name}`);
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUsers(users.filter(u => u.id !== record.id));
              }}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        ),
      },
    ];
    
    return (
      <DataTable
        data={users}
        columns={actionColumns}
        onRowClick={(record) => console.log('Row clicked:', record)}
      />
    );
  },
};

// All features showcase
export const FullFeatured: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    selectable: true,
  },
  render: () => {
    const [users, setUsers] = useState(sampleUsers);
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    const handleRefresh = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    
    const handleDeleteSelected = () => {
      const selectedIds = selectedRows.map(row => row.id);
      setUsers(users.filter(user => !selectedIds.includes(user.id)));
      setSelectedRows([]);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {users.length} users | Selected: {selectedRows.length} row(s)
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            {selectedRows.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected ({selectedRows.length})
              </button>
            )}
          </div>
        </div>
        
        <DataTable
          data={users}
          columns={userColumns}
          loading={loading}
          selectable
          onRowSelect={setSelectedRows}
          onRowClick={(record) => console.log('Row clicked:', record)}
          emptyMessage="No users found. Click refresh to reload data."
        />
      </div>
    );
  },
};

// Dark mode example
export const DarkMode: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
    selectable: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Dark Mode Data Table</h3>
      <DataTable
        data={sampleProducts}
        columns={productColumns}
        selectable
        onRowSelect={(selected) => console.log('Selected:', selected)}
      />
    </div>
  ),
};