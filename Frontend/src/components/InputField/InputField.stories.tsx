import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with validation states, multiple variants, and optional features like clear button and password toggle.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'ghost'],
      description: 'Visual variant of the input field',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the input is in an invalid state',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the input is in a loading state',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Whether to show the clear button when input has value',
    },
  },
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

// With label and helper text
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    helperText: 'We\'ll never share your email with anyone else.',
    type: 'email',
  },
};

// Error state
export const WithError: Story = {
  args: {
    label: 'Username',
    value: 'invalid-username',
    invalid: true,
    errorMessage: 'Username must be at least 3 characters long.',
  },
};

// Password input
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters long.',
  },
};

// With clear button
export const WithClearButton: Story = {
  args: {
    label: 'Search',
    value: 'Sample text to clear',
    placeholder: 'Search for something...',
    showClearButton: true,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    label: 'Processing...',
    value: 'Some input value',
    loading: true,
    placeholder: 'Please wait...',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'This input is disabled',
    disabled: true,
    helperText: 'This field cannot be edited.',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        variant="outlined"
        label="Outlined (Default)"
        placeholder="Outlined variant"
      />
      <InputField
        variant="filled"
        label="Filled"
        placeholder="Filled variant"
      />
      <InputField
        variant="ghost"
        label="Ghost"
        placeholder="Ghost variant"
      />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        size="sm"
        label="Small"
        placeholder="Small input"
      />
      <InputField
        size="md"
        label="Medium (Default)"
        placeholder="Medium input"
      />
      <InputField
        size="lg"
        label="Large"
        placeholder="Large input"
      />
    </div>
  ),
};

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Normal States</h3>
        <InputField
          label="Default"
          placeholder="Default state"
        />
        <InputField
          label="With Value"
          value="Some text"
          placeholder="With value"
        />
        <InputField
          label="Focused"
          placeholder="Click to focus"
          autoFocus
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Special States</h3>
        <InputField
          label="Invalid"
          value="invalid@"
          invalid
          errorMessage="Invalid email format"
        />
        <InputField
          label="Disabled"
          value="Disabled input"
          disabled
        />
        <InputField
          label="Loading"
          value="Processing..."
          loading
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Features</h3>
        <InputField
          label="With Clear Button"
          value="Clear me!"
          showClearButton
        />
        <InputField
          label="Password Toggle"
          type="password"
          value="secretpassword"
        />
        <InputField
          label="All Features"
          type="password"
          value="password123"
          showClearButton
          helperText="Password with clear button"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Types</h3>
        <InputField
          label="Email"
          type="email"
          placeholder="user@example.com"
        />
        <InputField
          label="Number"
          type="number"
          placeholder="123"
        />
        <InputField
          label="Telephone"
          type="tel"
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  ),
};

// Dark mode example
export const DarkMode: Story = {
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
    <div className="space-y-4 w-80 p-4 bg-gray-900 text-white rounded-lg">
      <InputField
        label="Dark Mode Input"
        placeholder="Enter text..."
        helperText="This input supports dark mode"
      />
      <InputField
        label="Password (Dark)"
        type="password"
        placeholder="Enter password..."
        showClearButton
        value="darkpassword"
      />
      <InputField
        label="Error State (Dark)"
        value="invalid input"
        invalid
        errorMessage="This field has an error"
      />
    </div>
  ),
};