import React from "react";
class Overdue extends React.Component{
    render(){
        let {theme} = this.props;
        let overdue = this.props.overdue.map((todo,index)=>
            <div className="month_todo"  key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf2_${theme}`}>
                    <span ><i className="fas fa-pen" data-list={todo.list} data-timer={todo.timer} data-type={'overdue'} data-id={todo.id} data-year={todo.year} data-month={todo.month} data-week={todo.week} data-date={todo.date} data-index={index} data-title={todo.title} onClick={this.props.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-type={'overdue'} data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.props.deleteInDB}></i></span>
                </span>
            </div>
        );
        
        return <div id="overdue" className={`overdue_board overdue_board_${theme}`}>
        <div className={`month_title month_title_${theme}`}>
            <span className="title_month">Overdue</span>
        </div>
        <div className="month_todos">
            {overdue}
        </div>
    </div>  
    }
}
export default Overdue;