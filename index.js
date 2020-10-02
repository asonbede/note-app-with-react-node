//sconst http = require("http");
//require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");
const Note = require("./models/note");
const { error } = require("console");

app.use(cors());
app.use(express.json());

//creating new note 5f70f46af5f0a63200704538
app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log({ body });
  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  note.save().then((saveedNote) => {
    console.log({ saveedNote });
    response.json(saveedNote);
  });

  // notes = notes.concat(note);

  // response.json(note);
});

//fetching a single note
app.get("/api/notes/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  console.log({ id: request.params.id });
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      // console.log(error);
      // //response.status(500).end();
      // response.status(400).send({ error: "malformatted id" });
      next(error);
    });
});

//delete a note from the database
app.delete("/api/notes/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  //notes = notes.filter((note) => note.id !== id);
  Note.findByIdAndDelete(request.params.id)
    .then((resultOfDelete) => {
      console.log({ resultOfDelete });
      response.status(204).end();
    })
    .catch((error) => next(error));
  //   .catch(console.log("error occurredfrmdelete"));
  // // response.json(notes);
  // //response.status(204).end();
});

// })//handler for fetching all notes
app.get("/api/notes", (request, response) => {
  console.log("okayyyyyyyy");
  Note.find({}).then((notes) => {
    console.log(notes, "iiyyyyy");
    response.json(notes);
    //mongoose.connection.close();
  });
});

//update a note
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  Note.findByIdAndUpdate(request.params.id, body, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

//unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

//middleware error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

//deployment setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//const PORT = 8081;
const PORT = process.env.PORT || 8081;
//app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
//const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runninmgggg on port ${PORT}`);
});
//https://note-react-note-app1.herokuapp.com/
