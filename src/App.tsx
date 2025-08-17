import React, { useEffect, useMemo, useState } from 'react';

// #Import
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
import { Todo } from './types/Todo';

// #Type
type FilterStatus = 'all' | 'active' | 'completed';

// #Constant
const errorMessageLoader = 'Unable to load todos';

export const App: React.FC = () => {
  // #State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // #Error message
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // #Filter status
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // #count todo
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errorMessageLoader);
        setIsErrorVisible(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isErrorVisible) {
      const timeoutId = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [isErrorVisible]);

  // #Filter todos
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoList key={todo.id} todo={todo} loadingTodo={loading} />
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
      </div>

      <ErrorNotification
        isVisible={isErrorVisible}
        message={errorMessage}
        onClose={() => setIsErrorVisible(false)}
      />
    </div>
  );
};
