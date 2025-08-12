import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import classNames from 'classnames';

const errorMessageLoader = 'Unable to load todos';
// const errorMasage_TITLE = 'Title should not be empty';
// const errorMasage_ADD = 'Unable to add a todo';
// const errorMasage_DELETE = 'Unable to delete a todo';
// const errorMasage_UPDATE = 'Unable to update a todo';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  // #constants
  const [todos, setTodos] = useState<Todo[]>([]);
  const [serchQuery, setSearchQuery] = useState('');
  const [loadingTodo, setLoadingTodo] = useState(false);

  // #error masage
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // #filter status
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<FilterStatus>('all');

  // #count todo
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    if (isErrorVisible) {
      const timeoutId = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [isErrorVisible]);

  useEffect(() => {
    setLoadingTodo(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errorMessageLoader);
        setIsErrorVisible(true);
      })
      .finally(() => {
        setLoadingTodo(false);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    let tempTodos = todos;

    if (filterStatus === 'active') {
      tempTodos = tempTodos.filter(todo => !todo.completed);
    } else if (filterStatus === 'completed') {
      tempTodos = tempTodos.filter(todo => todo.completed);
    }

    return tempTodos;
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              value={serchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoList key={todo.id} todo={todo} loadingTodo={loadingTodo} />
          ))}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer hidden" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {uncompletedTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  selected === 'all' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => {
                  setSelected('all');
                  setFilterStatus('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  selected === 'active'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => {
                  setSelected('active');
                  setFilterStatus('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  selected === 'completed'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setSelected('completed');
                  setFilterStatus('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isErrorVisible },
        )}
      >
        {errorMessage && (
          <>
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => {
                setIsErrorVisible(false);
              }}
            />
            {errorMessage}
          </>
        )}
      </div>
    </div>
  );
};
