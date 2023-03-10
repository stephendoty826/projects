// Boolean flags
let playerStand = false;

// DOM manipulation 
let dealButton = document.getElementById("deal-button");
let hitButton = document.getElementById("hit-button");
let standButton = document.getElementById("stand-button")
let message = document.getElementById("message");

// Player has to deal cards before they can hit or stand. hitButton and standButton is enabled when the Deal button is clicked 
standButton.disabled = true;
hitButton.disabled = true;


// defining player object
let player = {
  objName: "Player",
  hand: [],
  score: 0,
  handNode: document.getElementById("player-hand"),
  pointsNode: document.getElementById("player-points")
}

// defining dealer object
let dealer = {
  objName: "Dealer",
  hand: [],
  score: 0,
  handNode: document.getElementById("dealer-hand"),
  pointsNode: document.getElementById("dealer-points"),
  hiddenCard: {}
}

// function to build decks with mostly aces and cards with 10 points
const buildDecksAces = () => {

  let cardNumbers = [1, 1, 1, 2, 3, 10, 11, 12, 13];
  let suits = ['diamonds', 'clubs', 'hearts', 'spades'];

  // building a single deck
  let deckArr = [];
  suits.forEach(suit => {
    cardNumbers.forEach(num => {
      let cardObj = {
        suit
      }
      switch(num){
        case 1:
          cardObj.imagePath = `images/ace_of_${suit}.png`;
          cardObj.points = 11;
          break;
        case 11:
          cardObj.imagePath = `images/jack_of_${suit}.png`;
          cardObj.points = 10;
          break;
        case 12:
          cardObj.imagePath = `images/queen_of_${suit}.png`;
          cardObj.points = 10;
          break;
        case 13:
          cardObj.imagePath = `images/king_of_${suit}.png`;
          cardObj.points = 10;
          break;
        default:
          cardObj.imagePath = `images/${num}_of_${suit}.png`;
          cardObj.points = num;
      }
      deckArr.push(cardObj);
    })
  })

  return deckArr
}

const buildDecks = (numOfDecks = 1) => {

  let cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let suits = ['diamonds', 'clubs', 'hearts', 'spades'];

  // building a single deck
  let deckArr = [];
  suits.forEach(suit => {
    cardNumbers.forEach(num => {
      let cardObj = {
        suit
      }
      switch(num){
        case 1:
          cardObj.imagePath = `images/ace_of_${suit}.png`;
          cardObj.points = 11;
          break;
        case 11:
          cardObj.imagePath = `images/jack_of_${suit}.png`;
          cardObj.points = 10;
          break;
        case 12:
          cardObj.imagePath = `images/queen_of_${suit}.png`;
          cardObj.points = 10;
          break;
        case 13:
          cardObj.imagePath = `images/king_of_${suit}.png`;
          cardObj.points = 10;
          break;
        default:
          cardObj.imagePath = `images/${num}_of_${suit}.png`;
          cardObj.points = num;
      }
      deckArr.push(cardObj);
    })
  })

  // console.log('deckArr', deckArr);
  let decks = [];

  // Building number of decks
  for(let i = 0; i < numOfDecks; i++){
    decks = decks.concat(deckArr);
    // console.log('decks', decks);
  }
  return decks
}

// shuffle function
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck;
}

let decks = shuffleDeck(buildDecks(3));

const calculateScore = (userObj) => {
  userObj.score = 0;
  userObj.hand.forEach(cardObj => {
    userObj.score += cardObj.points;
  })
  // if userObj.score is over 21 call hasAce function and pass in userObj
  if(userObj.score > 21){
    factorInAces(userObj)
  }
  if(userObj.objName === "Player"){
    userObj.pointsNode.innerText = `${userObj.score}`
  }
  else if(userObj.objName === "Dealer" && playerStand){
    userObj.pointsNode.innerText = `${userObj.score}`
  }
  if(userObj.score > 21){
    message.innerText = `${userObj.objName} busts.`
    hitButton.disabled = true;
    standButton.disabled = true;
  }
}

const dealCardTo = (userObj) => {
  let drawnCard = decks.pop();
  userObj.hand.push(drawnCard);
  calculateScore(userObj)
  showHand(userObj)
}

const showHand = (userObj) => {
  let htmlFragment = '';
  userObj.hand.forEach((cardObj, idx) => {
    if(userObj.objName === 'Dealer' && idx === 1 && !playerStand){
        userObj.hiddenCard = cardObj.imagePath
        htmlFragment += `<div><img src='images/facedown_card.png' class="card" alt=""></div>`
    }
    else{
      htmlFragment += `<div><img src=${cardObj.imagePath} class="card" alt=""></div>`
    }
  })
  userObj.handNode.innerHTML = htmlFragment;
}

// finds the first ace card and sets the points to 1 and reduces the user's score by 10 points
const factorInAces = (userObj) => {
  aceCard = userObj.hand.find(cardObj => cardObj.points === 11)
  if(aceCard){
    aceCard.points = 1
    userObj.score -= 10
  }
  console.log('aceCard', aceCard)
}

dealButton.addEventListener('click', () => {
  dealCardTo(player);
  dealCardTo(player);
  dealCardTo(dealer);
  dealCardTo(dealer);
  dealButton.disabled = true;
  standButton.disabled = false;
  hitButton.disabled = false;
})

hitButton.addEventListener('click', () => {
  dealCardTo(player);
})

standButton.addEventListener('click', () => {
  // deal cards to player until they have at least 17
  playerStand = true;
  while(dealer.score < 17){
    dealCardTo(dealer);
  }
  calculateScore(dealer)
  showHand(dealer)
  if(dealer.score > 21){
    message.innerText = "Dealer busts. Player wins."
  }
  else if(dealer.score >= player.score){
    message.innerText = "Dealer wins."
  }
  else{
    message.innerText = "Player wins."
  }
  hitButton.disabled = true;
  standButton.disabled = true;
})
