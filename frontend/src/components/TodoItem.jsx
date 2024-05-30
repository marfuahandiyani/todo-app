// TodoItem.jsx
import IconPen from "./IconPen";
import IconTrash from "./IconTrash";

function TodoItem({todo, onDelete, onEdit, onToggleStatus}) {
  const isDoneTodo = todo.status === 1;

  const handleEdit = () => {
    const newName = prompt("Enter new name", todo.name);
    if (newName !== null) {
      onEdit(newName);
    }
  };
  
  return (
    <div className={"todo_app_item " + (isDoneTodo ? "todo_app_item_done" : "")}>
      <div className="checkbox-wrapper">
        <input type="checkbox" id={"todo" + todo.id} checked={isDoneTodo} onChange={onToggleStatus} className="substituted" aria-hidden="true" />
        <label htmlFor={"todo" + todo.id}>{todo.name}</label>
      </div>
      <div className={"todo_app_action " + (isDoneTodo && "d-none")}>
        <IconPen className="hover-pointer" width="1.2rem" height="1.2rem" onClick={handleEdit}/>
        <IconTrash className="hover-pointer" width="1.2rem" height="1.2rem" onClick={onDelete}/>
      </div>
    </div>
  );
}

export default TodoItem;
