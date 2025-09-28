import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InputField from './InputField';

describe('InputField', () => {
  it('renders with basic props', () => {
    render(<InputField placeholder="Test placeholder" />);
    
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<InputField label="Test Label" />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<InputField helperText="Helper text" />);
    
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<InputField errorMessage="Error message" invalid />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<InputField onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<InputField disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<InputField loading />);
    
    expect(screen.getByRole('textbox')).toBeDisabled();
    // Loading spinner should be present
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows clear button when showClearButton is true and has value', () => {
    render(<InputField showClearButton value="test value" />);
    
    expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<InputField showClearButton value="test value" onChange={handleChange} />);
    
    const clearButton = screen.getByLabelText('Clear input');
    await user.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' })
      })
    );
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    
    render(<InputField type="password" value="password123" />);
    
    const input = screen.getByDisplayValue('password123');
    const toggleButton = screen.getByLabelText('Show password');
    
    // Initially should be password type (hidden)
    expect(input).toHaveAttribute('type', 'password');
    
    // Click to show password
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    
    // Click to hide password again
    await user.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<InputField size="sm" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<InputField size="md" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveClass('px-3', 'py-2', 'text-base');
    
    rerender(<InputField size="lg" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveClass('px-4', 'py-3', 'text-lg');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<InputField variant="filled" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveClass('bg-gray-100');
    
    rerender(<InputField variant="outlined" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveClass('border');
    
    rerender(<InputField variant="ghost" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveClass('border-b-2');
  });

  it('has proper accessibility attributes', () => {
    render(
      <InputField 
        label="Email"
        helperText="Enter your email"
        invalid
        errorMessage="Invalid email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});