# React Components Library

A modern React component library built with TypeScript, TailwindCSS, and Storybook, featuring two comprehensive UI components: **InputField** and **DataTable**.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue)
![Storybook](https://img.shields.io/badge/Storybook-9.1.8-pink)
![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook (component documentation)
npm run storybook

# Run tests
npx vitest --run --project=unit

# Build for production
npm run build
```

## 📦 Components Overview

https://github.com/user-attachments/assets/fc28833a-f26a-4114-9d2d-54f2537d2a2d

#### Features
- ✅ **Multiple Variants**: `filled`, `outlined`, `ghost`
- ✅ **Responsive**: `sm`, `md`, `lg`
- ✅ **Validation States**: error, loading, disabled
- ✅ **Password Toggle**: Built-in show/hide functionality
- ✅ **Clear Button**: Optional clear input functionality
- ✅ **TypeScript Support**: Full type safety
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **Dark Mode**: Automatic theme support

#### Basic Usage

```tsx
import InputField from './components/InputField';

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <InputField
      label="Email Address"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter your email"
      type="email"
      variant="outlined"
      size="md"
    />
  );
}
```

### 📊 DataTable Component

A powerful data table component with sorting, selection, and customizable rendering capabilities.

#### Features
- ✅ **Column Sorting**: Ascending/descending/none states
- ✅ **Row Selection**: Single or multiple selection
- ✅ **Custom Rendering**: Flexible cell content rendering
- ✅ **Loading States**: Built-in loading and empty states
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Row Interactions**: Click handlers and hover effects
- ✅ **TypeScript Generic**: Type-safe data handling
- ✅ **Dark Mode**: Automatic theme support

#### Basic Usage

```tsx
import DataTable, { Column } from './components/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: Column<User>[] = [
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
  }
];

function MyComponent() {
  return (
    <DataTable
      data={users}
      columns={columns}
      selectable
      onRowSelect={(selected) => console.log(selected)}
    />
  );
}
```

## 🎨 Storybook Documentation

Comprehensive component documentation is available through Storybook:

```bash
npm run storybook
```

Visit `http://localhost:6006` to explore:
- **Interactive Examples**: Try all component variants and states
- **Props Documentation**: Auto-generated from TypeScript interfaces
- **Accessibility Testing**: Built-in a11y addon for compliance testing
- **Visual Testing**: All component states and edge cases

## 🧪 Testing

The project includes comprehensive unit tests using Vitest and React Testing Library.

### Running Tests

```bash
# Run all unit tests
npx vitest --run --project=unit

# Run tests in watch mode
npx vitest --project=unit

# Run Storybook tests
npx vitest --run --project=storybook
```

### Test Coverage

- **InputField Component**: 13 test cases covering all props, states, and interactions
- **DataTable Component**: 15 test cases covering sorting, selection, rendering, and accessibility
- **Accessibility Testing**: ARIA labels, keyboard navigation, and screen reader support
- **Edge Cases**: Empty states, loading states, error handling

## 🏗️ Project Structure

```
Frontend/
├── .storybook/              # Storybook configuration
├── src/
│   ├── components/          # Component library
│   │   ├── InputField/      # InputField component
│   │   └── DataTable/       # DataTable component
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Demo application
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎯 Design Approach

### Component Architecture

1. **Composition over Inheritance**: Components are built using React composition patterns
2. **TypeScript First**: Full type safety with proper interfaces and generics
3. **Accessibility First**: WCAG 2.1 AA compliance with proper ARIA attributes
4. **Responsive Design**: Mobile-first approach with TailwindCSS
5. **Theme Support**: Built-in dark mode with CSS custom properties

### Technology Choices

- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Type safety and better developer experience
- **TailwindCSS**: Utility-first CSS for consistent and maintainable styling
- **Vite**: Fast build tool with HMR for optimal development experience
- **Storybook**: Component documentation and testing in isolation
- **Vitest**: Fast unit testing with Jest-compatible API
- **Lucide React**: Modern icon library with tree-shaking support

## 🌟 Demo Application

The project includes a comprehensive demo application showcasing both components:

- **Interactive Examples**: Live examples of all component features
- **Real-world Usage**: Employee directory with filtering and search
- **Feature Showcase**: Demonstrates all component capabilities
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes

Access the demo at `http://localhost:5173` when running `npm run dev`.

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Storybook
npm run storybook        # Start Storybook dev server
npm run build-storybook  # Build Storybook for deployment

# Testing
npx vitest --run --project=unit        # Run unit tests
npx vitest --run --project=storybook   # Run Storybook tests

# Code Quality
npm run lint             # Run ESLint
```

## 📝 Component API

### InputField Props

```typescript
interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  loading?: boolean;
  className?: string;
}
```

### DataTable Props

```typescript
interface DataTableProps<T> {
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

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}
```

---

