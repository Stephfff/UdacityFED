
// Array of Objects that holds card information 
const icons = [
  {frontFace: 'img/fresh-prince.jpg', frontFaceAlt: 'Fresh Prince', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/carlton-banks.jpg', frontFaceAlt: 'Carlton Banks', frontClass: "front-face",  backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/hilary-banks.jpg', frontFaceAlt: 'Hilary Banks', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/ashley-banks.jpg', frontFaceAlt: 'Ashley Banks', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/uncle-phil.jpg', frontFaceAlt: 'Uncle Phil', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/aunt-viv.jpg', frontFaceAlt: 'Aunt-Viv', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/geoffrey.jpg', frontFaceAlt: 'Geoffrey', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" },
  {frontFace: 'img/jazz.jpg', frontFaceAlt: 'Jazz', frontClass: "front-face", backFace: 'img/fp_logo.png', backFaceAlt: 'Fresh Prince Logo', backClass: "back-face" }
];


const doubleIcons = icons.concat(icons);
const cards = document.getElementsByClassName('card');
const deck = document.querySelector('.deck');
const movesCounter = document.querySelector('.moves');
const stars = document.querySelectorAll('.fa-star');
const starsContainer = document.querySelector('.stars');
const timeContainer = document.getElementById('timer');
const seconds = document.getElementById('seconds');
const minutes = document.getElementById('minutes');
const restart = document.querySelector('.fa-repeat');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close');
const play = document.querySelector('.play-button');
const finalStars = document.querySelector('.final-stars');
const finalMoves = document.querySelector('.final-moves');
const finalTime = document.querySelector('.final-time');


let moves = 0;
let cardsOpen = [];
let matchings = 0;
let timer;
let sec = 0;
let canPlay = true;


// Create a new deck
newDeck();

// if restart button is clicked, reset the game
restart.addEventListener('click', resetGame);


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
   randomIndex = Math.floor(Math.random() * currentIndex);
   currentIndex -= 1;
   temporaryValue = array[currentIndex];
   array[currentIndex] = array[randomIndex];
   array[randomIndex] = temporaryValue;
  }

 return array;
}


// Builds a new shuffled deck and starts the timer
function newDeck() {
  let newIcons = shuffle(doubleIcons);
  let section = '';

  for (let i = 0; i < newIcons.length; i++) {
    let div = '<div class="card"><img class="' + newIcons[i].backClass + '" src="' + newIcons[i].backFace + '" alt="' + newIcons[i].backFaceAlt + '" width="120" ><img class="' + newIcons[i].frontClass + '" src="' + newIcons[i].frontFace + '" alt="' + newIcons[i].frontFaceAlt + '" width="120" ></div>';
    section += div;
  }

  deck.innerHTML = section;

  // if a card is clicked, flip the card
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', startTimer);
    cards[i].addEventListener('click', flipCard);
  }
}

// Flip the card
function flipCard() {
  if (canPlay === true) {
    this.classList.add('open', 'no-click');
    cardsOpen.push(this);
    
    if (cardsOpen.length === 2) {
    moves += 1;
    movesCounter.innerText = moves;

      //Allows the card to flip before the CSS Animation
      setTimeout(() => {
        if (cardsOpen[0].isEqualNode(cardsOpen[1])) {
          match();

        } else {
          noMatch();
        }
      }, 400);

        rating();

      }
  }
}


// If cards match, display match and check if user has won
function match() {
  for (let i = 0; i < cardsOpen.length; i++) {
    cardsOpen[i].classList.add('match');
  }

  cardsOpen = [];
  matchings += 1;

  //If 8 cards are matched, display winner modal
  if (matchings === 8) {
    winGame();
  }
}


// If cards don't match, display error animation
function noMatch() {
  cardsOpen[0].classList.add('no-match');
  cardsOpen[1].classList.add('no-match');
  canPlay = false;

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add('no-pointer');
  }

  // After show the error state, hide the cards
  setTimeout(function() {
    cardsOpen[0].classList.remove('open', 'no-match', 'no-click');
    cardsOpen[1].classList.remove('open', 'no-match', 'no-click');
    cardsOpen = [];
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove('no-pointer');
    }
    canPlay = true;
  }, 500);
}


//Timer function from https://stackoverflow.com/questions/5517597/
function startTimer() {
  for (let i = 0; i < cards.length; i++) {
    cards[i].removeEventListener('click', startTimer);
  }

  function pad(val) { return val > 9 ? val : '0' + val; }

  timer = setInterval( function(){
    seconds.innerHTML = pad(++sec % 60);
    minutes.innerHTML = pad(parseInt(sec / 60, 10));
  }, 1000);
}


// Star rating based on how well you are doing
function rating() {
  if (moves > 15) {
    stars[2].classList.remove('fa-star');
    stars[2].classList.add('fa-star-o');
    if (moves > 25) {
      stars[1].classList.remove('fa-star');
      stars[1].classList.add('fa-star-o');
    }
  }
}


// Winner modal
function winGame() {
  clearInterval(timer);
  finalStars.innerHTML = starsContainer.innerHTML;
  finalMoves.innerText = moves;
  finalTime.innerText = timeContainer.innerText;
  modal.classList.remove('hidden');

  // When the user clicks on <span> (x), close the modal
  span[0].addEventListener('click', hide)

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          hide();
      }
  }

  // When the user click on play again, restart the game
  play.addEventListener('click', resetGame);
}


// To hide the modal
function hide() {
    modal.classList.add('hidden');
}


// Restart the game: create new deck, reset score panel
function resetGame() {
  cardsOpen = [];
  moves = 0;
  movesCounter.innerText = 0;
  sec = 0;
  matchings = 0;
  seconds.innerText = '00';
  minutes.innerText = '00';
  clearInterval(timer);
  hide();

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove('open', 'no-click', 'match');
  }

  for (var i = 0; i < stars.length; i++) {
    stars[i].classList.remove('fa-star-o');
    stars[i].classList.add('fa-star');
  }

  newDeck();
}
