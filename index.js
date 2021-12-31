const express = require("express");
let questionList = require("./questions.json");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// serve static contents
app.use(express.static("static"));

// dynamic handling
app.get("/questionsJson", (req, res) => {
  const quest = [];
  let qIter = 0;
  const response = [];
  for (q of questionList) {
    quest[qIter] = q.stem;
    const ops = [];
    let opIter = 0;
    for (o of q.options) {
      ops[opIter] = o;
      opIter++;
    }
    response[qIter] = { stem: quest[qIter], options: ops };
    qIter++;
  }
  res.json(response);
});

app.post("/check-ind", (req, res) => {
  req.body;
  qData = req.body.question;
  oData = req.body.option;

  let check = correct(qData, oData);
  if (check) {
    // console.log("correct");
    res.json({ correct: "correct", question: qData });
  } else {
    // console.log("incorrect");
    res.json({ correct: "incorrect", question: qData });
  }
});

function correct(qData, oData) {
  let index;
  for (q of questionList) {
    if (q.stem == qData) {
      index = questionList.indexOf(q);
    }
  }
  if (oData == questionList[index].options[questionList[index].answerIndex]) {
    return true;
  } else {
    return false;
  }
}

app.get("/check-final", (req, res) => {
  let submission = req.query;
  let outOf = questionList.length;
  let currentSc = 0;
  for (question in submission) {
    // console.log(submission[`${question}`]);
    if (correct(question, submission[`${question}`])) {
      currentSc++;
    }
  }
  let totalScore = (currentSc / outOf) * 100;

  let content = "";
  content += `<h1>Great Work</h1>`;
  content += `Your Score: ${totalScore}%<br>`;
  content += `<a href = "/">Go Again</a>`;
  res.send(content);
});

app.listen(80);
