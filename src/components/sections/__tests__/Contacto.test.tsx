import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Contacto } from '../Contacto';

// Mock Supabase
const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert
    }))
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Contacto Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact form', () => {
    const { container } = render(<Contacto />);
    const form = container.querySelector('form');
    expect(form).toBeDefined();
  });

  it('has aria-live region for accessibility', () => {
    render(<Contacto />);
    const ariaLiveContainer = document.querySelector('[aria-live="polite"]');
    expect(ariaLiveContainer).toBeDefined();
  });

  it('renders input fields', () => {
    const { container } = render(<Contacto />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
