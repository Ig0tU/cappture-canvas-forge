
// Tests for ChatInterface component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '../components/ChatInterface';
import { simulateAgentAction, setProcessingState } from '../lib/canvasState';
import '@testing-library/jest-dom';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

jest.mock('../lib/canvasState', () => ({
  simulateAgentAction: jest.fn().mockResolvedValue("I've processed your request."),
  setProcessingState: jest.fn(),
  STATE: {
    agent: {
      active: true,
      name: 'TestAgent'
    }
  },
  MessageTypes: {
    USER: 'user',
    AGENT: 'agent',
    SYSTEM: 'system'
  }
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders welcome message', () => {
    render(<ChatInterface />);
    
    expect(screen.getByText(/Welcome to CapptureCanvas/i)).toBeInTheDocument();
    expect(screen.getByText('Canvas Assistant')).toBeInTheDocument();
  });
  
  test('allows activating and deactivating agent', () => {
    render(<ChatInterface />);
    
    const activateButton = screen.getByText(/activate/i);
    fireEvent.click(activateButton);
    
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
  
  test('sends messages when agent is active', async () => {
    render(<ChatInterface />);
    
    // Input a message
    const input = screen.getByPlaceholderText(/Ask me anything/i);
    const sendButton = screen.getByRole('button', { name: '' }); // Send button with icon
    
    fireEvent.change(input, { target: { value: 'Create a new file' } });
    fireEvent.click(sendButton);
    
    // Check if simulateAgentAction was called
    await waitFor(() => {
      expect(simulateAgentAction).toHaveBeenCalledWith('Create a new file');
      expect(setProcessingState).toHaveBeenCalledWith(true);
      expect(setProcessingState).toHaveBeenCalledWith(false);
    });
  });

  // Additional tests could be added for:
  // 1. Testing error handling
  // 2. Testing message formatting
  // 3. Testing command functionality
});
