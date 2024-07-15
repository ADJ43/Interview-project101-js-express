## Technology Guessing Game By Andres Jose
## Finalized on 7/11/2024

This project is a web-based game where users guess technologies based on images. The game fetches technology data from a server, displays images, and allows users to input their guesses. It keeps track of scores and provides feedback on the correctness of each guess.

## Table of Contents
- [Technology Guessing Game](#technology-guessing-game)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
  - [Game Logic](#game-logic)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features
- Display technology images and names.
- Allow users to guess the name of the technology.
- Provide feedback on correct and incorrect guesses.
- Track and display user scores.
- End the game after all technologies have been guessed.
- Option to restart the game.

## Prerequisites
- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd technology-guessing-game
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the server:
    ```bash
    node server.js
    ```
2. Open a web browser and go to `http://localhost:3000` to play the game.

## Project Structure
technology-guessing-game/
│
├── public/
│ ├── index.html
│ ├── style.css
│ └── app.js
│
├── data/
│ ├── score.json
│ └── technologies.json
│
├── server.js
│
├── package.json
└── README.md



- `public/`: Contains the frontend files.
  - `index.html`: The main HTML file.
  - `style.css`: The CSS file for styling.
  - `app.js`: The main JavaScript file for the frontend logic.
- `data/`: Contains JSON files for storing technologies and scores.
  - `score.json`: Stores user scores.
  - `technologies.json`: Stores technology data.
- `server.js`: The main server file.
- `package.json`: Contains metadata about the project and dependencies.
- `README.md`: The documentation file.

## API Endpoints

### `GET /api/technologies`
- **Description**: Retrieves the length of the technologies array.
- **Response**: `number` - The length of the technologies array.

### `GET /api/technology/:index`
- **Description**: Retrieves the image URL of the technology at the specified index.
- **Parameters**:
  - `index` - The index of the technology.
- **Response**: `Object` - The image URL of the specified technology.

### `POST /api/guess`
- **Description**: Checks the guessed technology name and updates scores.
- **Request Body**:
  - `index` - The index of the technology.
  - `guessedName` - The guessed name of the technology.
  - `playerName` - The player's name.
- **Response**: `Object` - Whether the guess is correct and the technology name.

### `GET /api/scores/:name`
- **Description**: Retrieves the scores of the specified player.
- **Parameters**:
  - `name` - The player's name.
- **Response**: `Object` - The scores of the specified player or the entire score list.

## Game Logic
### `changeTech()`
- **Description**: Changes the technology image and updates the game state.
- **Workflow**:
  1. On the first call, fetches the total length of the technologies array.
  2. Fetches the technology image for the current index and updates the display.
  3. If the currentIndex exceeds the dataLength, transitions to the end-of-game state.

### `submitGuess()`
- **Description**: Handles the guess game and calls the guess endpoint.
- **Workflow**:
  1. Ensures the player's name is set.
  2. Retrieves and formats the player's guess.
  3. Sends the guess to the server and receives the response.
  4. Updates the UI based on the server's response.
  5. Increments the currentIndex to move to the next technology.

### `updateScore()`
- **Description**: Updates the player's score by fetching it from the server.
- **Workflow**:
  1. Sends a GET request to fetch the scores for the current player.
  2. Updates the UI to display the player's score.

### `DOMContentLoaded Event Listener`
- **Description**: Initializes the game and sets up event listeners once the DOM is fully loaded.
- **Workflow**:
  1. Calls `changeTech()` to initialize the first technology.
  2. Adds event listeners for user interactions (clicks, keypresses).

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## Improvements to be Made
- Composite Tech names are not handled properly. Currently the game has only 1 composite name and it only creates a visualization problem
    TODO: Manipulate the strings and possibly modify the data handling of the enpoints to correct this issue. As tested, it doesn't seem to affect score or performance.
    The quick fix for this was to modify the "Technologies.json" file and make "Visual Studio Code" --> "VisualStudioCode".
- Set up the ENV variables in the .env file

- Create a real database and move all the data from the JSON files into that DB
- Add more features to the game, like a timer, hints, or difficulty levels

## License
This project is licensed under the MIT License and part of and interview project

## Acknowledgements
- Thanks for the opportunity to interview with you. I hope you like my code and the way I resolved the challenge. Looking forward to hear from you soon! Best Regards! AJ
