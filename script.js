document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const foldersList = document.getElementById('folders-list');
    const noteEditor = document.getElementById('note-editor');
    const folderEditor = document.getElementById('folder-editor');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const folderSelect = document.getElementById('folder-select');
    const saveNoteButton = document.getElementById('save-note');
    const cancelEditButton = document.getElementById('cancel-edit');
    const addNoteButton = document.getElementById('add-note');
    const addFolderButton = document.getElementById('add-folder');
    const saveFolderButton = document.getElementById('save-folder');
    const cancelFolderButton = document.getElementById('cancel-folder');
    
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let folders = JSON.parse(localStorage.getItem('folders')) || [];
    let currentNoteIndex = -1;
    let currentFolder = '';

    function renderFolders() {
        foldersList.innerHTML = '';
        folders.forEach((folder) => {
            const folderItem = document.createElement('div');
            folderItem.className = 'folder-item';

            const folderButton = document.createElement('button');
            folderButton.textContent = folder.name;
            folderButton.addEventListener('click', () => {
                currentFolder = folder.name;
                renderNotes();
            });

            const deleteFolderButton = document.createElement('button');
            deleteFolderButton.textContent = 'X';
            deleteFolderButton.addEventListener('click', () => {
                folders = folders.filter(f => f.name !== folder.name);
                notes = notes.filter(note => note.folder !== folder.name);
                localStorage.setItem('folders', JSON.stringify(folders));
                localStorage.setItem('notes', JSON.stringify(notes));
                renderFolders();
                renderNotes();
            });

            folderItem.appendChild(folderButton);
            folderItem.appendChild(deleteFolderButton);
            foldersList.appendChild(folderItem);
        });
    }

    function renderNotes() {
        notesList.innerHTML = '';
        const filteredNotes = notes.filter(note => note.folder === currentFolder);
        filteredNotes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';

            const noteButton = document.createElement('button');
            noteButton.textContent = note.title || 'Untitled';
            noteButton.addEventListener('click', () => {
                currentNoteIndex = notes.indexOf(note);
                noteTitle.value = note.title || '';
                noteContent.value = note.content || '';
                folderSelect.value = note.folder || '';
                noteEditor.style.display = 'block';
                folderEditor.style.display = 'none';
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                notes.splice(notes.indexOf(note), 1);
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            });

            noteItem.appendChild(noteButton);
            noteItem.appendChild(deleteButton);
            notesList.appendChild(noteItem);
        });
    }

    function updateFolderSelect() {
        folderSelect.innerHTML = '';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.name;
            option.textContent = folder.name;
            folderSelect.appendChild(option);
        });
    }

    addNoteButton.addEventListener('click', () => {
        currentNoteIndex = -1; // Reset index for a new note
        noteTitle.value = '';
        noteContent.value = '';
        noteEditor.style.display = 'block';
        folderEditor.style.display = 'none';
    });

    addFolderButton.addEventListener('click', () => {
        folderEditor.style.display = 'block';
        noteEditor.style.display = 'none';
    });

    saveFolderButton.addEventListener('click', () => {
        const folderName = document.getElementById('folder-name').value;
        if (folderName && !folders.some(f => f.name === folderName)) {
            folders.push({ name: folderName });
            localStorage.setItem('folders', JSON.stringify(folders));
            renderFolders();
            updateFolderSelect();
            folderEditor.style.display = 'none';
        }
    });

    cancelFolderButton.addEventListener('click', () => {
        folderEditor.style.display = 'none';
    });

    saveNoteButton.addEventListener('click', () => {
        const title = noteTitle.value;
        const content = noteContent.value;
        const folder = folderSelect.value;

        if (currentNoteIndex === -1) {
            notes.push({ title, content, folder });
        } else {
            notes[currentNoteIndex] = { title, content, folder };
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        noteEditor.style.display = 'none';
        renderNotes();
    });

    cancelEditButton.addEventListener('click', () => {
        noteEditor.style.display = 'none';
    });

    renderFolders();
    updateFolderSelect();
    renderNotes();
});