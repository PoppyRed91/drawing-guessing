"use strict"

//importing loader

import './loading.js';
import { HideLoader, ShowLoader } from './loading.js';


// function for main menu

let startEl = document.createElement("div")
document.body.appendChild(startEl);
startEl.classList.add("mainmenu-wrapper")

let galleryWrapper = document.createElement("gallery");
galleryWrapper.classList.add("gallery-wrapper");
document.body.appendChild(galleryWrapper);

let startGameButton
let title

function mainMenu() {
    title = document.createElement("h1");
    title.innerText = "Draw and Guess the Animal";
    startEl.appendChild(title);
    title.classList.add("title")

    startGameButton = document.createElement("button");
    startGameButton.innerText = "Start Game";
    startEl.appendChild(startGameButton);
    startGameButton.classList.add("button")
}

mainMenu()


// galleryCards array in which I store instances of galleryCard

let cardEl = document.createElement("card");
cardEl.classList.add("card");
galleryWrapper.appendChild(cardEl);

let galleryCards = []

loadFromLocalStorage()
displayCards()


// function with instructions

let instructions
let continueGameButton
let instructionsEl = document.createElement("div");
instructionsEl.classList.add("instructions-wrapper");
document.body.appendChild(instructionsEl);

function giveInstructions() {
    instructions = document.createElement("p");
    instructions.innerText = "Player 1 - close your eyes. \n Player 2 - when you click on Continue you will be given an animal.  \n You have 20 seconds to draw it.  \n When your time runs out, Player 1 needs to guess what animal that is.";
    instructionsEl.appendChild(instructions);
    instructions.classList.add("instructions")

    continueGameButton = document.createElement("button");
    continueGameButton.innerText = "Continue";
    instructionsEl.appendChild(continueGameButton);
    continueGameButton.classList.add("button")
    continueGameButton.addEventListener("click", function () {
        ShowLoader()
        fetchRandomAnimal()
        continueGameButton.disabled = true;
        instructionsEl.style.display = "none";
    })
}

startGameButton.addEventListener("click", function () {
    giveInstructions()
    galleryWrapper.style.display = "none";
    startEl.style.display = "none";
})


// API 

let randomAnimal

async function fetchRandomAnimal() {
    try {
        const response = await fetch("https://animal-name-api.onrender.com/random-animal")
        randomAnimal = await response.json()
        showAnimal()
    }
    catch (error) {
        console.log(error)
    }
};


let animalEl
let drawButton
let correctAnimal;
let assignmentEl = document.createElement("div");
assignmentEl.classList.add("assignment-wrapper");
document.body.appendChild(assignmentEl);

function showAnimal() {
    HideLoader();
    animalEl = document.createElement("p");
    animalEl.innerText = randomAnimal.animal;
    correctAnimal = randomAnimal.animal;
    assignmentEl.appendChild(animalEl);
    animalEl.classList.add("animal-element")
    drawButton = document.createElement("button");
    drawButton.innerText = "Start Drawing";
    assignmentEl.appendChild(drawButton);
    drawButton.classList.add("button")

    drawButton.addEventListener("click", function () {
        drawButton.disabled = true;
        createCanvas()
        showCounter()
        assignmentEl.style.display = "none";

    })
}


// timer

let drawingTimer = document.createElement("div");
drawingTimer.classList.add("drawingEl-wrapper");
document.body.appendChild(drawingTimer);

let seconds = 20;
let counterEl
let interval

function showCounter() {
    counterEl = document.createElement("p");
    counterEl.innerText = seconds;
    drawingTimer.appendChild(counterEl);
    counterEl.classList.add("counter")

    interval = setInterval(function () {
        if (seconds <= 0) {
            canDraw = false;
            clearInterval(interval);
            createInputEl()
        }
        else {
            seconds -= 1;
            counterEl.innerText = seconds;
        }
    }, 1000)
}


// canvas

let canvasEl
let canvasContext
let isDrawing = false;
let canDraw = true;


// create canvas 

function createCanvas() {
    canvasEl = document.createElement("canvas");
    drawingTimer.appendChild(canvasEl);
    canvasEl.classList.add("canvas");

    canvasContext = canvasEl.getContext("2d");
    canvasContext.scale(0.5, 0.5);

    canvasEl.addEventListener("pointerdown", function (e) {
        isDrawing = true;

        const x = e.clientX - canvasEl.offsetLeft;
        const y = e.clientY - canvasEl.offsetTop;

        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
    });

    canvasEl.addEventListener("pointermove", function (e) {
        if (isDrawing && canDraw) {
            const x = e.clientX - canvasEl.offsetLeft;
            const y = e.clientY - canvasEl.offsetTop;

            canvasContext.lineTo(x, y);
            canvasContext.stroke();
        }
    })

    canvasEl.addEventListener("pointerup", function (e) {
        isDrawing = false;
        canvasContext.stroke();
        canvasContext.closePath();
    })
}


