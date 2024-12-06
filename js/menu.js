const title = document.getElementById('title');
var scoreLabel = document.getElementById('score');

// Buttons
//const splashScreen = document.getElementById('splash');
const levelButton = document.getElementById('level-mode');
const competitionButton = document.getElementById('timed-mode');
const extremeButton = document.getElementById('extreme-mode');

const modeButtons = [levelButton, competitionButton, extremeButton];

// Ball Buttons
const chooseBallsSection = document.getElementById('choose-balls');

const fiveBalls = document.getElementById('5-balls');
const tenBalls = document.getElementById('10-balls');
const fifteenBalls = document.getElementById('15-balls');
const twentyBalls = document.getElementById('20-balls');
const twentyFiveBalls = document.getElementById('25-balls');
const thirtyBalls = document.getElementById('30-balls');

const ballButtons = [fiveBalls, tenBalls, fifteenBalls, twentyBalls, twentyFiveBalls, thirtyBalls];

// Descriptions
const levelDescription = document.getElementById('level-mode-description');
const competitionDescription = document.getElementById('competition-mode-description');
const extremeDescription = document.getElementById('extreme-mode-description');

const mouseButton = document.getElementById('mouse');
const keyButton = document.getElementById('keyboard');
const controlMenu = document.getElementById('control')

const controlButtons = [mouseButton, keyButton];

const easyButton = document.getElementById('easy');
const medButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const difficultyHeading = document.getElementById('difficulty-header')

const startButton = document.getElementById('start');

// Game Variables

import { AppGlobals } from "./config.js";

const storedGlobals = localStorage.getItem('AppGlobals');
if (storedGlobals) {
  Object.assign(AppGlobals, JSON.parse(storedGlobals));
}

function unselectButtons(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = 'white';
    buttons[i].style.color = 'blue';
  }
}

// Get game mode
levelButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.levelMode = true;
  AppGlobals.competitionMode = false;
  AppGlobals.extremeMode = false;
  AppGlobals.numBalls = 1;

  // Update Styles
  unselectButtons(modeButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';

  // Show/Hide Descriptions
  levelDescription.removeAttribute('hidden');
  competitionDescription.setAttribute('hidden', true);
  extremeDescription.setAttribute('hidden', true);
  chooseBallsSection.setAttribute('hidden', true);
  controlMenu.removeAttribute('hidden');
  console.log('level mode')
});

competitionButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.competitionMode = true;
  AppGlobals.levelMode = false;
  AppGlobals.extremeMode = false;

  // Update Styles
  unselectButtons(modeButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';

  // Show/Hide Descriptions
  levelDescription.setAttribute('hidden', true);
  competitionDescription.removeAttribute('hidden');
  extremeDescription.setAttribute('hidden', true);
  chooseBallsSection.removeAttribute('hidden');
  controlMenu.setAttribute('hidden', true);
  console.log('competition mode')
});

extremeButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.extremeMode = true;
  AppGlobals.levelMode = false;
  AppGlobals.competitionMode = false;
  AppGlobals.numBalls = 1;

  // Update Styles
  unselectButtons(modeButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';

  // Show/Hide Descriptions
  levelDescription.setAttribute('hidden', true);
  competitionDescription.setAttribute('hidden', true);
  extremeDescription.removeAttribute('hidden');
  chooseBallsSection.setAttribute('hidden', true);
  controlMenu.removeAttribute('hidden');
  console.log('extreme mode')
});

fiveBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 5;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('5 balls')
});

tenBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 10;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('10 balls')
});

fifteenBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 15;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('15 balls')
});

twentyBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 20;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('20 balls')
});

twentyFiveBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 25;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('25 balls')
});

thirtyBalls.addEventListener('click', function() {
  AppGlobals.numBalls = 30;
  unselectButtons(ballButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';
  controlMenu.removeAttribute('hidden');
  console.log('30 balls')
});

// Get control method
mouseButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.mouseControl = true;
  AppGlobals.keyControl = false;   
  AppGlobals.extremeCountdown = AppGlobals.EXTREME_MOUSE_TIMER;

  // Update Styles
  unselectButtons(controlButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';

  // Show/Hide Difficulties
  difficultyHeading.removeAttribute('hidden');
  easyButton.removeAttribute('hidden');
  medButton.setAttribute('hidden', true);
  hardButton.setAttribute('hidden', true);
  startButton.removeAttribute('hidden');
  console.log('mouse control')
});

keyButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.keyControl = true;
  AppGlobals.mouseControl = false;
  AppGlobals.extremeCountdown = AppGlobals.EXTREME_KEYBOARD_TIMER;

  // Update Styles
  unselectButtons(controlButtons);
  this.style.backgroundColor = 'green';
  this.style.color = 'white';

  // Show/Hide Difficulties
  difficultyHeading.removeAttribute('hidden');
  easyButton.removeAttribute('hidden');
  medButton.removeAttribute('hidden');
  hardButton.removeAttribute('hidden');
  startButton.removeAttribute('hidden');
  console.log('keyboard control')
});

// Get difficulty
easyButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.difficulty = "easy";

  // Update Styles
  easyButton.style.backgroundColor = 'green';
  easyButton.style.color = 'white';
  medButton.style.backgroundColor = 'white';
  medButton.style.color = 'orange';
  hardButton.style.backgroundColor = 'white';
  hardButton.style.color = 'red';
  console.log('difficulty: ' + AppGlobals.difficulty)
});

medButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.difficulty = "medium";
  console.log('medium')

  // Update Styles
  easyButton.style.backgroundColor = 'white';
  easyButton.style.color = 'green';
  medButton.style.backgroundColor = 'orange';
  medButton.style.color = 'white';
  hardButton.style.backgroundColor = 'white';
  hardButton.style.color = 'red';
});

hardButton.addEventListener('click', function() {
  // Update Values
  AppGlobals.difficulty = "hard";
  console.log('hard')

  // Update Styles
  easyButton.style.backgroundColor = 'white';
  easyButton.style.color = 'green';
  medButton.style.backgroundColor = 'white';
  medButton.style.color = 'orange';
  hardButton.style.backgroundColor = 'red';
  hardButton.style.color = 'white';
});

// Start game
startButton.addEventListener('click', function() {
  if ((AppGlobals.keyControl || AppGlobals.mouseControl)) {
    console.log('starting...')
    localStorage.setItem('AppGlobals', JSON.stringify(AppGlobals));
    window.location.href = "game.html";
  }
});