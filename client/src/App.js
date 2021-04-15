import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm"; //UserForm
import UserForm from "./components/UserForm";
//import axios from "axios";
import noteServices from "./services/notes";
import loginService from "./services/login";
import userService from "./services/user";
import { useField, useResource } from "./hooks";

const App = () => {
  //const [notes, setNotes] = useState([]);

  //const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [deleteIndicator, setDeleteIndicator] = useState(false);
  //const [loginVisible, setLoginVisible] = useState(false);
  const content = useField("text");
  const userPassword = useField("password");
  const nameContent = useField("text");
  // const name = useField('text')
  // const number = useField('text')
  console.log("resourcer rendering");
  const [notes, noteService] = useResource(
    "http://localhost:8081/api/notes",
    deleteIndicator
  );
  console.log(`number of notes ${notes.length}`);
  //const [persons, personService] = useResource('http://localhost:3002/persons')

  const noteFormRef = React.createRef();
  //fetch data from server
  // useEffect(() => {
  //   console.log("effect");
  //   noteServices.getAll().then((initialNote) => {
  //     setNotes(initialNote);
  //   });
  // }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    console.log({ loggedUserJSON });
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteServices.setToken(user.token);
    }
  }, []);

  // useEffect(() => {
  //   console.log("effect");

  //   noteServices
  //     .getAll(baseUrl)
  //     .then((initialResoures) => {
  //       console.log("promise fulfilled");
  //       setResources(initialResoures);
  //     })
  //     .catch((errr) => {
  //       console.log("server is down, please refresh the browser and try again");
  //       //setCountry([]);
  //     });
  // }, []);

  console.log("render", notes.length, "notes");

  //list of all notes to be displayed
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  // function that will be called on submission of note, add new note to the server

  // const addNote = (event) => {
  //   event.preventDefault();
  //   const noteObject = {
  //     content: newNote,
  //     //date: new Date(),
  //     important: Math.random() > 0.5,
  //   };

  //   noteServices.create(noteObject).then((returnedNote) => {
  //     setNotes(notes.concat(returnedNote));
  //     setNewNote("");
  //   });
  // };

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject);
  };

  const createUser = (userObject) => {
    noteFormRef.current.toggleVisibility();
    userService
      .create(userObject)
      .then((returnedUser) => {
        console.log({ returnedUser });
        // setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
        // setDeleteIndicator(!deleteIndicator);
        setErrorMessage(`User creation was successful`);

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .catch(() => {
        setErrorMessage(`User creation not successful`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`);

    const note = notes.find((n) => n.id === id);
    const changeNote = { ...note, important: !note.important };
    noteServices
      .update(id, changeNote)
      .then((returnedNote) => {
        console.log({ returnedNote });
        // setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
        setDeleteIndicator(!deleteIndicator);
      })
      .catch(() => {
        setErrorMessage(`importance not successfully toggled`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  //implement delete handler
  const removeNoteHandler = (id) => {
    console.log(`importance of ${id} needs to be toggled`);

    const noteItemObject = notes.find((n) => n.id === id);

    const confirmResult = window.confirm(
      `Do you really want to delete ${noteItemObject.content} from database/server`
    );
    if (!confirmResult) {
      return;
    }
    noteServices
      .deletePerson(id)
      .then((returnedNote) => {
        setDeleteIndicator(!deleteIndicator);
        //setNotes(notes.filter((note) => note.id !== id));
        // setErrorMessage(`note deletion was successful`);
        // setTimeout(() => {
        //   setErrorMessage(null);
        // }, 5000);
        console.log("note deletion was successful");
      })
      .catch(console.log("deletion-error"));
  };

  //handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteServices.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  //login input components
  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} content={content} />
    </Togglable>
  );

  const userForm = () => (
    <Togglable buttonLabel="new user" ref={noteFormRef}>
      <UserForm
        createUser={createUser}
        userPassword={userPassword}
        content={content}
        nameContent={nameContent}
      />
    </Togglable>
  );

  const logoutHandler = () => {
    const item = window.localStorage.getItem("loggedNoteappUser");
    if (item) {
      window.localStorage.removeItem("loggedNoteappUser");
      // setDeleteIndicator(!deleteIndicator);
      //setDeleteIndicator(!deleteIndicator);

      setErrorMessage(`${user.name} logged out`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setUser(null);
      //console.log({ deleteIndicator });
    }
    //setDeleteIndicator(!deleteIndicator);
  };
  //  createUser, userContent, userPassword

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        <>
          {" "}
          {loginForm()}
          {userForm()}
        </>
      ) : (
        <div>
          <p>
            {user.name} logged-in{" "}
            <button onClick={logoutHandler}>logout</button>
          </p>
          {noteForm()}
        </div>
      )}
      <h2>Notes</h2>

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
      {/* <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form> */}
      <Footer />
    </div>
  );
};

export default App;
