import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class RenderWeekLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            year: new Date().getFullYear(), //2020
            month: new Date().getMonth(), //7
            date: new Date().getDate(), //3
            // day: new Date().getDay(), //五
            weekNum: null,
            // 根據今天日期取得週數
            thisWeekToDos:[
                // {"title":1,"index":1,"ifDone":false},
                // {"title":2,"index":1,"ifDone":false}
            ],
            eachDayToDos:[
                // {month:
                // date:0,
                // day:3,
                // todos:['eat','sleep'],
                // ifInput: false},

                // {date:1,
                // day:4,
                // todos:['drink','shop','course'],
                // ifInput: false}
            ],
            ifInput: false,
            note:""  
        };
        this.updateEachDayToDosOfWeek = this.updateEachDayToDosOfWeek.bind(this);
        this.countWeekNum = this.countWeekNum.bind(this);
        this.setWeekNum = this.setWeekNum.bind(this);
        this.handleWeekForward = this.handleWeekForward.bind(this);
        this.handleWeekBackward = this.handleWeekBackward.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        // this.updateThisWeekToDos = this.updateThisWeekToDos.bind(this);
        this.addThisWeekToDos = this.addThisWeekToDos.bind(this);
        this.toggleIfInput = this.toggleIfInput.bind(this);
        this.showInput = this.showInput.bind(this);
        //EachDay
        this.toggleEachDayIfInput = this.toggleEachDayIfInput.bind(this);
        this.showEachDayInput = this.showEachDayInput.bind(this);
        this.turnOffEachDayIfInput = this.turnOffEachDayIfInput.bind(this);
        this.addThisDayToDos = this.addThisDayToDos.bind(this);
        // DB
        this.addToDB = this.addToDB.bind(this);
        this.getDBdataInState = this.getDBdataInState.bind(this);
    }
    
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        console.log(e.currentTarget.value);
    }
    
    addThisWeekToDos(){
        this.setState(preState=>{
            let thing = preState.note;
            let {year} = preState;
            let {month} = preState;
            let {weekNum} = preState;
            let thisWeekToDos = preState.thisWeekToDos;
            let ifInput = preState.ifInput;
            thisWeekToDos.push({"title":thing,"index":thisWeekToDos.length,"ifDone":false});
            // console.log(list);
            this.addToDB(thing, year, month, 0, weekNum);
            return{
                thisWeekToDos:thisWeekToDos,
                note:"",
                ifInput:!ifInput
            };
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

    getDBdataInState(week,year,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisWeekToDos = [];
        
        if (date == 0){
            ref.where('week','==',week).where('year','==',year).where('date','==',date)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        
                        thisWeekToDos.push({
                            title: doc.data().title,
                            ifDone: doc.data().isDone
                        });
                        // console.log(doc.data());
                    });
                    this.setState({
                        thisWeekToDos:thisWeekToDos
                    });
                });
        }else{
            ref.where('week','==',week).where('year','==',year).where('date','==',date)
                .get().then(querySnapshot => {
                    console.log('hhhhaaaaaaa');
                    console.log(week,year,date);
                    querySnapshot.forEach((doc,index)=>{
                        console.log(index);
                        // this.setState(preState=>{
                        //     let eachDayToDos = preState.eachDayToDos;
                        //     eachDayToDos[index+1].todos.push(doc.data().title);
                        //     return{
                        //         eachDayToDos: eachDayToDos
                        //     }
                        // });
                        console.log('yaaaaaooooo');
                        console.log(doc.data());
                    });
                })
        }
    }


    setWeekNum(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            // 將該週未安排事件放入state
            this.getDBdataInState(this.countWeekNum(new Date(`${year}-${month+1}-${date}`)),this.state.year,0);
            // 將該週已安排事件放入state
            this.updateEachDayToDosOfWeek()
            // console.log(`${year}-${month+1}-${date}`);
            // console.log(this.countWeekNum(new Date(`${year}-${month+1}-${date}`)));
            
            return {weekNum:this.countWeekNum(new Date(`${year}-${month+1}-${date}`))}
        })
    }

    addThisDayToDos(day){
        let indexDay = day.currentTarget.getAttribute("data-addday");
        console.log(day.currentTarget.getAttribute("data-addday"));
        this.setState(preState=>{
            let thing = preState.note;
            let eachDayToDos = preState.eachDayToDos;
            let {year} = preState;
            let {month} = preState;
            let {date} = preState;
            let {weekNum} = preState;
            let todayDay = new Date(`${year}-${month+1}-${date}`).getDay();
            eachDayToDos[indexDay].todos.push(thing);
            eachDayToDos[indexDay].ifInput = false;
            
            //先宣告indexdate為當天，用setDate(加上點擊日為星期幾)，得到滑鼠點擊新增事件的日期
            let indexDate = new Date(`${year}-${month+1}-${date}`);
            indexDate.setDate(indexDate.getDay()+parseInt(indexDay)+1);
            console.log(indexDate);
            this.addToDB(thing,year,month,indexDate.getDate(),weekNum);
            return{
                eachDayToDos:eachDayToDos,
                note:""
            }
        });
    }


    updateEachDayToDosOfWeek(){
        //取得該週第一天的月份日期
        //根據今日算出這一週的第一天是幾月幾號
        //setState 將月/日/空todo存入陣列 生成週曆
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let {weekNum} = preState;
            let date = preState.date;
            let eachDayToDos = preState.eachDayToDos;
            for (let i=0; i<7; i++){
                let curr = new Date(`${year}-${month+1}-${date}`);
                let first = curr.getDate() - curr.getDay()+1;
                let firstday = new Date(curr.setDate(first));
                firstday.setDate(firstday.getDate()+i);
                // console.log(firstday);
                eachDayToDos.push({
                    month:firstday.getMonth(),
                    date:firstday.getDate(),
                    day:i+1,
                    todos:[],
                    ifInput:false
                });
                this.getDBdataInState(weekNum,year,firstday.getDate());
            }
            console.log(this.state.eachDayToDos);
            return{eachDayToDos:eachDayToDos}
        });    
    }

    toggleEachDayIfInput(eachday){
        // 取得要新增事件的那一天綁定在onClick上
        console.log(eachday.currentTarget.getAttribute("data-addindex"));
        let index = eachday.currentTarget.getAttribute("data-addindex");
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            let ifInput = preState.ifInput;
            eachDayToDos.map((eachday,index)=>{eachday.ifInput = false});
            eachDayToDos[index].ifInput = true;
            
            // console.log(eachDayToDos[index].ifInput);
            console.log(eachDayToDos);
            return {
                eachDayToDos: eachDayToDos,
                ifInput: false
            }
        });
        
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

    showInput(){
        return(
            <div className="month_todo">
                <span>
                    <input type="checkbox" />
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.toggleIfInput}>cancel</span>
                    <span onClick={this.addThisWeekToDos}>add</span>
                </span>
            </div>
        )
    }

    showEachDayInput(i){
        return(
            <div className="month_todo">
                <span>
                    <input type="checkbox" />
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.turnOffEachDayIfInput}>cancel</span>
                    <span data-addday={i} onClick={this.addThisDayToDos}>add</span>
                </span>
            </div>
        )
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

    componentDidMount(){
        // 先將週數set完成，再呼叫render這週每天事項的method
        // updateEachDayToDosOfWeek()寫在setWeekNum()裡面
        this.setWeekNum();
    }

    countWeekNum(d){
        //算出今日是第幾週 d=new Date("2020-05-02")
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    }

    handleWeekForward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let {eachDayToDos} = preState.eachDayToDos;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()+7);
            newdate = new Date(newdate);
            console.log(newdate);
            console.log(preState.thisWeekToDos)
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate(),
                eachDayToDos:[] //清空
            }
        });
        this.setWeekNum();
        this.updateEachDayToDosOfWeek();
    }
    handleWeekBackward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let {eachDayToDos} = preState.eachDayToDos;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()-7);
            newdate = new Date(newdate);
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate(),
                eachDayToDos:[] //清空
            }
        });
        this.setWeekNum();
        this.updateEachDayToDosOfWeek();
    }

    componentDidUpdate(){
    }

    
    render(){
        // 此週待辦
        let renderThisWeekTodos = this.state.thisWeekToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span><input type="checkbox" name="" id=""></input>{todo.title}</span>
                <span className="month_todo_feacture">
                    <span><i className="fas fa-angle-double-right"></i></span>
                    <span ><i className="fas fa-info-circle"></i></span>
                    <span><i className="fas fa-arrows-alt"></i></span>
                </span>
            </div>);
        let dayName = ["Mon","Tue","Wen","Thu","Fri","Sat","Sun"];
        // 每日待辦
        let renderEachDayTodos = this.state.eachDayToDos.map((eachday,index)=>
            <div className="week_day" key={index}>
                <div className="week_day_a">
                    <span className="week_day_title">{eachday.month+1}月{eachday.date}日</span>
                    <span className="week_day_title">{dayName[index]}</span>
                    <span className="w_add_bt" data-addindex={index} onClick={this.toggleEachDayIfInput}>+</span>
                </div>
                {/* 每日新增todo */}
                {eachday.ifInput? this.showEachDayInput(index) : ''}

                {eachday.todos.map((todo,index)=>
                    <div className="month_todo" key={index}>
                        <span key={index}><input type="checkbox"></input>{todo}</span>
                        <span className="month_todo_feacture">
                            <span><i className="fas fa-angle-double-right"></i></span>
                            <span><i className="fas fa-info-circle"></i></span>
                            <span><i className="fas fa-arrows-alt"></i></span>
                        </span>
                    </div>)}
            </div>);
        
        // let renderAddThing = this.state.note.map((thing,index)=>
        // <div className="month_todo" key={index}>
        //     <span><input type="checkbox" name="" id=""></input>{this.state.note}</span>
        //     <span className="month_todo_feacture">
        //         <span><i className="fas fa-angle-double-right"></i></span>
        //         <span ><i className="fas fa-info-circle"></i></span>
        //         <span><i className="fas fa-arrows-alt"></i></span>
        //     </span>
        // </div>);

        

        // console.log(this.state.eachDayToDos);
        return <div className="left_board">
            <div className="month_title">
                <span className="title_month">Week {this.state.weekNum}</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar"></i></span>
                    <span><i className="fas fa-angle-left" onClick={this.handleWeekBackward}></i></span>
                    <span><i className="fas fa-angle-right" onClick={this.handleWeekForward}></i></span>
                    <span><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
                </span>
            </div>
            <div className="month_todos">
                {/* 
                <div className="month_todo">
                    <span><input type="checkbox"></input>背單字</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div> */}
                {/* <div class="input_bt">
                    <input type="text"/>
                    <input type="submit" value="cancel"/>
                    <input type="submit" value="add"/>
                </div> */}
                {this.state.ifInput? this.showInput() : ''}

                {/* <div>{renderAddThing}</div> */}
                {renderThisWeekTodos}
            </div>
            <div className="week_log">
                {renderEachDayTodos}               
                {/* <div className="week_day">
                    <div className="week_day_a">
                        <span className="week_day_title">6月30日</span>
                        <span className="w_add_bt">+</span>
                    </div>
                    <div className="month_todo">
                        <span><input type="checkbox" name="" id=""></input>睡覺</span>
                        <span className="month_todo_feacture">
                            <span><i className="fas fa-angle-double-right"></i></span>
                            <span><i className="fas fa-info-circle"></i></span>
                            <span><i className="fas fa-arrows-alt"></i></span>
                        </span>
                    </div>
                </div> */}
                
            </div> 
        </div>;
    }
}


export default RenderWeekLog;