import { getPuzzle, generatePuzzle, generateSolvedPuzzle } from "./public/modules/puzzle.js";
import express from 'express';

const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// website endpoints
app.use("/history/", express.static("public/history.html"));
app.use("/statistics/", express.static("public/statistics.html"));

app.use("/solve", express.static("public/solve.html"));

//TODO: with the solve endpoint, take the puzzle uuid and "load" the puzzle from the database

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});


// API routing


// generate a new puzzle
apiRouter.get("/puzzle/:user/new/", async (req, res) => {
  try {
    const puzzle = await generatePuzzle(); //TODO: may need timeout
    // TODO: add puzzle to database
    res.send(puzzle.basicObject());
  } catch (error) {
    return error; // is this right?
  }
});

apiRouter.get("/puzzle/:user/recent/", async (req, res) => {
  try {
    // TODO: get most recent puzzles from database
    const uuids = []; // max of 12 puzzles
    for (let i = 0; i < 12; i++) {
      uuids.push(crypto.randomUUID());
    }
    res.send(uuids);
  } catch (error) {
    return error;
  }
});


// get a puzzle
apiRouter.get("/puzzle/:user/:id/", async (req, res) => {
  try {
    const puzzle = await generatePuzzle(); //TODO: get puzzle from databaase
    res.send(puzzle.basicObject());
  } catch (error) {
    return error; // is this right?
  }
});

// post/save a puzzle
apiRouter.post("/puzzle/:user/:id/", async (req, res) => {
  try {
    // parse puzzle from body
    const {solution, table, id, genDate, solveDate } = req.body;
    // TODO: save puzzle to database

    res.send();
  } catch (error) {
    return error; // is this right?
  }
});














app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


/*
// GetScores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', (req, res) => {
  scores = updateScores(req.body, scores);
  res.send(scores);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
let scores = [];
function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}
*/
