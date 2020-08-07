import React from "react";
class ThisMonthToDos extends React.Component{
    render(){
        let data = this.props.data;
        let {thisMonthToDos, theme, ifInput} = data.state;
        let {toggleIfShowMore, deleteInDB, showInput} = data.method;

        let renderThisMonthTodos = thisMonthToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
            <span>
                {todo.title}
            </span>
            <span className={`month_todo_feacture mf2_${theme}`}>
                <span ><i className="fas fa-pen" data-list={todo.list} data-id={todo.id} data-index={index} data-title={todo.title} onClick={(e)=>toggleIfShowMore(e)}></i></span>
                <span><i className="fas fa-check" data-delete-index={index} data-title={todo.title} onClick={(e)=>deleteInDB(e)}></i></span>
            </span>
        </div>);
        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此月待辦事項！</div>
        return <div className="month_todos">
            {ifInput? showInput() : ''}
            {renderThisMonthTodos==''?hint:''}
            {renderThisMonthTodos}
        </div>
    }
}
export default ThisMonthToDos;