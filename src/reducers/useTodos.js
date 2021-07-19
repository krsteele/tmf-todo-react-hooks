import { globalReducer } from "react-hook-utils";

import { guid } from "../utils";

export const newTodo = (label, tag) => ({
  done: false,
  id: guid(),
  label: (label || "").trim(), 
  tag: (tag || "")
});

export const reducer = {
  // Delete a todo by id
  deleteTodo: (state, id) => state.filter(i => i.id !== id),

  // Create a new item
  addTodo: (state, label, tag) => [newTodo(label, tag), ...state],

  // Set the done state of an item
  setDone: (state, id, done) =>
    state.map(i =>
      i.id === id
        ? {
            ...i,
            done
          }
        : i
    ),

  // Set the label of an item
  setLabel: (state, id, label) =>
    state.map(i =>
      i.id === id
        ? {
            ...i,
            label
          }
        : i
    ),

  // Toggle an item done
  toggleDone: (state, id) =>
    state.map(i =>
      i.id === id
        ? {
            ...i,
            done: !i.done
          }
        : i
    )
};

export default globalReducer(
  // Load todos from local storage
  JSON.parse(localStorage.getItem("todos") || "[]"),
  reducer,
  // On state change, persist to local storage
  todos => localStorage.setItem("todos", JSON.stringify(todos))
);
