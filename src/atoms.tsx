import { atom } from "recoil";

const darkMode = localStorage.getItem("darkMode");
const savedData = localStorage.getItem("toDos");

export interface IToDo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: savedData
    ? JSON.parse(savedData)
    : {
        "To Do": [],
        Doing: [],
        Done: [],
      },
});

export const isDarkAtom = atom({
  key: "darkMode",
  default: darkMode && darkMode === "true" ? true : false,
});
