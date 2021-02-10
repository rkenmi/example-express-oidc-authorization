import authMiddleware from "./middleware/authMiddleware";

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

// Set middleware to parse POST request content. Set this before routes.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cors());

app.get('/', authMiddleware, (req: any, res: any) => {
  res.status(200).send(`You're authenticated! ${JSON.stringify(req.body.profile)}`).end();
});

(async () => {
  app.listen(PORT, () => {
    console.log('Started at http://localhost:%d', PORT);
  });
})();
