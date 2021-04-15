import React, { useState } from "react";

const UserForm = ({ createUser, content, userPassword, nameContent }) => {
  //const [newNote, setNewNote] = useState("");

  // const handleChange = (event) => {
  //   setNewNote(event.target.value);
  // };

  const addUser = (event) => {
    console.log("valuee", content.value);
    event.preventDefault();
    createUser({
      username: content.value,
      name: nameContent.value,
      password: userPassword.value,
    });

    //setNewNote("");
  };

  return (
    <div>
      <h2>Create a new User</h2>

      <form onSubmit={addUser}>
        <div>
          Username <input {...content} />{" "}
        </div>
        <div>
          Name <input {...nameContent} />{" "}
        </div>
        <div>
          Password <input {...userPassword} />{" "}
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default UserForm;
