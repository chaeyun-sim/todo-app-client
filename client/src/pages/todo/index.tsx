import TodoCard from '../../components/common/TodoCard';
import style from './index.module.css';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import AddTodoCard from '../../components/common/AddTodoCard';
import { TodoItem } from '../../types/types';
import SelectCategoryModal from '../../components/common/modal/SelectCategoryModal';
import SelectTimeModal from '../../components/common/modal/SelectTimeModal';
import MemoModal from '../../components/common/modal/MemoModal';
import { useAddTodo, useGetTodos } from '../../hooks/queries/useTodo';
import TITLES from '../../constants/title';

export default function Todo() {
  const [current, setCurrent] = useState(0);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [openModal, setOpenModal] = useState({
    isCategoryModalOpen: false,
    isTimeModalOpen: false,
    isMemoModalOpen: false,
  });
  const [inputs, setInputs] = useState<Omit<TodoItem, 'id' | 'is_completed'>>({
    title: '',
    category_id: 0,
    memo: '',
    start_date: '',
    end_date: '',
  });
  const { data: todoList, refetch } = useGetTodos({ target: TITLES[current].toLowerCase() });
  const { mutate: addTodo } = useAddTodo();

  useEffect(() => {
    if (todoList && todoList.data) {
      setTodos(todoList.data);
    }
  }, [todoList]);

  useEffect(() => {
    refetch();
  }, [current]);

  useEffect(() => {
    if (current === -1) setIsAdding(false);
  }, [current]);

  const addNewTodo = () => {
    if (inputs.title && inputs.start_date) {
      addTodo({
        category_id: inputs.category_id || 0,
        title: inputs.title,
        start_date: inputs.start_date,
        end_date: inputs.end_date,
        memo: inputs.memo ? inputs.memo.substring(0, 255) : '',
      });
      setIsAdding(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title_box}>
          <div className={style.title}>
            <button
              className={style.nav_btn}
              onClick={() => (current === -1 ? null : setCurrent(current - 1))}
            >
              <MdNavigateBefore size={25} />
            </button>
            {TITLES[current]}
            <button
              className={style.nav_btn}
              onClick={() => (current === 1 ? null : setCurrent(current + 1))}
            >
              <MdNavigateNext size={25} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {todos.map((todo, idx) => (
          <TodoCard
            key={todo.title + idx}
            data={todo}
            onRefetch={() => refetch()}
          />
        ))}
      </div>
      {current > -1 && isAdding && (
        <AddTodoCard
          inputs={inputs}
          onSetInputs={setInputs}
          openCategoryModal={() => setOpenModal({ ...openModal, isCategoryModalOpen: true })}
          openTimeModal={() => setOpenModal({ ...openModal, isTimeModalOpen: true })}
          openMemoModal={() => setOpenModal({ ...openModal, isMemoModalOpen: true })}
        />
      )}
      {!todos.length && !isAdding && (
        <div
          style={{
            height: '50%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>No Todos</h1>
        </div>
      )}
      {current > -1 && isAdding && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '47px',
            width: '100%',
            gap: '8px',
          }}
        >
          <button
            className={style.cancel_btn}
            onClick={() => setIsAdding(false)}
          >
            취소
          </button>
          <button
            className={style.add_btn}
            onClick={addNewTodo}
          >
            투두 추가하기
          </button>
        </div>
      )}
      {current > -1 && !isAdding && (
        <div
          className={style.add_todo_float}
          onClick={() => setIsAdding(true)}
        >
          <FaPlus
            color='#FAFAFA'
            size={22}
          />
        </div>
      )}
      {openModal.isCategoryModalOpen && (
        <SelectCategoryModal
          isOpen={openModal.isCategoryModalOpen}
          onClose={() => setOpenModal({ ...openModal, isCategoryModalOpen: false })}
          onSetCategory={category_id => setInputs({ ...inputs, category_id: category_id })}
        />
      )}
      {openModal.isTimeModalOpen && (
        <SelectTimeModal
          isOpen={openModal.isTimeModalOpen}
          onClose={() => setOpenModal({ ...openModal, isTimeModalOpen: false })}
          onSetTime={times =>
            setInputs({ ...inputs, start_date: times.start, end_date: times.end })
          }
          data={{
            startTime: inputs.start_date,
            endTime: inputs.end_date,
          }}
          current={current}
        />
      )}
      {openModal.isMemoModalOpen && (
        <MemoModal
          isOpen={openModal.isMemoModalOpen}
          onClose={() => setOpenModal({ ...openModal, isMemoModalOpen: false })}
          onSetText={text => setInputs({ ...inputs, memo: text })}
          data={inputs.memo as string}
        />
      )}
    </div>
  );
}
