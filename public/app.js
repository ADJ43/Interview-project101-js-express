/**
 * @file app.js
 * @description This file contains the client-side code for a web application that allows users to guess technologies based on images.
 * It handles fetching data from the server, updating the UI, and managing the game state.
 */

let playerName = ''; // Variable to store the player's name
let currentIndex = 0;
let dataLength = 0;
let revealTechName = false;

/**
 * Changes the technology image and updates the game state.
 * 
 * This function is responsible for managing the progression of the game by 
 * fetching and displaying the next technology image based on the current index.
 * It handles the initial fetch of the total number of technologies, updates the 
 * displayed image, and manages the end-of-game state.
 * 
 * Workflow:
 * 1. On the first call (when currentIndex is 0), it fetches the total length of 
 *    the technologies array from the server to determine the game's length.
 *    The game is flexible, it will take any modification of the length of array in file technologies.json, unless the length is 0, that scenario hasn't been addressed or tested.
 * 2. It then fetches the technology image for the current index and updates the 
 *    display accordingly.
 * 3. If the currentIndex exceeds the dataLength, it transitions to the end-of-game 
 *    state, displaying the final score and updating the UI to show the "Play Again" button.
 * 
 * UI Updates:
 * - Clears and hides previous guess feedback.
 * - Updates the image element with a transition effect.
 * - Resets the guess input field and button text.
 * 
 * End-of-Game:
 * - Hides game elements (image, input field, button).
 * - Displays "END OF GAME" message and the "Play Again" button.
 * - Calls updateScore() to fetch and display the final score.
 */

async function changeTech () {        
    if (currentIndex == 0 ) {         
        const techArrayLength = await fetch(`/api/technologies`);
        dataLength = await techArrayLength.json();
    }
    
    if (currentIndex < dataLength) {    // this block handles from array pos 0 to dataLenght
        const currentTech = await fetch(`/api/technology/${currentIndex}`);
        const tech = await currentTech.json();

        document.getElementById('correct').style.opacity = 0;
        document.getElementById('wrong').style.opacity = 0;
        const imageElement = document.getElementById('tech-image');
        imageElement.classList.remove('show');
        if(currentIndex == 0) {imageElement.src = tech.image;}
        setTimeout(() => {
            imageElement.src = tech.image;
            imageElement.onload = () => {
                imageElement.classList.add('show');
                imageElement.style.opacity = 1;
            };
        }, 500); // This delay should match the duration of your CSS transition
        document.getElementById('tech-image').style.opacity = 1;
        document.getElementById('tech-name').style.opacity = 0;
        document.getElementById('tech-name').textContent = " "; // Clear the text content
        document.getElementById('tech-guess').value = ""; // Clear the guess input
        document.getElementById('next-btn').textContent = "Submit"; // Update button text
    
        revealTechName = true;
    }

    if (currentIndex >= dataLength) {       // This block handles the end of the game
        updateScore();
        document.getElementById('tech-image').style.display = 'none';
        document.getElementById('tech-guess').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('title-guess').style.display = 'none';
        document.getElementById('tech-name').style.opacity = 1;
        document.getElementById('tech-name').textContent = "END OF GAME";
        document.getElementById('tech-name').style.color= "black";
        document.getElementById('correct').style.display = 'none';
        document.getElementById('wrong').style.display = 'none';
        document.getElementById('play-again-btn').style.display = "block";
        return;
    }
   
}

/**
 * Handles the guess game and calls the guess endpoint.
 * 
 * This function is responsible for processing the player's guess, sending it to the server,
 * and updating the game state based on the server's response. It verifies the player's guess,
 * updates the UI to reflect whether the guess was correct or incorrect, and increments the 
 * currentIndex to move to the next technology.
 * 
 * Workflow:
 * 1. Ensures the player's name is set. If not, it triggers the start game button.
 * 2. Retrieves the player's guess from the input field and formats it by removing whitespace.
 * 3. Sends the guess to the server via a POST request to the /api/guess endpoint.
 * 4. Receives the server's response, which includes whether the guess was correct and the actual technology name.
 * 5. Updates the UI to show the technology name, changes the color to green for a correct guess or red for an incorrect guess,
 *    and displays appropriate feedback messages.
 * 6. Changes the button text to "Next" and increments the currentIndex to prepare for the next round.
 * 
 * UI Updates:
 * - Displays the technology name.
 * - Changes the text color based on the correctness of the guess.
 * - Shows or hides feedback messages for correct and incorrect guesses.
 * 
 * @async
 * @function submitGuess
 */

