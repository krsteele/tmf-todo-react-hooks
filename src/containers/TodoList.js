import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useRouter from "use-react-router";

import useInput from "../hooks/useInput";
import useOnEnter from "../hooks/useOnEnter";
import useTodos from "../reducers/useTodos";
import { useTags } from "../reducers/useTags";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const router = useRouter();

  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();

  // sets tags in local storage
  useTags()
  // manage state for tags
  const [tags, setTags] = useState([])
  // get tags from localStorage and set state
  useEffect(() => {
    const tagsToSet = JSON.parse(localStorage.getItem("tags") || "[]")
    setTags(tagsToSet)
  }, [])

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
  // Filtering by tag
  const [filterByTag, setFilterByTag] = useState("0")
  const [filteredTodos, setFilteredTodos] = useState([])
  const onTagFilter = () => {
      const newTodos = todos.filter(i => {
        return i.tag === filterByTag
      })
     setFilteredTodos(newTodos)
    }
  useEffect(()=> {
    onTagFilter()
  }, [filterByTag])


  const [newValue, onNewValueChange, setNewValue] = useInput();
  // using ref instead of state so the value is available without rerender
  const selectedTag = useRef("");
  const onAddTodo = useOnEnter(
    () => {
      let tag = ""
      console.log(selectedTag.current.value)
      parseInt(selectedTag.current.value) === 0 ? tag = "" : tag = selectedTag.current.value
      if (newValue) {
        addTodo(newValue, tag);
        setNewValue("");
        selectedTag.current.value = "0"
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
        {/* Tags dropdown select */}
        <select
          className="new-todo"
          defaultValue=""
          ref={selectedTag}
          onKeyPress={onAddTodo}
        >
          <option value="0">Choose a tag</option>
          {
            tags.length > 0 ?
            (tags.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))) : (
              ""
            )
          }
        </select>
        
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

        {/* 
            check whether a filter tag has been selected 
            and render conditionally using appropriate array 
        */}
        <ul className="todo-list">
          {
          filterByTag === "0" ?
          visibleTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          )) :
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
          }
        </ul>
      </section>
      {/* 
          Tag select for filtering.
      */}
      <section className="header">
      <select
          className="new-todo"
          onChange={(evt) => setFilterByTag(evt.target.value)}
        >
          <option value="0">Filter todos by tag</option>
          {
            tags.length > 0 ?
            (tags.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))) : (
              ""
            )
          }
        </select>
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
