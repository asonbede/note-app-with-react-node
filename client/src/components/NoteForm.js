import React, { useState } from "react";

const NoteForm = ({ createNote, content }) => {
  //const [newNote, setNewNote] = useState("");

  // const handleChange = (event) => {
  //   setNewNote(event.target.value);
  // };

  const addNote = (event) => {
    console.log("valuee", content.value);
    event.preventDefault();
    createNote({
      content: content.value,
      important: Math.random() > 0.5,
    });

    //setNewNote("");
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input {...content} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
