import React from "react";
class ThisWeekToDos extends React.Component{
    render(){
        let hint = <div className={`hint hint_${this.props.theme}`}>hint：點擊右上+按鈕，新增此週待辦事項！</div>
        let renderThisWeekTodos = this.props.thisWeekToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf2_${this.props.theme}`}>
                    <span><i className="fas fa-pen" data-id={todo.id} data-index={index} data-title={todo.title} onClick={this.props.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.props.deleteInDB}></i></span>
                </span>
            </div>);
        
        return <div className="month_todos">
            {this.props.ifInput? this.props.showInput() : ''}
            {renderThisWeekTodos==''?hint:''}
            {renderThisWeekTodos}
        </div>
    }
}
export default ThisWeekToDos;