import React from "react";
class EachDayToDos extends React.Component{
    render(){
        let data = this.props.data;
        let {eachDayToDos, theme} = data.state;
        let {toggleEachDayIfInput, showEachDayInput, toggleIfShowMore, deleteEachDay} = data.method; 
        let dayName = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        let renderEachDayTodos = eachDayToDos.map((eachday,index)=>{
            return <div className={eachday.month== new Date().getMonth()&&eachday.date==new Date().getDate()?"week_day week_day_today":"week_day weekday_dk"} key={index}>
                <div className="week_day_a">
                    <span className={`week_day_title week_day_title_${theme}`}>{eachday.month+1}月{eachday.date}日</span>
                    <span className={`week_day_title week_day_title_${theme}`}>{dayName[index]}</span>
                    <span className={`w_add_bt w_add_bt_${theme}`} data-addindex={index} data-month={eachday.month} data-date={eachday.date} onClick={(e)=>toggleEachDayIfInput(e)}>+</span>
                </div>
                {/* 每日新增todo */}
                {eachday.ifInput? showEachDayInput(index) : ''}

                {eachday.todos.map((todo,innerindex)=>
                    <div className="month_todo" key={innerindex}>
                        <span key={innerindex}>
                        {todo.title}</span>
                        <span className={`month_todo_feacture mf3_${theme}`}>
                            <span><i className="fas fa-pen" data-id={todo.id} data-title={todo.title} data-index={index} data-month={eachday.month} data-date={eachday.date} data-innerindex={innerindex} onClick={(e)=>toggleIfShowMore(e)} ></i></span>
                            <span><i className="fas fa-check" data-id={todo.id} data-inner-index={innerindex} data-outer-index={index} data-title={todo.title} onClick={(e)=>deleteEachDay(e)}></i></span>
                        </span>
                    </div>)}
                </div>});
        return <div className="week_log">
            {renderEachDayTodos}               
        </div> 
    }
}
export default EachDayToDos;