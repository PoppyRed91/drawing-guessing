"use strict"

// function for main menu

let startGameButton
let title

function mainMenu() {
    title = document.createElement("h1");
    title.innerText = "Draw and Guess the Animal";
    document.body.appendChild(title);
    title.classList.add("title")

    startGameButton = document.createElement("button");
    startGameButton.innerText = "Start Game";
    document.body.appendChild(startGameButton);
    startGameButton.classList.add("button")
}

mainMenu()

// function with instructions

let instructions
let continueGameButton

function giveInstructions() {
    instructions = document.createElement("p");
    instructions.innerText = "Player 1 - close your eyes. Player 2 - when you click on Continue you will be given an animal. You have 20 seconds to draw it. When your time runs out, Player 1 needs to guess what animal that is.";
    document.body.appendChild(instructions);
    instructions.classList.add("instructions")

    continueGameButton = document.createElement("button");
    continueGameButton.innerText = "Continue";
    document.body.appendChild(continueGameButton);
    continueGameButton.classList.add("button")
    continueGameButton.addEventListener("click", function () {
        fetchRandomAnimal()
        continueGameButton.disabled = true;
    })
}

startGameButton.addEventListener("click", function () {
    giveInstructions()
})


// API 

let randomAnimal

async function fetchRandomAnimal() {
    try {
        const response = await fetch("https://animal-name-api.onrender.com/random-animal");
        randomAnimal = await response.json()
        showAnimal()
    }
    catch (error) {
        console.log(error)
    }
}

let animalEl
let drawButton

function showAnimal() {
    animalEl = document.createElement("p");
    animalEl.innerText = randomAnimal.animal;
    document.body.appendChild(animalEl);
    animalEl.classList.add("animal-element")
    drawButton = document.createElement("button");
    drawButton.innerText = "Start Drawing";
    document.body.appendChild(drawButton);
    drawButton.classList.add("button")

    drawButton.addEventListener("click", function () {
        createCanvas()
        showCounter()
    })
}

// canvas

let canvasEl
let canvasContext
let isDrawing = false;
let canDraw = true;


function createCanvas() {
    canvasEl = document.createElement("canvas");
    document.body.appendChild(canvasEl);
    canvasEl.classList.add("canvas");

    canvasContext = canvasEl.getContext("2d");

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
            canvasContext.stroke()
        }
    })

    canvasEl.addEventListener("pointerup", function (e) {
        isDrawing = false;
        canvasContext.stroke();
        canvasContext.closePath();
    })
}

// timer

let seconds = 5;
let counterEl
let interval

function showCounter() {
    counterEl = document.createElement("p");
    counterEl.innerText = seconds;
    document.body.appendChild(counterEl);
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


// Player 1 input

let inputEl
let userInput
let userInputValue
let submitGuessButton

function createInputEl() {
    inputEl = document.createElement("p");
    inputEl.innerText = "What animal is this?";
    document.body.appendChild(inputEl);
    inputEl.classList.add("input-el");

    userInput = document.createElement("input");
    document.body.appendChild(userInput);
    userInput.classList.add("user-input-el");

    submitGuessButton = document.createElement("button");
    submitGuessButton.innerText = "Submit";
    document.body.appendChild(submitGuessButton);
    submitGuessButton.classList.add("button");

    submitGuessButton.addEventListener("click", function () {
        userInputValue = userInput.value;
        console.log(userInputValue)
        comparingInputToApi()
    })
}

// comparing input to api

let correctEl
let inCorrectEl
let inCorrectQuote

function comparingInputToApi() {
    if (userInputValue.toLowerCase() === randomAnimal.animal.toLowerCase()) {
        correctEl = document.createElement("h2");
        correctEl.innerText = "Correct!";
        document.body.appendChild(correctEl);
        correctEl.classList.add("correct-el");
    }
    else {
        inCorrectEl = document.createElement("h2");
        inCorrectEl.innerText = "Nope!";
        document.body.appendChild(inCorrectEl);
        inCorrectEl.classList.add("incorrect-el");

        inCorrectQuote = document.createElement("p")
        inCorrectQuote.innerText = `It's actually a ${randomAnimal.animal}!`;
        document.body.appendChild(inCorrectQuote);
        inCorrectQuote.classList.add("incorrect-quote");
    }
}


// local storage









/*let canvasEl = document.querySelector("#canvas");
let canvasContext = canvasEl.getContext("2d");

counterEl = document.querySelector("#counter");


let isDrawing = false;
let canDraw = true;

let seconds = 20;

/* timer
    setInterval method calls a function at specified intervals.
    It takes as parameters: 
    1) a function to be executed every delay milliseconds and 
    2) milliseconds

    it returns an interval ID which identifies the interval
    and can be later removed by calling clearInterval() that takes
    as a parameter a function that serves as first parameter in
    setInterval() method.



setInterval(function () {
    if (seconds <= 0) {
        canDraw = false;
    }
    else {
        seconds -= 1;

        counterEl.innerText = seconds;
    }

}, 2000);

*/
/*  adding an event listener for a click of the mouse, to be able
    to draw only when the mouse is clicked. isDrawing = true.
    pointerdown works for button on the mouse, touchpad and pen when
    the stylus makes physical contact with the digitizer

    DOCUMENTATION 

    The clientX  property of the MouseEvent interface provides
    the horizontal coordinate within the application's viewport
    at which the event occurred (as opposed to the coordinate 
    within the page). clientY same but vertical.

    offsetLeft property returns the number of pixels that the upper
    left corner of the current element is offset to the left

    offsetTop property returns the distance from the outer border of the
    current element (incl.margin) to tje top padding edge of the offsetParent,
    the closest positioned ancestor element.

    EXPLANATION

    Here we want to determine the mouse position within the canvas. 
    In const x we stored the horizontal position of the mouse pointer
    within the canvas. By substracting the offsetLeft from the
    e.clientX we adjusted the horizontal mouse coordinate relative to the
    canvas, basically we wanted to have the horizontal position of the 
    mouse pointer within the canvas element and not the entire window.
    Same is done for const y but for determing vertical position.
    const x and const y determine the coordinates of the mouse pointer
    within a canvas element. 

    beginPath method is part of the HTML5 Canvas API and it is used
    to begin a new path or reset the current path on a canvas. A path
    refers to a series of connected lines or curves that can be used
    to create shapes, lines or other elements. Method beginPath() is 
    called when you want to draw something on the canvas. 
    
    After calling beginPath method, another method moveTo() is called.
    moveTo method is also part of the HTML5 API and is used to set a
    starting point, it moves the current drawing position to the specified
    point (x,y) without drawing anything. It moves the "pen" to a specified
    point without creating a visible line. The moveTo() command is like 
    lifting your pen off the paper and putting it down at a new spot without 
    drawing anything.



canvasEl.addEventListener("pointerdown", function (e) {
    isDrawing = true;

    const x = e.clientX - canvasEl.offsetLeft;
    const y = e.clientY - canvasEl.offsetTop;

    context.beginPath();
    context.moveTo(x, y);
});

*/






