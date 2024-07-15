/**
 * @file server.js
 * @description This file contains the server-side code for a Node.js application using Express.js.
 * The server handles endpoints for managing technologies and scores stored in JSON files.
 */

const express = require('express');
const fs = require('fs'); //file system is used to work with files in /data folder
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

/**
 * Reads scores from the JSON file.
 * @returns {Object} The scores read from the file.
 */
function readScores() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './data/score.json'), 'utf8'));
}

/**
 * Writes scores to the JSON file.
 * @param {Object} scores - The scores to write to the file.
 */
function writeScores(scores) {
    fs.writeFileSync(path.join(__dirname, './data/score.json'), JSON.stringify(scores, null, 2));
}

/**
 * Starts the server and listens on the specified port.
 */
app.listen(PORT, () => {   //Listening port TODO: setup PORT in ENV file.
    console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * Get Endpoint to know the length of the array of technology objects.
 * This allows the front end to end the game without making failed API calls.
 * @name GetTechnologiesLength
 * @route {GET} /api/technologies
 * @response {number} The length of the technologies array.
 */

app.get('/api/technologies', (req, res) => {    // Get Endpoint to know the length of the array of objects. This allows the front end to end the game without making failed API calls with 404 or 'tech not found'.
    fs.readFile(path.join(__dirname, './data/technologies.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the file');
            return;
        }

        const technologies = JSON.parse(data);
        res.json(technologies.length); // this endpoint was repurposed from retrievign the full list to only return the lenght, this avoids making calls that result in 404 and end the game appropiately.
    });
});

/**
 * Endpoint to serve the image URL. The front end provides the index.
 * @name GetTechnologyImage
 * @route {GET} /api/technology/:index
 * @param {number} req.params.index - The index of the technology.
 * @response {Object} The image URL of the specified technology.
 */

app.get('/api/technology/:index', (req, res) => {
    fs.readFile(path.join(__dirname, './data/technologies.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the file');
            return;
        }

        const technologies = JSON.parse(data);
        const index = parseInt(req.params.index, 10);
        
        if (index < 0 || index >= technologies.length) {
            res.status(404).send('Technology not found');
            return;
        }

        res.json({ image: technologies[index].image }); // we only return the image url. this endpoint should only expose this.
    });
});

/**
 * Endpoint to check the guessed technology name and update scores in '/data/score.json' file.
 * @name PostGuess
 * @route {POST} /api/guess
 * @param {Object} req.body - The request body.
 * @param {number} req.body.index - The index of the technology.
 * @param {string} req.body.guessedName - The guessed name of the technology.
 * @param {string} [req.body.playerName='guest'] - The player's name.
 * @response {Object} Whether the guess is correct and the technology name.
 */
app.post('/api/guess', (req, res) => {
    const { index, guessedName, playerName} = req.body;   // index, guessedName and name. Name is used to assign score. Should be set at the beginning of the game and not changed.

    fs.readFile(path.join(__dirname, './data/technologies.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the file');
            return;
        }

        const technologies = JSON.parse(data);

        if (index < 0 || index >= technologies.length) {
            res.status(404).send('Technology not found');
            return;
        }

        const technology = technologies[index];
        const isCorrect = technology.technology.toLowerCase() === guessedName.toLowerCase();  // toLowerCase to make the technologies match as much as possible. Edge cases like Visual studio code have not been fixed yet.
        const value = technology.level; // level is used as score of each technology
        
        const scores = readScores();
        const existingScore = scores.scores.find(score => score.playerName === playerName);

        if (isCorrect) {

            if (existingScore) {
                existingScore.value += value;
            } else {
                scores.scores.push({ playerName, value });
            }

            writeScores(scores);
        } else {
            if (existingScore) {
                existingScore.value += 0; // 0 since its a wrong answer
            } else {
                scores.scores.push({ playerName, value: 0 });
            }

            writeScores(scores);

        }


        res.json({ isCorrect, technologyName: technology.technology });
    });

   
});

/**
 * Get scores from 'score.json' file. If the name matches a name in the score file, the score will be returned for that specific name.
 * @name GetScores
 * @route {GET} /api/scores/:name
 * @param {string} req.params.name - The player's name.
 * @response {Object} The scores of the specified player or the entire score list.
 */

app.get('/api/scores/:name', (req, res) => {
    const name = req.params.name;
    const scores = readScores();
    const userScores = scores.scores.filter(score => score.playerName === name);

    if(name == '' || userScores.length == 0) {  // if no name is passed or, once filtered, the name doesn't exist, we return the whole list and front end will have to show the score of the last object of the array of scores
        res.json(scores);
    } else {
        res.json(userScores);
    }
});


