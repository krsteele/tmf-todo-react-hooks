import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useRouter from "use-react-router";

import useInput from "../hooks/useInput";
import useOnEnter from "../hooks/useOnEnter";
import useTodos from "../reducers/useTodos";
// import { useTags } from "../reducers/useTags";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const router = useRouter();

  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();

  // sets tags in local storage
  // const tagsToStorage = useTags()
  // manage state for tags
  // const [tags, setTags, chosenTag, setChosenTag] = useState([])
  // get tags from localStorage and set state
  // useEffect(() => {
  //   const tagsToSet = localStorage.getItem("tags")
  //   setTags(tagsToSet)
  // }, [])

  const tags = ["home", "work", "yard", "errand", "partytime"]
  const [selectedTag, setSelectedTag] = useState("")
  const selectedTag = useRef("")

  console.log(tags)
  useEffect(()=> {
    console.log(selectedTag)
  }, [selectedTag])

  const left = useMemo(() => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0), [
    todos
  ]);

  const visibleTodos = useMemo(
    () =>
      router.match.params.filter
        ? todos.filter(i =>
            router.match.params.filter === "active" ? !i.done : i.done
          )
        : todos,
    [todos, router.match.params.filter]
  );

  const anyDone = useMemo(() => todos.some(i => i.done), [todos]);
  const allSelected = useMemo(() => visibleTodos.every(i => i.done), [
    visibleTodos
  ]);

  const onToggleAll = useCallback(
    () => {
      visibleTodos.forEach(i => setDone(i.id, !allSelected));
    },
    [visibleTodos, allSelected]
  );

  const onClearCompleted = useCallback(
    () => {
      todos.forEach(i => {
        if (i.done) {
          deleteTodo(i.id);
        }
      });
    },
    [todos]
  );

  const [newValue, onNewValueChange, setNewValue] = useInput();
  const onAddTodo = useOnEnter(
    () => {
      if (newValue) {
        console.log(newValue)
        addTodo(newValue);
        setNewValue("");
      }
    },
    [newValue]
  );

  return (
    <React.Fragment>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyPress={onAddTodo}
          value={newValue}
          onChange={onNewValueChange}
        />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={allSelected}
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all" />
        {/* tags dropdown */}
        <select
          className="new-todo"
          defaultValue=""
          ref={selectedTag}
          onKeyPress={onAddTodo}
          onChange={setSelectedTag(evt.target.value)}
        >
          <option value="0">Choose a tag</option>
          {
            tags.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))
          }
        </select>
        <ul className="todo-list">
          {visibleTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{left}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <NavLink exact={true} to="/" activeClassName="selected">
              All
            </NavLink>
          </li>
          <li>
            <NavLink to="/active" activeClassName="selected">
              Active
            </NavLink>
          </li>
          <li>
            <NavLink to="/completed" activeClassName="selected">
              Completed
            </NavLink>
          </li>
        </ul>
        {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    </React.Fragment>
  );
}
