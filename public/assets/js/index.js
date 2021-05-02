const url = "/api/notes/";
const noteList = document.getElementById("list-group");
const TitleField = document.getElementById("note-title");
const DescriptionField = document.getElementById("note-textarea");
const saveButton = document.getElementById("save");
const createButton = document.getElementById("create");

//to track active note
let activeNoteId;

// ready to create new note
createButton.onclick = function () {
    reset();
}

// save note when save button is pressed
saveButton.onclick = function() {
    const title = TitleField.value.trim();
    const description = DescriptionField.value.trim();
    SaveNote(title,description);
}

// Toggle save button
function DisplaySaveButton() {
    if(!TitleField.value.trim() || !DescriptionField.value.trim()) saveButton.style.display = "none";
    else saveButton.style.display = "inline";
}

// To listen for input to show save button
TitleField.addEventListener('keyup', () => {
    DisplaySaveButton();
});

DescriptionField.addEventListener('keyup', () => {
    DisplaySaveButton();
});


// Create HTML element for created notes
function createListItem(note) {

    let li = document.createElement("LI");
    let span = document.createElement("SPAN");
    let btn = document.createElement("I");
    
    btn.setAttribute("class","fas fa-trash-alt float-right text-danger delete-note");
    btn.onclick = (e) => RemoveNote(e);
    span.innerText=note.title;
    li.dataset.id=note.id;
    li.dataset.description = note.description;
    li.setAttribute("class","list-group-item");
    li.onclick = (e) => ActiveNote(e);

    li.appendChild(span);
    li.appendChild(btn);

    return li;
}


// Display all the created notes
function DisplayNotes(notes) {
    for(let i=0; i<notes.data.length; i++) noteList.appendChild(createListItem(notes.data[i]));
}

// show the active note in input field
function ActiveNote(e) {
    if(!e.target.classList.contains("delete-note")) {
        activeNoteId = e.target.dataset.id;
        TitleField.value = e.target.innerText;
        DescriptionField.value = e.target.dataset.description;
        TitleField.readOnly=true;
        DescriptionField.readOnly=true;
    }
}

// when save button is pressed
async function SaveNote(title,description) {
    const data = {
        title : title,
        description : description
    };  
    // call create api
    const notes = await createNote(data);

    if(notes.success) {
        noteList.appendChild(createListItem(notes.data));
        reset();
    }
    else console.log(notes.error);

}

// when delete button is pressed
async function RemoveNote(btn) {
    const li = btn.currentTarget.parentElement;
    const id = li.dataset.id;
    
    //call delete api
    const notes = await deleteNote(id);
    if(activeNoteId === id) reset();

    if(notes.success) li.remove();
    else console.log(notes.error)
    
}


//reset input fields and active note
function reset() {
    activeNoteId = null;
    TitleField.value = '';
    DescriptionField.value = '';
    TitleField.readOnly=false;
    DescriptionField.readOnly=false;
    DisplaySaveButton();
}

// show all notes when website is first loaded
async function init() {
    // call get api
    const notes = await getNotes();
    if(notes.success) {
        DisplayNotes(notes);
    } else {
        console.log(notes.error);
    }
}


///API CALLS
// get all the stored notes
async function getNotes() {
    try {
        const response = await fetch(url); 

        if(response.ok) {        
            const data = await response.json();
            return {success: true, data: data};      
        }
        return {success: false, error: response.statusText};

    } catch (err) {
        return {success: false, error: err.message};
    }
}

// create a new note
async function createNote(data) {
    try{
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            const data = await response.json();
            return {success: true, data: data};     
        }
        return {success: false, error: response.statusText};

    } catch(err) {
        return {success: false, error: err.message};
    }
}

// delete a note
async function deleteNote(id) {
    try{
        const response = await fetch(url+id,{
            method:'DELETE'
        });

        if(response.ok) {
            const data = await response.json();
            return {success: true, data: data};     
        }
        return {success: false, error: response.statusText};

    } catch(err) {
        return {success: false, error: err.message};
    }
}


//start
init();