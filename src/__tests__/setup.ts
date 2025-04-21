
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

// Make sure the matchers are properly attached to Jest
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
  toBeVisible(received) {
    const pass = received !== null;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be visible`,
      pass,
    };
  },
  toHaveTextContent(received, text) {
    const pass = received !== null && received.textContent === text;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have text content "${text}"`,
      pass,
    };
  },
  toHaveValue(received, value) {
    const pass = received !== null && received.value === value;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have value "${value}"`,
      pass,
    };
  },
  toHaveClass(received, className) {
    const pass = received !== null && received.classList.contains(className);
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class "${className}"`,
      pass,
    };
  },
});
