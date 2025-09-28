import { useState } from 'react';
import InputField from './components/InputField';
import DataTable, { type Column } from './components/DataTable';
import { Users, Mail, Phone, Calendar, Star } from 'lucide-react';

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Senior Developer',
    department: 'Engineering',
    joinDate: '2023-01-15',
    status: 'active',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    role: 'Product Manager',
    department: 'Product',
    joinDate: '2023-03-22',
    status: 'active',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    phone: '+1 (555) 345-6789',
    role: 'UX Designer',
    department: 'Design',
    joinDate: '2023-02-10',
    status: 'inactive',
    rating: 4.2,
  },
  {
    id: 4,
    name: 'Alice Wilson',
    email: 'alice.wilson@company.com',
    phone: '+1 (555) 456-7890',
    role: 'Marketing Specialist',
    department: 'Marketing',
    joinDate: '2023-04-05',
    status: 'pending',
    rating: 4.4,
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@company.com',
    phone: '+1 (555) 567-8901',
    role: 'Data Analyst',
    department: 'Analytics',
    joinDate: '2023-01-30',
    status: 'active',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana.prince@company.com',
    phone: '+1 (555) 678-9012',
    role: 'HR Manager',
    department: 'Human Resources',
    joinDate: '2022-12-01',
    status: 'active',
    rating: 4.9,
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  // Filter users based on search term and status
  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      render: (value: string, record: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      dataIndex: 'email',
      render: (_value: string, record: User) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      sortable: true,
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      dataIndex: 'joinDate',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'rating',
      title: 'Rating',
      dataIndex: 'rating',
      sortable: true,
      align: 'center',
      render: (value: number) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value: User['status']) => {
        const statusConfig = {
          active: { 
            bg: 'bg-green-100 dark:bg-green-900/30', 
            text: 'text-green-800 dark:text-green-300',
            dot: 'bg-green-500' 
          },
          inactive: { 
            bg: 'bg-gray-100 dark:bg-gray-700', 
            text: 'text-gray-800 dark:text-gray-300',
            dot: 'bg-gray-500' 
          },
          pending: { 
            bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
            text: 'text-yellow-800 dark:text-yellow-300',
            dot: 'bg-yellow-500' 
          },
        };
        
        const config = statusConfig[value];
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </div>
        );
      },
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleRowClick = (user: User) => {
    alert(`Clicked on ${user.name}\nRole: ${user.role}\nDepartment: ${user.department}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                React Components Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Showcase of InputField and DataTable components
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* InputField Demo Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            InputField Component Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Inputs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Basic Examples</h3>
              
              <InputField
                label="Search Users"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                showClearButton
                helperText="Search by name, email, or department"
              />
              
              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                variant="filled"
              />
              
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                showClearButton
                variant="outlined"
              />
            </div>

            {/* Different States */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Different States</h3>
              
              <InputField
                label="Loading State"
                value="Processing..."
                loading
                variant="outlined"
              />
              
              <InputField
                label="Error State"
                value="invalid-email"
                invalid
                errorMessage="Please enter a valid email address"
                variant="outlined"
              />
              
              <InputField
                label="Disabled State"
                value="Cannot edit this field"
                disabled
                helperText="This field is read-only"
                variant="filled"
              />
            </div>
          </div>

          {/* Size Variants */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Size Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                size="sm"
                label="Small"
                placeholder="Small input"
                variant="ghost"
              />
              <InputField
                size="md"
                label="Medium"
                placeholder="Medium input"
                variant="ghost"
              />
              <InputField
                size="lg"
                label="Large"
                placeholder="Large input"
                variant="ghost"
              />
            </div>
          </div>
        </section>

        {/* DataTable Demo Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                DataTable Component Demo
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Employee directory with sorting, filtering, and selection
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{selectedUsers.length}</strong> user(s) selected:
                <span className="ml-2">
                  {selectedUsers.map(user => user.name).join(', ')}
                </span>
              </p>
            </div>
          )}

          <DataTable
            data={filteredUsers}
            columns={columns}
            loading={isLoading}
            selectable
            onRowSelect={setSelectedUsers}
            onRowClick={handleRowClick}
            emptyMessage={
              searchTerm || filterStatus !== 'all' 
                ? "No users found matching your criteria" 
                : "No users available"
            }
            className="shadow-sm"
          />

          {/* Stats */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Showing <strong>{filteredUsers.length}</strong> of <strong>{sampleUsers.length}</strong> users
            </div>
            <div className="flex items-center gap-4">
              <span>Active: <strong>{sampleUsers.filter(u => u.status === 'active').length}</strong></span>
              <span>Pending: <strong>{sampleUsers.filter(u => u.status === 'pending').length}</strong></span>
              <span>Inactive: <strong>{sampleUsers.filter(u => u.status === 'inactive').length}</strong></span>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Features Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                InputField Component
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ Multiple variants (filled, outlined, ghost)</li>
                <li>✅ Three sizes (small, medium, large)</li>
                <li>✅ Validation states (error, loading, disabled)</li>
                <li>✅ Password toggle functionality</li>
                <li>✅ Clear button option</li>
                <li>✅ Full TypeScript support</li>
                <li>✅ Accessibility compliant</li>
                <li>✅ Dark mode support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                DataTable Component
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ Column sorting (ascending/descending)</li>
                <li>✅ Row selection (single/multiple)</li>
                <li>✅ Custom cell rendering</li>
                <li>✅ Loading and empty states</li>
                <li>✅ Responsive design</li>
                <li>✅ Click handlers for rows</li>
                <li>✅ Full TypeScript support</li>
                <li>✅ Dark mode support</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Built with React, TypeScript, TailwindCSS, and Storybook</p>
            <p className="text-sm mt-1">Components: InputField & DataTable</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App
