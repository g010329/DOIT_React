import React from "react";
class ThisWeekToDos extends React.Component{
    render(){
        let data = this.props.data;
        let {thisWeekToDos, ifInput, theme} = data.state;
        let {toggleIfShowMore, deleteInDB, showInput} = data.method;
        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此週待辦事項！</div>
        let renderThisWeekTodos = thisWeekToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf2_${theme}`}>
                    <span><i className="fas fa-pen" data-id={todo.id} data-index={index} data-title={todo.title} onClick={(e)=>toggleIfShowMore(e)}></i></span>
                    <span><i className="fas fa-check" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={(e)=>deleteInDB(e)}></i></span>
                </span>
            </div>);
        
        return <div className="month_todos">
            {ifInput? showInput() : ''}
            {renderThisWeekTodos==''?hint:''}
            {renderThisWeekTodos}
        </div>
    }
}
export default ThisWeekToDos;