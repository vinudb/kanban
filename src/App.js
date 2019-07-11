import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import _ from "lodash";
import { Board } from "./components/Board";

let columnId = 0;
let _cardId = 0;

let initialCards = [];
let initialColumns = [];
let lastUpdated="No update yet";

//localStorage.clear();
//initially read the object stored in the local storage. If object stored, then assign to 
//initial cards, initial columns and also lastupdated date-time.
const localStorageState = JSON.parse(localStorage.getItem("state"));
if(localStorageState){
  console.log(localStorageState.cards);
  lastUpdated = localStorageState.lastUpdated
  initialCards = localStorageState.cards;
  _cardId = Math.max.apply(null, localStorageState.cards.map((item)=>{return item.id}));
  console.log("_cardID", _cardId);
  initialColumns = localStorageState.columns;
}
else{ //create empty 3 columns with 0 cards
  initialColumns = ["To-Do", "In Progress", "Done"].map((title, i) => ({
    id: columnId++,
    title,
    cardIds: initialCards.map(card => card.id)
  }));
}

class App extends Component {
  state = {
    cards: initialCards,
    columns: initialColumns,
    lastUpdated 
  };

  //create the current date and time in the required format here
  getCurrentDateTime = ()=>{
    var today = new Date();
    return `${today.getDate()}-${(today.getMonth()+1)}-${today.getFullYear()} - ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  }

  //after hitting + button, entering the text and hitting enter, add card method is called. 
  addCard = (columnId, _title) => {
    const title = _title.trim();
    if (!title) return;

    const newCard = { id: ++_cardId, title };//create the object of new card to be added
    this.setState(state => ({ //set the state by inserting the newcard inside the existing cards  
      cards: [...state.cards, newCard], 
      columns: state.columns.map(column =>
        column.id === columnId
          ? { ...column, cardIds: [...column.cardIds, newCard.id] }
          : column
      ),
      lastUpdated: this.getCurrentDateTime()
  }));
  };

  //when x is clicked, removeCard is called. 
  //When user doubleClicks on existing card, edits and hits enter, that card is removed first 
  //and then a new card is added with new title. The addCard is called after the asychronous setState 
  //method is over in the removeCard 
  removeCard = (cardId, columnId, newTitle, isDoubleClick)=>{
    console.log(cardId);
    this.setState(state => ({ //use filter method to remove the card from existing state of cards
      cards: state.cards.filter(card => { console.log(card.id,cardId); return card.id !== cardId;}),
      columns: state.columns.map(column => ({
        ...column,
        cardIds: _.flowRight(
          //If this is the destination column, insert the cardId.
          cardids =>
            column.id === columnId
              ? cardids.filter(cardid => cardid !== cardId)
              : cardids,
          //Remove the cardId for all columns
          //cardids => cardids.filter(cardid => cardid !== cardId)
        )(column.cardIds)
      })),
      lastUpdated: this.getCurrentDateTime()
    }), ()=>{ if(isDoubleClick) this.addCard(columnId, newTitle)} ); //if doubleClicked, addCard is called here
  }

  //when a card is moved from one column to another column moveCard method is called.
  //only the columns state is edited to update the cardIds inside each column
  moveCard = (cardId, destColumnId, index) => {
    console.log(this.state.columns);
    this.setState(state => ({
      columns: state.columns.map(column => ({
        ...column,
        cardIds: _.flowRight(
          //If this is the destination column, insert the cardId.
          cardids =>
            column.id === destColumnId
              ? [...cardids.slice(0, index), cardId, ...cardids.slice(index)]
              : cardids,
          //Remove the cardId for all columns
          cardids => cardids.filter(cardid => cardid !== cardId)
        )(column.cardIds)
      })),
      lastUpdated: this.getCurrentDateTime()
    }));
  };

  
  //for each state value change, store the objects in the local storage
  componentDidUpdate(){
    let key = "state";
    let obj = {
      cards: this.state.cards,
      columns: this.state.columns,
      lastUpdated: this.state.lastUpdated
    };
    localStorage.setItem(key, JSON.stringify(obj));
  }

  render() {
    return (
      <Board
        cards={this.state.cards}
        columns={this.state.columns}
        moveCard={this.moveCard}
        addCard={this.addCard}
        addColumn={this.addColumn}
        removeCard={this.removeCard}
        lastUpdated = {this.state.lastUpdated}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
