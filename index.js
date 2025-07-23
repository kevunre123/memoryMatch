const gridContainer = document.querySelector(".grid-container");
// Create cards array
let cards = [];
// First card and second card to compare
let firstCard, secondCard;
// Comparing two cards
let lockBoard = false;
// Count attempts of the user
let score = 0;

// Query selector used with .score class, textContent will equal to score variable
document.querySelector(".score").textContent = score;
// Fetch API, converts file
fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

// function to shuffle cards
// Fisher-Yates Shuffle: Randomizes the order of items in the 'cards' array
function shuffleCards() {
    // Initialize the index to track how many elements remain to be shuffled
    let currentIndex = cards.length;

    // Declare variables to hold a random index and temporary value for swapping
    let randomIndex, temporaryValue;

    // Continue shuffling until all elements have been processed
    while (currentIndex !== 0) {
        // Pick a random index from the unshuffled portion of the array
        randomIndex = Math.floor(Math.random() * currentIndex);

        // Move the current index backward to shrink the unshuffled region
        currentIndex -= 1;

        // Swap the element at currentIndex with the one at randomIndex
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

    // The 'cards' array is now randomly shuffled in place
}

// declare function generateCards
function generateCards() {
    // for...of loop, each iteration <card> holds one object from cards array
    for (let card of cards) {
        // creating card element, new <div> DOM element
        const cardElement = document.createElement("div");
        // assign the class: <card> to the element
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        // backticks used to enable javascript variables inside of strings
        cardElement.innerHTML = `<div class="front">
            <img class="front-image" src="${card.image}" />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        // event listener used to flip cards on mouse-click
        cardElement.addEventListener("click", flipCard)

    }
}

//function to handle logic of when a card is clicked
function flipCard(){
    //This will prevent clicking if the board is locked, e.g. waiting for unmatched cards to flip back
    if (lockBoard) return;

    //This will prevent flipping the same card twice in a row
    if (this === firstCard) return;

    //Visually flip the clicked card by adding CSS class
    this.classList.add("flipped");

    //If this is the first card flipped in a pair, store it and exit the function
    if (!firstCard) {
        firstCard = this;
        return;
    }
    
    //Otherwise <this> is the second card in the pair
    secondCard = this;

    //Incrementing score
    score++;

    //Used to update score display in the UI
    document.querySelector(".score").textContent = score;

    //Locks the board to prevent further input until selected cards have been assessed
    lockBoard = true;

    checkMatch();
}

//function match
//Comparing the first and second card's data-name attribute, access values using dataset property
function checkMatch() {
    //Compare data-name attributes of a pair of flipped cards
    //dataset.name reads the 'data-name' custom HTML attribute attached to each card
    //Return true if selected cards are a matching pair
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; 
    //Use a ternary expression to decide next action
    //1:If its a match, disable further interaction with these cards- disablecards()
    //2:If not, unflip them visually- unflipcards()
    isMatch ? disableCards() : unflipCards();
}

function disableCards(){
    //Remove event listened 'click' so matched cards cant be flipped
    //Prevent any future interaction with matched pair
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    //Clear board-tracking variables to allow a new pair to be selected
    resetBoard();
}

function unflipCards() {
    //Timeout assigned to give player a brief moment to memorise image before the card flips back
    //1000 = 1 second
    setTimeout(() => {
        //'flipped' class removed, rotating failed matching pair facedown position
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        //Board reset for a new pair to be selected
        resetBoard();

    }, 1000);
}

//function reset board
function resetBoard() {
    //Clear both card references to prepare for next selection
    firstCard = null;
    secondCard = null;
    //Unlock the board so the player can interact
    lockBoard = false;
}

function restart(){
    //Clear board 
    resetBoard();
    //Randomise cards
    shuffleCards();
    //Reset score
    score = 0;
    //Update score display in UI
    document.querySelector(".score").textContent = score;
    //Clear the current card grid from the DOM
    gridContainer.innerHTML = "";
    //Generate new card elements and inject into grid
    generateCards();
}