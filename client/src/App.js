import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
//import axios from "axios";
import noteServices from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  //fetch data from server
  useEffect(() => {
    console.log("effect");
    noteServices.getAll().then((initialNote) => {
      setNotes(initialNote);
    });
  }, []);
  console.log("render", notes.length, "notes");

  //list of all notes to be displayed
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  // function that will be called on submission of note, add new note to the server

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      //date: new Date(),
      important: Math.random() > 0.5,
    };

    noteServices.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`);
    //const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changeNote = { ...note, important: !note.important };
    noteServices
      .update(id, changeNote)
      .then((returnedNote) => {
        console.log({ returnedNote });
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
        //setNotes(returnedNote);
      })
      .catch(() => {
        setErrorMessage(`Note s{note.content} was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        //setNotes(notes.filter((n) => n.id !== id));
      });
    // .catch((error) => {
    //   alert(`the note ${note.content} was already deleted`);
    // });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  //implement delete handler
  const removeNoteHandler = (id) => {
    console.log(`importance of ${id} needs to be toggled`);
    //const url = `http://localhost:3001/notes/${id}`;
    const noteItemObject = notes.find((n) => n.id === id);
    //const changeNote = { ...note, important: !note.important };
    const confirmResult = window.confirm(
      `Do you really want to delete ${noteItemObject.content} from database/server`
    );
    if (!confirmResult) {
      return;
    }
    noteServices
      .deletePerson(id)
      .then((returnedNote) => {
        setNotes(notes.filter((note) => note.id !== id));
        // setNotes(returnedNote);
        console.log("note deletion was successful");
      })
      .catch(console.log("deletion-error"));
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show{showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            removeNoteHandler={() => removeNoteHandler(note.id)}
          />
        ))}
      </ul>
      {/* add html form that will be used for adding new notes */}
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
