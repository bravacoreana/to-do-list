import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Board from "./components/Board";
import Button from "./components/Button";
import styled from "styled-components";
import { isDarkAtom, toDoState } from "./atoms";

import { useOnClickOutside } from "usehooks-ts";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;
const ButtonBox = styled.div`
  padding-right: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;
const FormBox = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Input = styled.input`
  float: right;
  margin-right: 15px;
  border: none;
  border-bottom: 2px solid black;
  background-color: transparent;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const Boards = styled.div`
  width: 100%;
  gap: 10px;
  display: flex;
  justify-content: center;
`;

interface IBoardForm {
  board: string;
}

function ToDo() {
  // darkmode
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => {
    setDarkAtom((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  // board
  const [category, setCategory] = useState(false);
  const toggleCategory = () => setCategory(!category);

  // todo
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IBoardForm>();

  // todo - valid
  const onValid = ({ board: category }: IBoardForm) => {
    setToDos((allBoards) => {
      localStorage.setItem(
        "toDos",
        JSON.stringify({ ...allBoards, [category]: [] })
      );

      return {
        ...allBoards,
        [category]: [],
      };
    });
    setValue("board", "");
  };

  // moving cards
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;

    // same board
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);

        localStorage.setItem(
          "toDos",
          JSON.stringify({ ...allBoards, [source.droppableId]: boardCopy })
        );

        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }

    // cross board
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);

        localStorage.setItem(
          "toDos",
          JSON.stringify({
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          })
        );

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  const headerRef = useRef(null);
  const handleClickOutside = () => setCategory(false);
  useOnClickOutside(headerRef, handleClickOutside);

  return (
    <Container>
      <ButtonBox>
        <FormBox ref={headerRef}>
          {category ? (
            <form onSubmit={handleSubmit(onValid)}>
              <Input
                type="text"
                placeholder="add board"
                {...register("board", { required: true })}
              />
            </form>
          ) : null}

          <Button onClick={toggleCategory}>+</Button>
        </FormBox>
        <Button onClick={toggleDarkAtom}>{isDark ? "🌙" : "🌞"}</Button>
      </ButtonBox>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board
                boardId={boardId}
                key={boardId}
                toDos={toDos[boardId]}
              ></Board>
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </Container>
  );
}

export default ToDo;