// Player 1 input

let inputEl
let userInput
let userInputValue
let submitGuessButton

let inputElWrapper = document.createElement("div");
inputElWrapper.classList.add("inputEl-wrapper");
document.body.appendChild(inputElWrapper)

function createInputEl() {
    inputEl = document.createElement("p");
    inputEl.innerText = "What animal is this?";
    inputElWrapper.appendChild(inputEl);
    inputEl.classList.add("input-el");

    userInput = document.createElement("input");
    inputElWrapper.appendChild(userInput);
    userInput.classList.add("user-input-el");

    submitGuessButton = document.createElement("button");
    submitGuessButton.innerText = "Submit";
    inputElWrapper.appendChild(submitGuessButton);
    submitGuessButton.classList.add("button");

    submitGuessButton.addEventListener("click", function () {
        userInputValue = userInput.value;
        console.log(userInputValue)
        comparingInputToApi()
        inputElWrapper.style.display = "none";
        drawingTimer.style.display = "none";
    })
}


// comparing input to api

let correctEl
let inCorrectEl
let inCorrectQuote
let inputNull
let playAgainButton

let answerEl = document.createElement("div");
answerEl.classList.add("answer-wrapper");
document.body.appendChild(answerEl)

function comparingInputToApi() {
    if (userInputValue.toLowerCase() === randomAnimal.animal.toLowerCase()) {
        correctEl = document.createElement("h2");
        correctEl.innerText = "Correct!";
        answerEl.appendChild(correctEl);
        correctEl.classList.add("correct-el");
        submitGuessButton.disabled = true;
        saveToLocalStorage();
        displayCards();
    }
    else {
        if (userInputValue === "") {
            inputNull = document.createElement("p");
            inputNull.innerText = "Please fill in the field"
            answerEl.appendChild(inputNull);
            inputNull.classList.add("input-null-el")
        }
        else {
            inCorrectEl = document.createElement("h2");
            inCorrectEl.innerText = "Nope!";
            answerEl.appendChild(inCorrectEl);
            inCorrectEl.classList.add("incorrect-el");

            inCorrectQuote = document.createElement("p")
            inCorrectQuote.innerText = `It's actually a ${randomAnimal.animal}!`;
            answerEl.appendChild(inCorrectQuote);
            inCorrectQuote.classList.add("incorrect-quote");
            submitGuessButton.disabled = true;
        }
        saveToLocalStorage();
        displayCards();
    }
    playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    answerEl.appendChild(playAgainButton);
    playAgainButton.classList.add("button")

    playAgainButton.addEventListener("click", function () {
        location.reload()
    })
}


// local storage

class GalleryCard {
    correctAnimalName;
    userAnimalName;
    animalDrawing;

    constructor(correctAnimalName, userAnimalName, animalDrawing) {
        this.correctAnimalName = correctAnimalName;
        this.animalDrawing = animalDrawing;
        this.userAnimalName = userAnimalName;
    }
}


// saves gallerycards array in local storage as json 

function saveToLocalStorage() {
    let url = canvasEl.toDataURL("image/png");
    let card = new GalleryCard(correctAnimal, userInputValue, url)
    galleryCards.push(card)
    localStorage.setItem("cards", JSON.stringify(galleryCards))
}


// loads from local storage array gallerycards if there is a key cards

function loadFromLocalStorage() {
    if (localStorage.getItem("cards"))
        galleryCards = JSON.parse(localStorage.getItem("cards"));
}


// for every card in gallerycards creates a new element and sets its source

function displayCards() {

    for (let card of galleryCards) {
        let cardWrapperEl = document.createElement("div");

        cardWrapperEl.classList.add("card-wrapper");

        let img = document.createElement("img");
        let text = document.createElement("p");
        text.innerText = "Given animal was: " + card.correctAnimalName + ".\n Player wrote in: " + card.userAnimalName;
        img.src = card.animalDrawing;
        cardWrapperEl.appendChild(text);
        cardWrapperEl.appendChild(img);

        galleryWrapper.appendChild(cardWrapperEl);
    }
}