// Array for "cards" DOM elements 
let cards = [];
// Array for "opened" element
let open = [];
// List of types (should be compatible with font awesome)
const types = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "bicycle", "leaf", "bomb"];
// Logical game field contains meta-data for type, ref to DOM el, etc.
const field = [];
// Ref to "deck" DOM element to draw cards inside
const deckEl = document.querySelector(".deck");
// Counter value and ref to DOM element
let counter = 0;
const counterEl = document.querySelector(".moves");
// Ref to reset button
const resetEl = document.querySelector(".restart");

const init = () => {

    setCounter(0);
    open = [];

    // Fill in the "field" with types (two items for each type)
    fillFieldWithTypes(field, types);

    // Shuffle the list of cards
    shuffle(field);

    // Render "deck" DOM element using template of items
    renderDeckWithField(deckEl, field);

    console.log('Field: ' + field.map(o => o.type).join(','));
    
    // Put new DOM elements into `cards` array
    cards = [...document.getElementsByClassName("card")];

    // Add click event handlers to each element
    addClickListener(cards);

};

const addClickListener = (items) => {
    resetEl.addEventListener("click", resetClick);
    items.forEach((el) => {
        el.addEventListener("click", cardClick)
    });
};

const resetClick = (event) => {
    init();
};

const cardClick = (event) => {
    const card = event.target;
    card.classList.add("open", "show");

    checkMatch(card);
};

const checkMatch = (el) => {
    
    // Dummy developer check
    if(el === undefined 
        || el.gamedata === undefined 
        || el.gamedata.index === undefined) 
    {
        console.error('Game data not set for this DOM el', el);
        return false;
    }

    // Get index of logical element
    const i = el.gamedata.index;
    // Check for any "opened" items
    if(!Array.isArray(open) || open.length === 0) {
        open = [i];
    } else {
        // Check if we click the same card....
        if(i === open[0]) {
            console.error('User clicks the same el', el);
            return false;
        }

        const item1 = field[i];
        const item2 = field[open[0]];
        
        if(item1.type === item2.type) {
            showMatched(item1, item2);
        } else {
            showMatchNot(item1, item2);
        }
        open = [];
        addOneMove();
        checkWon();
    }
};

const checkWon = () => {
    // Do we have any un-matched items in the field
    const matched = field.map(o => o.matched);
    const indexOf = matched.indexOf(false);
    if(indexOf === -1) {
        alert('You won');
        init();
    }
};

const showMatched = (item1, item2) => {
    item1.el.classList.add("match");
    item2.el.classList.add("match");

    item1.matched = true;
    item2.matched = true;

    item1.el.removeEventListener('click', cardClick, false);
    item2.el.removeEventListener('click', cardClick, false);
};

const showMatchNot = (item1, item2) => {
    item1.el.classList.add("matchnot");
    item2.el.classList.add("matchnot");

    setTimeout(actuallyHideMatchNotCards, 1000, item1, item2);
};

const actuallyHideMatchNotCards = (item1, item2) => {
    item1.el.classList.remove("open", "show", "matchnot");
    item2.el.classList.remove("open", "show", "matchnot");
};

const setCounter = (value) => {
    value = parseInt(value, 10)?parseInt(value, 10):0;
    counter = value;
    counterEl.innerHTML = value;
};

const addOneMove = () => {
    setCounter(counter + 1);
};

const renderDeckWithField = (deck, field) => {
    deck.innerHTML = '';
    field.forEach((item) => {
        deck.innerHTML += getTypeTemplate(item.type);
    });

    cards = [...document.getElementsByClassName("card")];

    for(let i = 0; i < field.length; i++) {
        field[i]['el'] = cards[i];
        cards[i].gamedata = {
            'index': i
        };
    }
};

const getTypeTemplate = (type) => {
    return '<li class="card"><i class="fa fa-' + type + '"></i></li>';
};

const fillFieldWithTypes = (field, types) => {
    let i = 0;
    types.forEach((type) => {
        // Two for each type
        field[i++] = {'type': type, 'matched': false};
        field[i++] = {'type': type, 'matched': false};
    });
};

const shuffle = (array) => {
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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

init();