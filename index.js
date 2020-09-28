//sconst http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.use(cors());
app.use(express.json());

//...

// app.post("/api/notes", (request, response) => {
//   const note = request.body;
//   console.log(note);

//   response.json(note);
// });

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.json(notes);
  //response.status(204).end();
});

app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((n) => n.id === id);
  const changeNote = { ...note, important: !note.important };
  notes = notes.map((note) => (note.id !== id ? note : changeNote));

  response.json(notes);
});

app.get("/api/notes", (req, res) => {
  console.log("backend talking talkingggggg");
  res.json(notes);
});

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

app.listen(PORT, () => {
  console.log(`Server runninmgggg on port ${PORT}`);
});
