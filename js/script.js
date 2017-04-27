// Trigger JS on page loaded
document.addEventListener('DOMContentLoaded', function() {

// This retrieves the item noteAppStorageObj from the browsers local storage
var savedNotes = localStorage.getItem('noteAppStorageObj');

// Does the object retrieved from storage contain any information?
// If so do this
if (savedNotes !== null) {

  // Information saved to local storage must be saved as a string
  // This line turns the saved string into an obj
  savedNotes = JSON.parse(savedNotes);

  // This takes the object from the previous line and turns it into an array
  // Each item within the array will contain a previously saved note
  savedNotes = Object.keys(savedNotes).map(function (key) { return savedNotes[key]; });

  // Go through the array to access each index
  for(var x = 0; x < savedNotes.length; x++){

    // This takes the contents of the note and wraps it in a .note div for formatting
    var newNote = '<div class="note">' + savedNotes[x] + '</div>';

    // This adds the note to the document
    document.querySelector("body").innerHTML += newNote;	
  }			
}


// This function creates the add note dialog box 
function addNoteScreen() {

  // Create an empty string for holding the html
  var elString = "";

  // Animate the plus new note button to turn into an X with the twist class
  document.querySelector("#add-note-btn").classList.add("twist");

  // This is the html for the new note section includes
  // 1. #add-note-screen container
  // 2. a heading
  // 3. A textarea for user input
  // 4. Buttons for easily adding <> {} into note when using on mobile
  // 5. A button to turn the contents of the text area into a note
  elString += '<div id="add-note-screen">';
  elString += '<h1>Add New Note</h1>';
  elString += '<textarea id="new-note-content" autofocus></textarea>';
  elString += '<button id="insert-brackets">Insert &lt; &gt;</button>';
  elString += '<button id="insert-squig">Insert { }</button>';
  elString += '<button id="submit-new-note">Add Note</button>';
  elString += '</div>';

  // Add the element string created above to the document
  document.querySelector("body").innerHTML += elString;
  
  // Add class with animation to add-note-screen so it animates in
  document.querySelector("#add-note-screen").classList.add("note-screen-in");

  // This switches the event listener attached to the add-note-btn to 
  // close the create note dialog instead of creating it
  document.querySelector("#add-note-btn").removeEventListener("click", addNoteScreen);
  document.querySelector("#add-note-btn").addEventListener("click", removeNoteScreen, false);

  // Event listener on Insert <>  btn that adds <> </> where the users cursor was
  document.querySelector("#insert-brackets").addEventListener("click", function(){
    typeInTextarea(document.querySelector("textarea"), "<> </>")
  }, false);

  // Event listener on Insert {}  btn that adds { } where the users cursor was
  document.querySelector("#insert-squig").addEventListener("click", function(){
    typeInTextarea(document.querySelector("textarea"), "{ }")
  }, false);

  // Adds an eventlistener to the submit-new-note button to turn
  // the contents of the textarea into a note using the addNoteToList function
  document.querySelector("#submit-new-note").addEventListener("click", addNoteToList, false);			
}

// This function removes the create note screen
function removeNoteScreen() {

  // Turns the X back into a plus by removing the twist class
  document.querySelector("#add-note-btn").classList.remove("twist");
  
  // Add class with animation to add-note-screen so animates out
  document.querySelector("#add-note-screen").classList.add("note-screen-out");
  
  // Wait half a second to remove the add-note-screen so animation can play
  setTimeout(function(){ 
    
  // removes the add-note-screen from the document
  document.querySelector("body").removeChild(document.querySelector("#add-note-screen"));
  }, 500);

  // This switches and event listener attached to the add-note-btn to 
  // create the note dialog instead of closing it
  document.querySelector("#add-note-btn").removeEventListener("click", removeNoteScreen);
  document.querySelector("#add-note-btn").addEventListener("click", addNoteScreen, false); 

  // This function attaches event listeners to notes so they can be removed
  delNoteBtns();
}

// This function takes the contents of the textarea and creates a note
// This function is triggered by clicking the add-note-btn in the create note window
function addNoteToList() {

  // Store what the user has typed in the textarea into a noteText variable
  var noteText = document.querySelector("#new-note-content").value;

   // No empty notes a return statement stops further execution of the function
  if(noteText === "" || noteText === " "){
      return false;
  }

  // Replaces angle brackets with html entities so notes can contain html
  noteText = noteText.replace(/</g, "&lt;");
  noteText = noteText.replace(/>/g, "&gt;");

  // Wraps the note text in a .note container for display
  var newNote = '<div class="note fade-in">' + noteText + '<p class="del-note">X</p></div>';

  // Adds the new note to the documet
  document.querySelector("body").innerHTML += newNote;

  // Removes the create note screen from the document
  removeNoteScreen();

  // This function saves the contents of all notes to the browsers local storage
  saveNoteTxt();

}

// This function saves the contents of all notes to the browsers local storage
function saveNoteTxt(){

  // creates array of .notes
  var notes = document.querySelectorAll(".note");

  // creates empty object that will be saved to local storage
  var noteObj = {};

  // This loop puts the contents of each note in the notes array into the noteObj object
  for(var x = 0; x < notes.length; x++) {
    noteObj[x] = notes[x].innerHTML;
  }

  // This saves the object created above as noteAppStorageObj in the browsers local storage
  // Only a string can be saved to local storage, so te object is turned into a string
  localStorage.setItem('noteAppStorageObj', JSON.stringify(noteObj));
}

// This function attaches an event listener to each note to delete the note if the user clicks the X
// at the top right of the note
function delNoteBtns(){

  // Create an array of all the notes
  var els = document.querySelectorAll(".note");

  // Go through the array created above to get each individual note
  for(var x = 0; x < els.length; x++){

    // This adds and event listener on the note to detect user click
    els[x].addEventListener("click", function(e){

      // This checks if the user clicked the .del-note X at the top right
      // of each note
      if(e.target.className === "del-note"){

        // Remove the note that was clicked on for the document
        this.parentElement.removeChild(this);

        // This function saves the remaining notes to local storage
        saveNoteTxt();
      }					
    }, false);
  }						
}

// This function inserts text into a textarea where the user has their cursor placed
function typeInTextarea(el, newText) {

  // How many characters are before the cursor/selection
  var start = el.selectionStart;				

  // The position where the cursor/selection ends
  var end = el.selectionEnd;

  // Gets entire contents of the textarea element
  var text = el.value;

  // Gets the contents of the textarea before the position of the selection/cursor and stores it	
  var before = text.substring(0, start);

  // Gets the contents of the textarea after the position of the selection/cursor and stores it
  var after  = text.substring(end, text.length);

  // Combines the old text with the added content
  el.value = (before + newText + after);

  // Place the cursor after the newly inserted content
  el.selectionStart = el.selectionEnd = start + newText.length;

  // Focus cursor on textarea again
  el.focus();
}

// This event listener watches the plus button in the top bar and launches the
// addNoteScreen function which builds the add new note screen into the window
document.querySelector("#add-note-btn").addEventListener("click", addNoteScreen, false);

// This function will attach the eventlistener to allow the user to delete notes that
// came from the saved data
delNoteBtns();	


/* 
  To turn this web app into an iOS, Android or Windows Phone app check out these options
  1. Phonegap
  2. Cocoon.io
  3. Cordova CLI		
  
  This is a demo app and browser storage can be cleared, better options would be native storage within the app using cordova plugins or store the information on a server or in a database
*/		
  
  
// Ends DOM Content loaded
});