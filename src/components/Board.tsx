import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";

const Container = styled.div`
  min-width: 320px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 720px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  margin-bottom: 20px;
  position: relative;
`;
const HeaderTitle = styled.div`
  display: flex;

  align-items: center;
`;
const Title = styled.h1`
  margin-left: 7px;
  font-weight: 600;
`;

const CountBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Count = styled.span`
  font-size: 14px;
`;

interface ICardContainerProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const CardContainer = styled.div<ICardContainerProps>`
  padding: 0px 10px;
  flex-grow: 1;
  background-color: ${(props) =>
    props.isDraggingOver
      ? props.theme.accentColor
      : props.draggingFromThisWith
      ? props.theme.listLeave
      : "none"};
  transition: background-color 0.3s ease-in-out;
`;

const Ul = styled.ul`
  position: absolute;
  right: 0;
  top: 25px;
  background-color: white;

  border-radius: 3px;
`;

const Li = styled.li<IBoard>`
  padding: 7px 10px;
  cursor: pointer;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  margin-bottom: 20px;
`;
const Input = styled.input`
  width: 100%;
  padding: 3px 10px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid black;
  color: ${(props) => props.theme.textColor};
  &:focus {
    outline: none;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${(props) => props.theme.placeholder};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${(props) => props.theme.placeholder};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${(props) => props.theme.placeholder};
  }
`;

const BoardButtons = styled.div``;
const BoardButton = styled.button`
  border: none;
  margin-left: 5px;
  background-color: transparent;
  font-size: 16px;
  text-align: center;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.textColor};
    font-weight: 600;
  }
`;

const FormButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 5px;
`;

const FormButton = styled.button`
  padding: 5px 12px;
  border: none;
  margin-left: 5px;
  border-radius: 3px;
  &:active {
    background-color: ${(props) => props.theme.bgColor};
    transform: scale(0.97, 0.97);
    box-shadow: 2px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

interface IForm {
  toDo: string;
}
interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}
export interface IBoard {
  board?: string;
  boardId?: string;
}

export default function Board({ toDos, boardId }: IBoardProps) {
  // toggle todo form box
  const [todoForm, setToDoForm] = useState(false);
  const controlForm = () => setToDoForm(!todoForm);
  const handleCancelForm = () => setToDoForm(false);

  // toggle board setting button
  const [settingBoard, setSettingBoard] = useState(false);
  const editBoard = () => setSettingBoard(!settingBoard);

  // form box
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const { register: registerBoard, handleSubmit: handleSubmitBoard } =
    useForm<IBoard>();

  const { register: registerToDos, handleSubmit: handleSubmitDeleteToDos } =
    useForm();
  const setToDos = useSetRecoilState(toDoState);

  const onValid = (data: IForm) => {
    const newToDo = { id: Date.now(), text: data.toDo };
    setToDos((allBoards) => {
      localStorage.setItem(
        "toDos",
        JSON.stringify({
          ...allBoards,
          [boardId]: [...allBoards[boardId], newToDo],
        })
      );
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };

  const onValidBoard = () => {
    setToDos((allBoards) => {
      const newBoards = { ...allBoards };
      delete newBoards[boardId];
      localStorage.setItem(
        "toDos",
        JSON.stringify({
          ...newBoards,
        })
      );
      return {
        ...newBoards,
      };
    });
  };

  const onValidDeleteToDos = () => {
    setToDos((allBoards) => {
      localStorage.setItem(
        "toDos",
        JSON.stringify({ ...allBoards, [boardId]: [] })
      );
      return {
        ...allBoards,
        [boardId]: [],
      };
    });
    setSettingBoard(false);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <CountBox>
            <Count>{toDos.length}</Count>
          </CountBox>
          <Title>{boardId}</Title>
        </HeaderTitle>
        <BoardButtons>
          <BoardButton onClick={controlForm}>+</BoardButton>
          <BoardButton onClick={editBoard}>x</BoardButton>
        </BoardButtons>
        {settingBoard ? (
          <Ul>
            <Li
              as="form"
              boardId={boardId}
              onClick={handleSubmitBoard(onValidBoard)}
              {...registerBoard("board")}
            >
              delete board
            </Li>
            <Li
              as="form"
              boardId={boardId}
              onClick={handleSubmitDeleteToDos(onValidDeleteToDos)}
              {...registerToDos("toDo")}
            >
              delete all lists
            </Li>
          </Ul>
        ) : null}
      </Header>

      {todoForm ? (
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("toDo", { required: true })}
            placeholder="Enter a note"
          />
          <FormButtons>
            <FormButton onClick={handleSubmit(onValid)}>submit</FormButton>
            <FormButton onClick={handleCancelForm}>cancel</FormButton>
          </FormButtons>
        </Form>
      ) : null}

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <CardContainer
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                boardId={boardId}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
              />
            ))}
            {provided.placeholder} {/* boards의 사이즈 유지 */}
          </CardContainer>
        )}
      </Droppable>
    </Container>
  );
}
