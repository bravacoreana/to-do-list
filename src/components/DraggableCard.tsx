import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) => props.theme.cardColor};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  color: ${(props) => (props.isDragging ? "#f6f6f6" : props.theme.textColor)};
  background-color: ${(props) =>
    props.isDragging ? "#5177a7" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "2px 2px 5px rgba(0,0,0,0.6)" : "none"};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  &:hover {
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    font-weight: 600;
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

const DraggableCard = ({
  boardId,
  toDoId,
  toDoText,
  index,
}: IDraggableCardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const handleDelete = () => {
    setToDos((allBoards) => {
      const currentBoard = [...allBoards[boardId]];
      currentBoard.splice(index, 1);

      localStorage.setItem(
        "toDos",
        JSON.stringify({
          ...allBoards,
          [boardId]: currentBoard,
        })
      );
      return { ...allBoards, [boardId]: currentBoard };
    });
  };

  return (
    <Draggable draggableId={"" + toDoId} key={toDoId} index={index}>
      {/* key and draggableId mush be same */}
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
          <Button onClick={handleDelete}>X</Button>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard); // do not render if the props are not changed
