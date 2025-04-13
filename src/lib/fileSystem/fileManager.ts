
// File system management
import { STATE } from '../state/appState';
import { updateTerminal } from '../ui/terminalManager';
import { MessageTypes } from '../utils/messageFormatters';
import { generateId } from '../utils/sanitization';
import { ELEMENTS } from '../utils/domElements';

export const updateFileList = (): void => {
  if (!ELEMENTS.fileList) return;
  
  ELEMENTS.fileList.innerHTML = '';
  STATE.workspace.files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file-item';
    fileElement.dataset.fileId = file.id;
    fileElement.innerHTML = `
      <span class="file-name">${file.name}</span>
      <button class="file-delete" data-file-id="${file.id}">&times;</button>
    `;
    ELEMENTS.fileList.appendChild(fileElement);
    
    fileElement.addEventListener('click', () => simulateFileClick(file.id));
    fileElement.querySelector('.file-delete')?.addEventListener('click', (e) => {
      e.stopPropagation();
      simulateFileDelete(file.id);
    });
  });
};

export const simulateFileClick = (fileId: string): void => {
  STATE.workspace.activeFile = fileId;
  
  // Update UI to show the selected file
  document.querySelectorAll('.file-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeFileElement = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (activeFileElement) activeFileElement.classList.add('active');
  
  updateTerminal(`File ${fileId} selected`, MessageTypes.INFO);
};

export const simulateFileDelete = (fileId: string): void => {
  STATE.workspace.files = STATE.workspace.files.filter(file => file.id !== fileId);
  
  // If the deleted file is active, select another one
  if (STATE.workspace.activeFile === fileId && STATE.workspace.files.length > 0) {
    STATE.workspace.activeFile = STATE.workspace.files[0].id;
  }
  
  updateFileList();
  updateTerminal(`File ${fileId} deleted`, MessageTypes.WARNING);
};

export const simulateFileCreate = (name: string, type: string, content: string = ''): void => {
  const newFile = {
    id: generateId(),
    name,
    type,
    content
  };
  
  STATE.workspace.files.push(newFile);
  STATE.workspace.activeFile = newFile.id;
  
  updateFileList();
  updateTerminal(`File ${name} created`, MessageTypes.SUCCESS);
};
