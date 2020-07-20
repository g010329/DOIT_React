import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
import Calendar from "./calendar";
import ChangeWeekCal from "./changeWeekCal.js";
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
                // todos:[{title:"eat",ifDone:"false"},'sleep'],
                // ifInput: false,
                // id:null }

                // {date:1,
                // day:4,
                // todos:['drink','shop','course'],
                // ifInput: false,
                // id:null }
            ],
            ifInput: false,
            note:"",
            moreInfoBoard:{
                oldTitle:'',
                index:0,
                innerIndex:null,
                newTitle:'',
                id:null,
                iYear:null,
                iMonth:null,
                iDate:null,
                iWeek:null
            },
            calenIfShow:false,
            ifChangeMonth:false
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
        this.deleteInDB = this.deleteInDB.bind(this);
        this.deleteEachDay = this.deleteEachDay.bind(this);
        //ifDone
        this.ifDone = this.ifDone.bind(this);
        // adjust
        this.showMoreInfo = this.showMoreInfo.bind(this);
        this.toggleIfShowMore = this.toggleIfShowMore.bind(this);
        this.adjustTodo = this.adjustTodo.bind(this);
        // calen
        this.showCalen = this.showCalen.bind(this);
        this.calenUpdateTime = this.calenUpdateTime.bind(this);
        //date calen
        this.ifChangeWeek = this.ifChangeWeek.bind(this);
        this.changeWeek= this.changeWeek.bind(this);
    }

    ifChangeWeek(){
        this.setState(preState=>{
            let ifChangeWeek = !preState.ifChangeWeek;
            console.log('更換週')
            return{
                ifChangeWeek: ifChangeWeek
            }
        })
    }
    changeWeek(year,month,date,week){
        this.setState(preState=>{
            return{
                year:year,
                month:month,
                date:date,
                weekNum:this.countWeekNum(new Date(`${year}-${month+1}-${date}`)),
                
            }
        });
        this.getDBdataInState(this.countWeekNum(new Date(`${year}-${month+1}-${date}`)),year,0);
        this.updateEachDayToDosOfWeek();
    }
    showCalen(){
        console.log('showCalen')
        this.setState(preState=>{
            let calenIfShow = !preState.calenIfShow;
            return{
                calenIfShow: calenIfShow
            }
        })
    }
    backToTodayBtn(){
        console.log('回到今天');
        this.setState(preState=>{
            return{
                year: new Date().getFullYear(), 
                month: new Date().getMonth(), 
                date: new Date().getDate(),
            }
        })
        this.setWeekNum();
        this.updateEachDayToDosOfWeek();
    }
    calenUpdateTime(year,month,date,week){
        console.log('calenUpdateTime',year,month,date);
        
        this.setState(preState=>{
            let moreInfoBoard = preState.moreInfoBoard;
            // if(0<date && date<=this.state.daysOfMonth){
                moreInfoBoard.iYear = year;
                moreInfoBoard.iMonth = month;
                moreInfoBoard.iDate = date;
                console.log(week,'999 表示點選的是週曆'); 
                if(week==999){
                    week = this.countWeekNum(new Date(`${year}-${month+1}-${date}`));
                    console.log('換算後的週數',week)
                    moreInfoBoard.iDate = 0;
                }
                moreInfoBoard.iWeek = week;
                
                console.log('calenUpdateTime',moreInfoBoard);
                return{
                    moreInfoBoard:moreInfoBoard
                } 
            // }
        })
    }
    toggleIfShowMore(e){
        // console.log(e.currentTarget.getAttribute("data-index"));
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let id = e.currentTarget.getAttribute("data-id");
        console.log(e.currentTarget.getAttribute("data-id"));
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-innerindex");
        
        this.setState(preState=>{
            let ifShowMore = preState.ifShowMore;
            let moreInfoBoard = preState.moreInfoBoard;
            moreInfoBoard.oldTitle = oldTitle;
            moreInfoBoard.index = index;
            moreInfoBoard.innerIndex = innerIndex;
            moreInfoBoard.id = id;
            moreInfoBoard.iYear = this.state.year;
            moreInfoBoard.iMonth = this.state.month;
            moreInfoBoard.iWeek = this.state.weekNum;
            // console.log(moreInfoBoard);
            return{
                ifShowMore:!ifShowMore,
                note : oldTitle,
                moreInfoBoard: moreInfoBoard
            }
        })
    }
    showMoreInfo(){
        return(
            <div id="moreInfo" className="bt_moreInfo_board">
                <div className="infoflex">
                    <div>
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="25" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle}></textarea>
                        {/* <textarea  className="info_contentInput" cols="50" rows="3" placeholder="Write here"></textarea> */}
                    </div>
                    <div>
                        <div className="info"><i className="fas fa-check-square"></i>
                            <span>task</span></div>
                        <div className="info" onClick={this.showCalen}><i className="fas fa-calendar"></i>
                            <span>week {this.state.moreInfoBoard.iWeek} of {this.state.moreInfoBoard.iYear}</span></div>
                        <div className="info"><i className="fas fa-list-ul"></i>
                            <span>add to list</span></div>
                    </div>
                </div>
                <div>
                    <span onClick={this.toggleIfShowMore}>cancel</span>
                    <span onClick={this.adjustTodo}>save</span>
                    <i className="fas fa-trash-alt"></i>
                </div>
            </div>
        )
    }

    adjustTodo(){
        let oldTitle = this.state.moreInfoBoard.oldTitle;
        let note;
        if (this.state.moreInfoBoard.innerIndex == null){
            console.log('adjust week to do');
            this.setState(preState=>{
                note = preState.note;
                let moreInfoBoard = preState.moreInfoBoard;
                let thisWeekToDos = preState.thisWeekToDos;
                let ifShowMore = preState.ifShowMore;
                thisWeekToDos[moreInfoBoard.index].title = note;
                // console.log(thisWeekToDos);
                // console.log(moreInfoBoard);
                return{
                    thisWeekToDos:thisWeekToDos,
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            // console.log('ha',this.state.year,this.state.weekNum,oldTitle,note);
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos");
            ref.where("year","==",this.state.year).where("week","==",this.state.weekNum).where("title","==",oldTitle)
                .get().then(querySnapshot=>{
                    querySnapshot.forEach(doc=>{
                        if(this.state.moreInfoBoard.iDate!=null){
                            doc.ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek})
                        }else{
                            doc.ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,week:this.state.moreInfoBoard.iWeek})
                        }
                        
                    })
                });
            alert('確認修改?');
            // this.props.reRenderLog();
        }else{
            // console.log('adjust day to do');
            this.setState(preState=>{
                note = preState.note;
                let moreInfoBoard = preState.moreInfoBoard;
                let eachDayToDos = preState.eachDayToDos;
                let ifShowMore = preState.ifShowMore;
                eachDayToDos[moreInfoBoard.index].todos[moreInfoBoard.innerIndex].title = note;
                
                // console.log(eachDayToDos);
                return{
                    eachDayToDos:eachDayToDos,
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            console.log('ha',this.state.moreInfoBoard);
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos").doc(this.state.moreInfoBoard.id);
            if(this.state.moreInfoBoard.iDate!=null){
                ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek}).then(()=>{
                    alert('成功修改');
                });
            }else{
                ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,week:this.state.moreInfoBoard.iWeek}).then(()=>{
                    alert('成功修改');
                });
            }
            console.log("note:",this.state.note);
            
        }
        this.props.reRenderLog();
    }

    deleteInDB(bt){
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("week","==",this.state.weekNum).where("year","==",this.state.year).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.delete();
                })
            });
        this.setState(preState=>{
            let thisWeekToDos = preState.thisWeekToDos;
            thisWeekToDos.splice(deleteIndex,1);
            return{
                thisWeekToDos:thisWeekToDos
            }
        });
        this.props.reRenderLog();
    }

    ifDone(e){
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-inner-index");
        let outerIndex = e.currentTarget.getAttribute("data-outer-index");
        let title = e.currentTarget.getAttribute("data-title");
        let month = parseInt(e.currentTarget.getAttribute("data-month"));
        let date = parseInt(e.currentTarget.getAttribute("data-date"));
        let week = parseInt(e.currentTarget.getAttribute("data-week"));
        // console.log(this.state.year,week,month,date,title);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        
        if (week>=0){
            let newStatus;
            // console.log("周未安排");
            this.setState(preState=>{
                let thisWeekToDos = preState.thisWeekToDos;
                newStatus = !thisWeekToDos[index].ifDone;
                thisWeekToDos[index].ifDone = newStatus;
                return{
                    thisWeekToDos:thisWeekToDos
                }
            });
            ref.where("week","==",week).where("year","==",this.state.year).where("title","==",title)
                .get().then(querySnapshot=>{
                    querySnapshot.forEach(doc=>{
                        // console.log(doc.data());
                        doc.ref.update({isDone:newStatus})
                    })
                })
        }else{
            let newStatus;
            // console.log("周已安排進每日");
            this.setState(preState=>{
                let eachDayToDos = preState.eachDayToDos;
                newStatus = !eachDayToDos[outerIndex].todos[innerIndex].ifDone;
                eachDayToDos[outerIndex].todos[innerIndex].ifDone = newStatus;
                return{
                    eachDayToDos:eachDayToDos
                }
            });
            ref.where("year","==",this.state.year).where("month","==",month).where("date","==",date).where("title","==",title)
                .get().then(querySnapshot=>{
                    querySnapshot.forEach(doc=>{
                        // console.log(doc.data());
                        // console.log(newStatus);
                        doc.ref.update({isDone:newStatus})
                    })
                })
        }
    }

    deleteEachDay(bt){
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let targetMonth = bt.currentTarget.getAttribute("data-month");
        let targetDate = bt.currentTarget.getAttribute("data-date");
        let outerIndex = bt.currentTarget.getAttribute("data-outer-index");
        let innerIndex = bt.currentTarget.getAttribute("data-inner-index");
        // console.log(outerIndex,innerIndex);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",parseInt(targetMonth)).where("date","==",parseInt(targetDate)).where("year","==",this.state.year).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    // console.log(doc.data());
                    doc.ref.delete();
                })
            });
        // console.log(deleteIndex);
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            // 刪除state array內某天某件事
            eachDayToDos[outerIndex].todos.splice(innerIndex,1);
            return{
                eachDayToDos:eachDayToDos
            }
        });
    }
    
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        console.log(this.state.note);
    }
    
    addThisWeekToDos(){
        this.setState(preState=>{
            let thing = preState.note;
            let {year} = preState;
            let {month} = preState;
            let {weekNum} = preState;
            let thisWeekToDos = preState.thisWeekToDos;
            let ifInput = preState.ifInput;
            thisWeekToDos.push({"title":thing,"index":thisWeekToDos.length,"iDone":false});
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
        // console.log('add');
    }

    getDBdataInState(week,year,date,day,month){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisWeekToDos = [];
        
        if (date == 0){
            ref.where('week','==',week).where('year','==',year).where('date','==',date).where('isDone','==',false)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        
                        thisWeekToDos.push({
                            title: doc.data().title,
                            ifDone: doc.data().isDone,
                            id: doc.id
                        });
                        // console.log(doc.data());
                    });
                    this.setState({
                        thisWeekToDos:thisWeekToDos
                    });
                });
        }else{
            ref.where('month','==',month).where('year','==',year).where('date','==',date)
                .get().then(querySnapshot => {
                    // console.log(week,year,date);
                    querySnapshot.forEach(doc=>{
                        // console.log(day);
                        this.setState(preState=>{
                            let eachDayToDos = preState.eachDayToDos;
                            eachDayToDos[day].todos.push({title:doc.data().title,ifDone:false,id:doc.id});
                            return{
                                eachDayToDos: eachDayToDos
                            }
                        });
                        // console.log(doc.data());
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
            
            // console.log(`${year}-${month+1}-${date}`);
            // console.log(this.countWeekNum(new Date(`${year}-${month+1}-${date}`)));
            
            return {weekNum:this.countWeekNum(new Date(`${year}-${month+1}-${date}`))}
        })
    }

    addThisDayToDos(day){
        let indexDay = day.currentTarget.getAttribute("data-addday");
        // console.log(day.currentTarget.getAttribute("data-addday"));
        this.setState(preState=>{
            let thing = preState.note;
            let eachDayToDos = preState.eachDayToDos;
            let {year} = preState;
            let {month} = preState;
            let date = preState.date;
            let weekNum = preState.weekNum;
            let todayDay = new Date(`${year}-${month+1}-${date}`).getDay();
            eachDayToDos[indexDay].todos.push({title:thing,ifDone:false});
            eachDayToDos[indexDay].ifInput = false;
            // console.log(eachDayToDos[indexDay].month+1+' / '+eachDayToDos[indexDay].date);
            
            // 因為已經將月份日期存入eachDayToDos[]陣列裡，可以透過點擊index取出月份日期，再存入DB
            this.addToDB(thing,year,eachDayToDos[indexDay].month,eachDayToDos[indexDay].date,weekNum);
            this.props.reRenderLog();
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
            eachDayToDos = [];
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
                this.getDBdataInState(weekNum,year,firstday.getDate(),i,month);
                // console.log(month,year,firstday.getDate());
            }
            
            return{eachDayToDos:eachDayToDos}
        });    
    }

    toggleEachDayIfInput(eachday){
        // 取得要新增事件的那一天綁定在onClick上
        // console.log(eachday.currentTarget.getAttribute("data-addindex"));
        let index = eachday.currentTarget.getAttribute("data-addindex");
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            let ifInput = preState.ifInput;
            eachDayToDos.map((eachday,index)=>{eachday.ifInput = false});
            eachDayToDos[index].ifInput = true;
            
            // console.log(eachDayToDos[index].ifInput);
            // console.log(eachDayToDos);
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
                    <input className="noScheInput" className="noScheInput" placeholder="ADD TASK" type="text" onChange={this.handleNoteChange}/>
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
        this.updateEachDayToDosOfWeek();
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
            // console.log(newdate);
            // console.log(preState.thisWeekToDos)
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


    componentDidUpdate(preProps){
        // 避免程式不斷更新，使用preProps
        // 原本沒有使用時，props.state更新後就進到 componentDidupdate
        // 然後因為在 componentDidupdate 裡使用 getDBdataInState，state狀態改變後又進入componentDidupdate
        // 因此程式會一直循環印出console.log("Day Update")，database會爆掉
        // console.log(preProps);
        // console.log("Week Update");
        if(preProps.reRender !== this.props.reRender){
            // this.updateEachDayToDosOfWeek();
            this.updateEachDayToDosOfWeek();
        }
        if(preProps.btToday !== this.props.btToday){
            this.backToTodayBtn();
        }
    }
    
    render(){
        // 此週待辦
        let renderThisWeekTodos = this.state.thisWeekToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span><input className="checkbox" type="checkbox" data-week={this.state.weekNum} data-index={index} data-title={todo.title} onChange={this.ifDone}></input>{todo.title}</span>
                <span className="month_todo_feacture">
                    <span><i className="fas fa-angle-double-right" ></i></span>
                    <span ><i className="fas fa-info-circle" data-id={todo.id} data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-arrows-alt" data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
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

                {eachday.todos.map((todo,innerindex)=>
                    <div className="month_todo" key={innerindex}>
                        <span key={innerindex}>
                            <input className="checkbox" type="checkbox" data-title={todo.title} data-inner-index={innerindex} data-outer-index={index} data-month={eachday.month} data-date={eachday.date} onChange={this.ifDone}></input>
                        {todo.title}</span>
                        <span className="month_todo_feacture">
                            <span><i className="fas fa-angle-double-right" ></i></span>
                            <span><i className="fas fa-info-circle" data-id={todo.id} data-title={todo.title} data-index={index} data-innerindex={innerindex} onClick={this.toggleIfShowMore} ></i></span>
                            <span><i className="fas fa-arrows-alt" data-inner-index={innerindex} data-outer-index={index} data-month={eachday.month} data-date={eachday.date} data-title={todo.title} onClick={this.deleteEachDay}></i></span>
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
        return <div id="week" className="left_board">
            {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)}/>:''}
            {this.state.ifChangeWeek?<ChangeWeekCal changeWeek={this.changeWeek.bind(this)}/>:''}
            <div className="month_title">
                <span className="title_month">Week {this.state.weekNum}</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar" onClick={this.ifChangeWeek}></i></span>
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
            <div className="wbgc"></div>
            {/* 單一事件控制面板 */}
            {this.state.ifShowMore? this.showMoreInfo(): ''}
        </div>;
    }
}


export default RenderWeekLog;