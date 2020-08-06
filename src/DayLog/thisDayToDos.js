import React from "react";
class ThisDayToDos extends React.Component{
    render(){
        let theme = this.props.theme;
        let thisDayToDos = this.props.thisDayToDos;
        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此日待辦事項！</div>
        let renderThisDayTodos = thisDayToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf4_${theme}`}>
                    <span ><i className="fas fa-pen" data-list={todo.list} data-timer={todo.timer} data-id={todo.id} data-type={'date'} data-index={index} data-title={todo.title} onClick={this.props.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-type={'day'} data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.props.deleteInDB}></i></span>
                </span>
            </div>);
        return <div className="month_todos">
            {this.props.ifInput? this.props.showInput() : ''}
            {renderThisDayTodos==''?hint:''}
            {renderThisDayTodos}
        </div>
    }
}
export default ThisDayToDos;