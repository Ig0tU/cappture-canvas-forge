
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '../components/ChatInterface';
import '@testing-library/jest-dom';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock agent functions
jest.mock('../lib/agent/agentManager', () => ({
  simulateAgentAction: jest.fn().mockImplementation((input: string): Promise<string> => {
    return Promise.resolve("I've processed your request.");
  }),
  setProcessingState: jest.fn(),
}));

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('ChatInterface', () => {
  beforeEach(() => {
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
    const { simulateAgentAction, setProcessingState } = require('../lib/agent/agentManager');
    render(<ChatInterface />);
    
    // Activate the agent first
    const activateButton = screen.getByText(/activate/i);
    fireEvent.click(activateButton);
    
    // Now send a message
    const input = screen.getByPlaceholderText(/Ask me anything/i);
    const sendButton = screen.getByRole('button', { name: '' });
    
    fireEvent.change(input, { target: { value: 'Create a new file' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(simulateAgentAction).toHaveBeenCalledWith('Create a new file');
      expect(setProcessingState).toHaveBeenCalledWith(true);
    });
  });
});
