import React, {useState} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import cn from 'classnames';
import _ from 'lodash';

//double click event handler where the card remove is invoked for existing card before editing
const handleDoubleClick = (props, cardTitle)=>{
  console.log(cardTitle);
  props.removeCard(props.id, props.columnId, cardTitle, true);
}
export function Card(props) {
  const [cardVisible, setCardVisible] = useState("");
  const [doubleClicked, setDoubleClick] = useState(false);
  const [cardTitle, setCardTitle] = useState(props.title);
  return _.flowRight(props.connectDragSource, props.connectDropTarget)(
    <div
      onDoubleClick={()=>setDoubleClick(true)} 
      key={props.key}
      className={cn('Card', cardVisible,'cardShake' , {
        'Card--dragging': props.isDragging,
        'Card--spacer': props.isSpacer,
      })}
    >
      {doubleClicked ? 
        <form onSubmit={(e)=>{e.stopPropagation(); return handleDoubleClick(props, cardTitle)}}>
          <input  type="text"
                className="cardEditText"
                autoFocus 
                value={cardTitle} 
                onChange={(e)=>{return setCardTitle(e.target.value)}}
                onSubmit={(e)=>{return handleDoubleClick(props)}}/>
        </form> : 
        <div className="Card__title">{props.title}</div>}
      <div className="closeCard" onClick={(e)=> {
                                                  setCardVisible("cardVisible");
                                                  props.removeCard(props.id, props.columnId);
                                                }}>X</div>
    </div>
  );
}

export const DraggableCard = _.flowRight([
  DropTarget(
    'Card',
    {
      hover(props, monitor) {
        const {columnId, columnIndex} = props;
        const draggingItem = monitor.getItem();
        if (draggingItem.id !== props.id) {
          props.moveCard(draggingItem.id, columnId, columnIndex);
        }
      },
    },
    connect => ({
      connectDropTarget: connect.dropTarget(),
    })
  ),
  DragSource(
    'Card',
    {
      beginDrag(props) {
        return {id: props.id};
      },

      isDragging(props, monitor) {
        return props.id === monitor.getItem().id;
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  ),
])(Card);
