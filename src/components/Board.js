import React from 'react';
import Column from './Column';
import {DraggableCard} from './Card';

//this component holds the columns and cards inside each column
export function Board({cards, columns, moveCard, addCard, removeCard, lastUpdated}) {
  return (
    <div className="Board">
    <div className="lastUpdateFont">Last Updated: {lastUpdated}</div>
      {columns.map(column => (
        <Column
          key={column.id}
          columnId={column.id}
          title={column.title}
          addCard={addCard.bind(null, column.id)}
        >
          {column.cardIds
            .map(cardId => cards.find(card => card.id === cardId))
            .map((card, index) => (
              <DraggableCard
                key={card.id}
                id={card.id}
                columnId={column.id}
                columnIndex={index}
                title={card.title}
                moveCard={moveCard}
                removeCard={removeCard}
              />
            ))}
            {column.cardIds.length === 0 && (
              <DraggableCard
                isSpacer
                moveCard={cardId => moveCard(cardId, column.id, 0)}
              />
            )}
        </Column>
      ))}
    </div>
  );
}
