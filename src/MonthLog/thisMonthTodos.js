import React from "react";
class ThisMonthToDos extends React.Component{
    render(){
        let renderThisMonthTodos = this.props.thisMonthToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
            <span>
                {todo.title}
            </span>
            <span className={`month_todo_feacture mf2_${this.props.theme}`}>
                <span ><i className="fas fa-pen" data-list={todo.list} data-id={todo.id} data-index={index} data-title={todo.title} onClick={this.props.toggleIfShowMore}></i></span>
                <span><i className="fas fa-check" data-delete-index={index} data-title={todo.title} onClick={this.props.deleteInDB}></i></span>
            </span>
        </div>);
        let hint = <div className={`hint hint_${this.props.theme}`}>hint：點擊右上+按鈕，新增此月待辦事項！</div>
        return <div className="month_todos">
            {this.props.ifInput? this.props.showInput() : ''}
            {renderThisMonthTodos==''?hint:''}
            {renderThisMonthTodos}
        </div>
    }
}
export default ThisMonthToDos;