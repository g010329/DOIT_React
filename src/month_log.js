import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
// 有使用者的uid: this.props.uid

class RenderMonthLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            year: new Date().getFullYear(), //2020
            month: new Date().getMonth(), //7
            date: new Date().getDate(), //3
            day: new Date().getDay(), //五
            daysOfMonth: new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(), //31
            thisMonthToDos:[
                // {"title":'add somthing todo',"index":1,"ifDone":false}
            ],
            eachDayToDos:[
                // {date:1, 1號
                // day:0, 週幾
                // todos:[eat,sleep],
                // ifInput: false}, 當天事項

                // {date:0,
                // day:3,
                // todos:['eat','sleep'],
                // ifInput: false}
            ],
            ifInput: false,
            note:"" 
        };
        this.updateEachDayToDos = this.updateEachDayToDos.bind(this);
        this.handleMonthForward = this.handleMonthForward.bind(this);
        this.handleMonthBackward = this.handleMonthBackward.bind(this);
        this.addThisMonthToDos = this.addThisMonthToDos.bind(this);
        this.toggleIfInput = this.toggleIfInput.bind(this);
        this.showInput = this.showInput.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        // EachDate
        this.toggleEachDateIfInput = this.toggleEachDateIfInput.bind(this);
        this.showEachDateInput = this.showEachDateInput.bind(this);
        this.turnOffEachDayIfInput = this.turnOffEachDayIfInput.bind(this);
        this.addThisDayToDos = this.addThisDayToDos.bind(this);
        // DB
        this.addToDB = this.addToDB.bind(this);
        this.deleteInDB = this.deleteInDB.bind(this);
        this.getDBdataInState = this.getDBdataInState.bind(this);
    }


    toggleEachDateIfInput(eachday){
        // 取得要新增事件的那一天index綁定在onClick上
        console.log(eachday.currentTarget.getAttribute("data-addindex"));
        let index = eachday.currentTarget.getAttribute("data-addindex");
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            let ifInput = preState.ifInput;
            eachDayToDos.map((eachday,index)=>{eachday.ifInput = false});
            eachDayToDos[index].ifInput = true;
            console.log(eachDayToDos);
            return {
                eachDayToDos: eachDayToDos,
                ifInput: false
            }
        });
    }

    addToDB(title,year,month,date,week){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos").doc();
        ref.set({
            title: title,
            year: year,
            // 存入DB的月份，假設七月，會顯示6
            month: month,
            date: date,
            week: week,
            type: "task",
            isDone: false,
            overdue: false           
        });
        console.log('add');
    }

    getDBdataInState(month,year,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        
        let thisMonthToDos = [];
        
        if(date == 0){
            ref.where('month','==',month).where('year','==',year).where('date','==',date)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        thisMonthToDos.push({
                            title: doc.data().title,
                            ifDone: doc.data().isDone
                        });
                        // console.log(doc.data());
                        
                    });
                    this.setState({
                        thisMonthToDos:thisMonthToDos
                    })
                });
        }else{
            ref.where('month','==',month).where('year','==',year).where('date','==',date)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        this.setState(preState=>{
                            let eachDayToDos = preState.eachDayToDos;
                            eachDayToDos[doc.data().date-1].todos.push(doc.data().title);
                            return{
                                eachDayToDos: eachDayToDos
                            }
                        });
                        console.log(doc.data());
                    });
                });
        }
    }
    componentDidMount(){
        this.updateEachDayToDos();
        // 將該月未安排事件放入state
        this.getDBdataInState(this.state.month,this.state.year,0);
        
    }
    addThisMonthToDos(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let thing = preState.note;
            let thisMonthToDos = preState.thisMonthToDos;
            let ifInput = preState.ifInput;
            thisMonthToDos.push({"title":thing,"index":thisMonthToDos.length,"ifDone":false});
            // 將該月未安排日期事項存入DB
            this.addToDB(thing, year, month, 0, 0);
            // console.log(list);
            return{
                thisMonthToDos:thisMonthToDos,
                note:"",
                ifInput:!ifInput
            };
        });
    }
    deleteInDB(){}
    
    
    updateEachDayToDos(){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        //setState 將月/日/空todo存入陣列 生成週曆
        this.setState(preState=>{
            // let {daysOfMonth} = this.state;
            // console.log("month", preState.month);
            let {year} = preState;
            let {month} = preState;
            let daysOfMonth = preState.daysOfMonth;
            let eachDayToDos = preState.eachDayToDos;
            // let {eachDayToDos} = this.state;
            for (let i=0; i<daysOfMonth; i++){
                eachDayToDos.push({
                    date:i,
                    day:new Date(`${preState.year}-${preState.month+1}-${i+1}`).getDay(),
                    todos:[],
                    ifInput: false
                });
                this.getDBdataInState(month,year,i+1);
            }
            console.log(eachDayToDos);
            return{eachDayToDos:eachDayToDos}
        });
    }
    
    turnOffEachDayIfInput(){
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            eachDayToDos.map((eachday,index)=>{eachday.ifInput = false});
            return{
                eachDayToDos:eachDayToDos
            }
        })
    }
    showEachDateInput(i){
        return(
        <div className="month_todo" >
                <span>
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.turnOffEachDayIfInput}>cancel</span>
                    <span data-addday={i} onClick={this.addThisDayToDos} >add</span>
                </span>
            </div>
        )
    }

    addThisDayToDos(day){
        let indexDay = day.currentTarget.getAttribute("data-addday");
        console.log(day.currentTarget.getAttribute("data-addday"));
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = parseInt(indexDay)+1;
            let thing = preState.note;
            let eachDayToDos = preState.eachDayToDos;
            eachDayToDos[indexDay].todos.push(thing);
            eachDayToDos[indexDay].ifInput = false;
            this.addToDB(thing, year, month, date, 0);
            return{
                eachDayToDos:eachDayToDos,
                note:""
            }
        });
    }

    handleMonthForward(){
        this.setState(preState=>{
            let {year} = this.state;
            let {month} = this.state;
            let {eachDayToDos} = this.state;
            if(month<11){
                this.getDBdataInState(this.state.month+1,this.state.year,0);
                return{
                    month: month+1,
                    daysOfMonth: new Date(year,month+1,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }else{
                // console.log('123')
                this.getDBdataInState(0,this.state.year+1,0);
                return{
                    year: year+1,
                    month: 0,
                    daysOfMonth: new Date(year+1,0,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }
        });
        this.updateEachDayToDos();
    }
    handleMonthBackward(){
        this.setState(preState=>{
            let {year} = this.state;
            let {month} = this.state;
            let {eachDayToDos} = this.state;
            if(month==0){
                this.getDBdataInState(11,this.state.year-1,0);
                return{
                    year: year-1,
                    month: 11,
                    daysOfMonth: new Date(year-1,0,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }else{
                this.getDBdataInState(this.state.month-1,this.state.year,0);
                return{
                    month: month-1,
                    daysOfMonth: new Date(year,month-1,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }
            
        });
        this.updateEachDayToDos();
    }
    componentDidUpdate(){
        // console.log(`Forward${year}/${month}`);
        // console.log(`${this.state.year}/${this.state.month+1}=>${this.state.daysOfMonth}`);
    }
    toggleIfInput(){
        this.setState(preState=>{
            let ifInput = preState.ifInput;
            ifInput = !ifInput;
            // console.log(ifInput);
            return{
                ifInput: ifInput
            }
        });
        this.turnOffEachDayIfInput();
    }
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        console.log(e.currentTarget.value);
    }
    showInput(){
        return(
        <div className="month_todo" >
                <span>
                    <input type="checkbox" name="" id=""/>
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.toggleIfInput}>cancel</span>
                    <span onClick={this.addThisMonthToDos}>add</span>
                </span>
            </div>
        )
    }
    

    render(){
        // console.log(`${this.state.year}/${this.state.month}`);
        // console.log(this.state.eachDayToDos);
        let eachMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let eachDay = ["S","M","T","W","T","F","S"];
        // render 該週事項
        let renderThisMonthTodos = this.state.thisMonthToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
            <span><input type="checkbox" name="" id=""></input>{todo.title}</span>
            <span className="month_todo_feacture">
                <span><i className="fas fa-angle-double-right"></i></span>
                <span ><i className="fas fa-info-circle"></i></span>
                <span><i className="fas fa-arrows-alt"></i></span>
            </span>
        </div>);
        // render 每日事項
        let renderEachDayTodos = this.state.eachDayToDos.map((eachday,index)=>
            <div key={index}>
            {/* 每日事項input */}
            <div>{eachday.ifInput? this.showEachDateInput(index) : ''}</div>
            <div className="month_day" >
                {/* 每日新增事件 */}
                
                <div className="month_day_a">
                    <span className="m_date" >{eachday.date+1}</span>
                    <span className="m_day_of_week" >{eachDay[eachday.day]}</span>
                    <span className="m_add_bt" data-addindex={index} onClick={this.toggleEachDateIfInput}>+</span>
                </div>
                <div className="month_day_b">
                    {eachday.todos.map((todo,index)=><span className="m_bt" key={index}>{todo}</span>)}
                </div>
            </div>
            </div>);
        
        return <div className="left_board">
        
        {/* 月-標題 */}
        <div className="month_title">
            <span className="title_month">{eachMonth[this.state.month]}</span>
            <span className="title_right">
                <span><i className="fas fa-calendar"></i></span>
                <span><i className="fas fa-angle-left" value="-" onClick={this.handleMonthBackward}></i></span>
                <span><i className="fas fa-angle-right" onClick={this.handleMonthForward}></i></span>
                <span><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
            </span>
        </div>
        {/* 月-未安排事項 */}
        <div className="month_todos">
            {this.state.ifInput? this.showInput() : ''}
            
            {renderThisMonthTodos}
            {/* <div className="month_todo">
                <span><input type="checkbox" name="" id=""></input>睡覺</span>
                <span className="month_todo_feacture">
                    <span><i className="fas fa-angle-double-right"></i></span>
                    <span ><i className="fas fa-info-circle"></i></span>
                    <span><i className="fas fa-arrows-alt"></i></span>
                </span>
            </div>
            <div className="month_todo">
                <span><input type="checkbox" name="" id=""></input>背單字</span>
                <span className="month_todo_feacture">
                    <span><i className="fas fa-angle-double-right"></i></span>
                    <span ><i className="fas fa-info-circle"></i></span>
                    <span><i className="fas fa-arrows-alt"></i></span>
                </span>
            </div> */}
        </div>
        {/* 月-30天月曆 */}
        <div className="month_log">
            {/* <div className="month_week">
                <div className="month_day_a">
                    <span className="month_week_title">week1</span>
                    <span className="m_add_bt">+</span>
                </div>
                <div className="month_day_b">
                    <span className="m_bt">家教1</span>
                    <span className="m_bt">家教</span>
                    <span className="m_bt">家教</span>
                    <span className="m_bt">家教家教家教</span>
                    <span className="m_bt">家教</span>
                </div>
            </div> */}
            
            {renderEachDayTodos}

            {/* <div className="month_day">
                <div className="month_day_a">
                    <span className="m_date">1</span>
                    <span className="m_day_of_week">M</span>
                    <span className="m_add_bt">+</span>
                </div>
                <div className="month_day_b">
                    <span className="m_bt">家教</span>
                    <span className="m_bt">家教</span>
                    <span className="m_bt">家教</span>
                    <span className="m_bt">家教家教家教</span>
                    <span className="m_bt">家教</span>
                </div>
            </div> */}

            {/* <div className="month_day">
                <div className="month_day_a">
                    <span className="m_date">30</span>
                    <span className="m_day_of_week">T</span>
                    <span className="m_add_bt">+</span>
                </div>
                <div className="month_day_b">
                    <span className="m_bt">家教</span>
                </div>
            </div> */}
        </div>
    </div>;
    }
}



export default RenderMonthLog;