import React from "react";
class ThisDayToDos extends React.Component{
    render(){
        let data = this.props.data;
        let {theme, thisDayToDos, ifInput} = data.state;
        let {toggleIfShowMore, deleteInDB, showInput} = data.method;

        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此日待辦事項！</div>
        let renderThisDayTodos = thisDayToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf4_${theme}`}>
                    <span ><i className="fas fa-pen" data-list={todo.list} data-timer={todo.timer} data-id={todo.id} data-type={'date'} data-index={index} data-title={todo.title} onClick={(e)=>toggleIfShowMore(e)}></i></span>
                    <span><i className="fas fa-check" data-type={'day'} data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={(e)=>deleteInDB(e)}></i></span>
                </span>
            </div>);
        return <div className="month_todos">
            {ifInput? showInput() : ''}
            {renderThisDayTodos==''?hint:''}
            {renderThisDayTodos}
        </div>
    }
}
export default ThisDayToDos;