async function submitGuess() {

    const startGameButton = document.getElementById('start-game');
    if (playerName == "") {
        startGameButton.click();
    }
    let guessedName = document.getElementById('tech-guess').value;
    guessedName = guessedName.replace(/\s+/g, ''); // Remove all whitespace characters, wherever they are, this caused problem with "HTML 5" for example.
    const response = await fetch('/api/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: currentIndex, guessedName, playerName})
    });

    const result = await response.json();
    const techName = document.getElementById('tech-name');
    techName.textContent = result.technologyName;
    techName.style.opacity = 1;

    if (result.isCorrect) {         // this block handles the guess when the answer is correct
        techName.style.color = 'green';
        document.getElementById('correct').style.opacity = 1;
        document.getElementById('wrong').style.opacity = 0;
    } else {                        // this block handles the wrong answer
        techName.style.color = 'red';
        document.getElementById('correct').style.opacity = 0;
        document.getElementById('wrong').style.opacity = 1;
    }

    document.getElementById('next-btn').textContent = "Next";
    currentIndex++;
    revealTechName = false;

}

const imageElement = document.getElementById('tech-image');
const scoreElement = document.getElementById('score');

/**
 * Updates the player's score by fetching it from the server.
 * 
 * This function retrieves the current player's score from the server and updates the UI to display the score.
 * It sends a GET request to the /api/scores/:name endpoint, where :name is the player's name, to fetch the score data.
 * The server response can either be the full scores object or a filtered score specific to the player.
 * The function then updates the score display based on the fetched data.
 * 
 * Workflow:
 * 1. Sends a GET request to the server to fetch the scores for the current player.
 * 2. Receives the server's response, which contains the scores data.
 * 3. Determines if the response contains the full scores object or a filtered score for the specific player.
 * 4. Updates the UI to display the player's score:
 *    - If the player's score is found, it displays a congratulatory message with the score.
 *    - If the player's score is not found, it displays a message indicating a score of 0.
 * 
 * UI Updates:
 * - Updates the scoreElement text content to show the player's score.
 * 
 * @async
 * @function updateScore
 */

async function updateScore() {
    const response = await fetch(`/api/scores/${playerName}`);
    const scores = await response.json();

    let playerScore;

    if (scores.scores) { // if we received the whole scores object
        playerScore = scores.scores[scores.scores.length - 1]; // take the last item
    } else {
        playerScore = scores[0]; // if we received filtered score for the user
    }

    if (playerScore) {
        scoreElement.textContent = `Congratulations ${playerName}, your score is: ${playerScore.value}`;
    } else {
        scoreElement.textContent = `Good try ${playerName}, unfortunately your score is: 0`;
    }
}

/**
 * Initializes the game and sets up event listeners once the DOM is fully loaded.
 * 
 * This function sets up the initial game state by calling changeTech() to load the first technology.
 * It also registers various event listeners for handling user interactions throughout the game.
 * 
 * Workflow:
 * 1. Calls changeTech() to initialize the first technology and get the total number of technologies.
 * 2. Adds a click event listener to the "next-btn" button to either submit a guess or load the next technology image.
 * 3. Adds a keypress event listener to the "tech-guess" input field to handle "Enter" key presses and prevent page reloads.
 * 4. Adds a click event listener to the "play-again-btn" button to reload the page when the user wants to play again.
 * 5. Adds a click event listener to the "start-game" button to start the game with the entered player name or a default name.
 * 
 * UI Updates:
 * - Initializes the first technology.
 * - Toggles between showing the technology image and submitting a guess based on the revealTechName flag.
 * - Prevents the default form submission behavior when the "Enter" key is pressed.
 * - Reloads the page to restart the game when the "Play Again" button is clicked.
 * - Hides the player name input field and start game button once the game starts, and displays the player's name.
 */


document.addEventListener('DOMContentLoaded', function() { //Trigger on page load
    changeTech(); // Initialize the first technology, also calls the technologies.length

    document.getElementById('next-btn').addEventListener('click', function() {
        if (revealTechName) {       // revealTechName is used to phase bewtween showing image of next guess and doing the actual guess.
            submitGuess();
        } else {
            changeTech();
        }
    });

    document.getElementById('tech-guess').addEventListener('keypress', function(event) { // add handler for when "enter" is pressed in the input form preventing reload
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission behavior
            document.getElementById('next-btn').click(); // Trigger the button click
        }
    });

    document.getElementById('play-again-btn').addEventListener('click', function () {       //When the game ends we show the score and if the user pressed play again we reload the page.
        location.reload();
    })

    document.getElementById('start-game').addEventListener('click', () => {
        playerName = document.getElementById('player-name').value.trim();
        if(!playerName) {
            playerName = 'Guest';
        }
            document.getElementById('player-name').style.display = 'none';
            document.getElementById('start-game').style.display = 'none';
            const scoreElement = document.createElement('div');
            scoreElement.id = 'player-info';
            scoreElement.textContent = `Player: ${playerName}`;
            document.getElementById('player-name-area').appendChild(scoreElement);
            changeImage(); // Start the game by loading the first image
        }
    );
});