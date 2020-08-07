import React from "react";
class EachDayToDos extends React.Component{
    render(){
        let data = this.props.data;
        let {month, date, eachDayToDos, theme} = data.state;
        let {toggleEachDateIfInput, showEachDateInput, toggleIfShowMore} = data.method; 
        let eachDay = ["S","M","T","W","T","F","S"];
        let renderEachDayTodos = eachDayToDos.map((eachday,index)=>{
            return <div key={index}>
            {/* 每日事項input */}
                <div className={index==parseInt(date-1)&&month==new Date().getMonth()?`month_day todayBgc_${theme}`:"month_day"}>
                    {/* 每日新增事件 */}
                    <div className="month_day_a">
                        <span className="m_date" >{eachday.date+1}</span>
                        <span className={`m_day_of_week m_day_of_week_${theme}`} >{eachDay[eachday.day]}</span>
                        <span className={`m_add_bt m_add_bt_${theme}`}  data-addindex={index} onClick={(e)=>toggleEachDateIfInput(e)}>+</span>
                    </div>
                    <div className="month_day_b">
                        {eachday.todos.map((todo,innerIndex)=><span data-list={todo.list} data-id={todo.id} data-title={todo.title} data-index={index} data-innerindex={innerIndex} onClick={(e)=>toggleIfShowMore(e)} className={`m_bt m_bt_${theme}`} key={innerIndex}>{todo.title}</span>)}
                        <div>{eachday.ifInput? showEachDateInput(index) : ''}</div>
                    </div>
                </div>
                {eachday.day==0?<div className="weekBorder"></div>:''}
                
        </div>});
        return <div className="month_log">
            {renderEachDayTodos}
        </div>
    }
}
export default EachDayToDos;

// function getCollectionFromFirebase(db, collectionName, opts){
//     let ref=db.collection(collectionName);
//     if(opts.filter){
//         ref=ref.filter();
//     }
//     return ref.get();
// }
// function getDocumentFromFirebase(db, collection, documentId){

// }

// getCollectionFromFirebase(firebase, "todos", {filter:"", order:""}).then(()=>{
    
// })