
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

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
      invoke: jest.fn().mockResolvedValue({
        data: { response: 'Mocked response', actions: [] },
        error: null
      })
    },
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnValue({})
    }),
    removeChannel: jest.fn()
  }
}));

// Mock DOM elements for canvas operations
Element.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
  width: 500,
  height: 500,
  top: 0,
  left: 0,
  bottom: 500,
  right: 500,
  x: 0,
  y: 0,
  toJSON: () => {}
});
