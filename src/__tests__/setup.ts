
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Make sure Jest matchers are available for DOM assertions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveTextContent(text: string): R;
      toHaveValue(value: string): R;
      toHaveClass(className: string): R;
    }
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          data: { response: 'Mocked response', actions: [] },
          error: null
        });
      })
    },
    channel: jest.fn().mockImplementation(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnValue({})
    })),
    removeChannel: jest.fn()
  }
}));

// Using a proper type for DOMRect
const mockDOMRect = {
  width: 500,
  height: 500,
  top: 0,
  left: 0,
  bottom: 500,
  right: 500,
  x: 0,
  y: 0,
  toJSON: () => ({})
};

// Properly mock getBoundingClientRect with the correct return type
Element.prototype.getBoundingClientRect = jest.fn(() => mockDOMRect as DOMRect);
