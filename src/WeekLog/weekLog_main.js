import React from "react";
import db from "../firebase.js";
import Calendar from "../Calendars/calendar";
import ChangeWeekCal from "../Calendars/changeWeekCal.js";
import {countWeekNum,handleValidation} from '../util.js';

import EachDayToDos from "./eachDayToDos.js";
import ThisWeekToDos from "./thisWeekTodos.js";
import LogTitle from "./weekLogTitle.js";
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
                // {month: 7
                // date:0,
                // day:3,
                // todos:[{title:"eat",ifDone:"false"},'sleep'],
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
                iWeek:null,
                list:null
            },
            calenIfShow:false,
            ifChangeWeek:false,
            theme: this.props.theme
        };
        this.updateEachDayToDosOfWeek = this.updateEachDayToDosOfWeek.bind(this);
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
        // adjust
        this.showMoreInfo = this.showMoreInfo.bind(this);
        this.toggleIfShowMore = this.toggleIfShowMore.bind(this);
        this.adjustTodo = this.adjustTodo.bind(this);
        this.autoHeight = this.autoHeight.bind(this);
        // calen
        this.showCalen = this.showCalen.bind(this);
        this.calenUpdateTime = this.calenUpdateTime.bind(this);
        //date calen
        this.ifChangeWeek = this.ifChangeWeek.bind(this);
        this.changeWeek= this.changeWeek.bind(this);
        //List
        this.chooseList = this.chooseList.bind(this);  
        // input required
        // this.handleValidation = this.handleValidation.bind(this);
        //outside
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }
    handleClickOutside(event) {
        let cN = event.target.classList;
        if(cN.contains('popUp')){
            return;
        }else{
            this.setState({
                ifChangeWeek:false,
                calenIfShow:false,
            })
        }
        
    }
    chooseList(e){
        let list = e.target.value;
        this.setState(preState=>{
            let {moreInfoBoard} = preState;
            moreInfoBoard.list = list;
            return{
                moreInfoBoard: moreInfoBoard
            }
        })
    }

    ifChangeWeek(){
        this.setState(preState=>{
            return{
                ifChangeWeek: !preState.ifChangeWeek
            }
        })
    }
    changeWeek(year,month,date,week){
        if(date<1){
            return;
        }else{
            this.setState(preState=>{
                return{
                    year:year,
                    month:month,
                    date:date,
                    weekNum:countWeekNum(new Date(`${year}-${month+1}-${date}`)),
                    ifChangeWeek:false
                }
            }, ()=>{
                this.getDBdataInState(countWeekNum(new Date(`${year}-${month+1}-${date}`)),year,0);
                this.updateEachDayToDosOfWeek();
            });
        }
    }
    showCalen(){
        this.setState(preState=>{
            return{
                calenIfShow: !preState.calenIfShow
            }
        })
    }
    backToTodayBtn(){
        // console.log('回到今天');
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
        if(date<1){
            return;
        }if(date>new Date(year,month+1,0).getDate() && date!==999){
            return;
        }else{
            this.setState(preState=>{
                let {moreInfoBoard} = preState;
                moreInfoBoard.iYear = year;
                moreInfoBoard.iMonth = month;
                moreInfoBoard.iDate = date;
                moreInfoBoard.iWeek = null;
                // console.log(week,'999 表示點選的是週曆'); 
                if(week==999){
                    week = countWeekNum(new Date(`${year}-${month+1}-${date}`.replace(/\s/, 'T')));
                    // console.log('換算後的週數',week)
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = week;
                }
                if(date==999){
                    // console.log('表示在選擇月份')
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = null
                }
                return{
                    moreInfoBoard:moreInfoBoard,
                    calenIfShow:false
                } 
            })
        }
        
    }
    toggleIfShowMore(e){
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let id = e.currentTarget.getAttribute("data-id");
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-innerindex");
        let month = e.currentTarget.getAttribute("data-month");
        let date = e.currentTarget.getAttribute("data-date");
        let list = e.currentTarget.getAttribute("data-list");
        this.setState(preState=>{
            let {ifShowMore, moreInfoBoard} = preState;
            moreInfoBoard.oldTitle = oldTitle;
            moreInfoBoard.index = index;
            moreInfoBoard.innerIndex = innerIndex;
            moreInfoBoard.id = id;
            moreInfoBoard.iYear = this.state.year;
            
            if (month!=null){
                //選擇月
                moreInfoBoard.iMonth = parseInt(month);
                moreInfoBoard.iWeek = null;
                moreInfoBoard.list = list;
            }
            if(date != null){
                //選擇日
                moreInfoBoard.iDate = parseInt(date);
                moreInfoBoard.iWeek = null;
                moreInfoBoard.list = list;
            }
            else{
                moreInfoBoard.iWeek = this.state.weekNum;
                moreInfoBoard.iDate = 0;
                moreInfoBoard.list = list;
            }
            
            console.log(moreInfoBoard);
            return{
                ifShowMore:!ifShowMore,
                note : oldTitle,
                moreInfoBoard: moreInfoBoard,
                calenIfShow:false
            }
        })
    }
    autoHeight(){
        let x = document.getElementById("testHeight");
        x.style.height = 'auto';
        x.style.height = x.scrollHeight + "px";
    }
    showMoreInfo(){
        let selectList = this.props.listItems.map((list,index)=><option value={list.title} data-list={list.title} key={index}>{list.title}</option>)
        let showScheTime1 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}</span>
        let showScheTime2 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-week{this.state.moreInfoBoard.iWeek}</span>
        let showScheTime3 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}-{this.state.moreInfoBoard.iDate}</span>
        let {iMonth, iDate, iWeek, list} = this.state.moreInfoBoard;
        return(
            <div id="moreInfo" className="bt_moreInfo_board" data-enter={'info'} onKeyDown={this.enterClick}>
                <div className="infoflex">
                    <div className="info1">
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="15" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle} autoFocus></textarea>
                    </div>
                    <div className="info popUp" onClick={this.showCalen}>
                        <div className="infoLi popUp">
                            <i className="fas fa-calendar popUp"></i>
                            <span className="addList popUp">Change Time</span>
                        </div>
                        <div className="infoLi2 popUp" >
                            {iDate==0 && iWeek==null && iMonth>=0? showScheTime1:''}
                            {iWeek!=null && iWeek!=0 && iDate==0? showScheTime2:''}
                            {((iWeek==0 || iWeek==undefined) && iDate>0)? showScheTime3:''}
                        </div>
                    </div>
                    <div className="info">
                        <div className="infoLi">
                            <i className="fas fa-list-ul"></i>
                            
                            <span className="addList">{this.state.moreInfoBoard.list==null?'Add To List':list}</span>
                        </div>
                        <div className="infoLi2">
                            <select className="selectList" onChange={this.chooseList}>
                                <option value="">Choose List</option>
                                {selectList}
                                <option value={null}>尚未選擇</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="infoBtns">
                    <span className="infoCancelBtn" onClick={this.toggleIfShowMore}>Cancel</span>
                    <span className="infoSaveBtn" id="saveMoreInfo" onClick={this.adjustTodo}>Save</span>
                </div>
            </div>
        )
    }

    adjustTodo(){
        let oldTitle = this.state.moreInfoBoard.oldTitle;
        let note;
        let createAdjustObj = () =>{
            return {
                title:this.state.note,
                month:this.state.moreInfoBoard.iMonth,
                year:this.state.moreInfoBoard.iYear,
                date:this.state.moreInfoBoard.iDate,
                week:this.state.moreInfoBoard.iWeek,
                list: this.state.moreInfoBoard.list
            }
        }
        let createAdjustObjWithoutDate = () =>{
            return {
                title:this.state.note,
                month:this.state.moreInfoBoard.iMonth,
                year:this.state.moreInfoBoard.iYear,
                week:this.state.moreInfoBoard.iWeek,
                list: this.state.moreInfoBoard.list
            }
        }
        if (this.state.moreInfoBoard.innerIndex == null){
            console.log('adjust week to do');
            this.setState(preState=>{
                note = preState.note;
                let {moreInfoBoard, thisWeekToDos, ifShowMore} = preState;
                thisWeekToDos[moreInfoBoard.index].title = note;
                return{
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            let ref = db.collection("members").doc(this.props.uid).collection("todos");
            ref.where("year","==",this.state.year).where("week","==",this.state.weekNum).where("title","==",oldTitle)
                .get().then(querySnapshot=>{
                    querySnapshot.forEach(doc=>{
                        if(this.state.moreInfoBoard.iDate!=null){
                            console.log('111');
                            doc.ref.update(
                                createAdjustObj()
                            ).then(()=>{
                                this.props.reRenderLog();
                            })
                        }else{
                            console.log('222');
                            doc.ref.update(
                                createAdjustObjWithoutDate()
                            )
                        }
                        
                    })
                });
        }else{
            console.log('adjust day to do');
            this.setState(preState=>{
                let {note, moreInfoBoard, eachDayToDos, ifShowMore} = preState;
                eachDayToDos[moreInfoBoard.index].todos[moreInfoBoard.innerIndex].title = note;
                return{
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            let ref = db.collection("members").doc(this.props.uid).collection("todos").doc(this.state.moreInfoBoard.id);
            if(this.state.moreInfoBoard.iDate!=null){
                ref.update(
                    createAdjustObj()
                ).then(()=>{
                    console.log('111');
                    this.props.reRenderLog();
                });
            }else{
                console.log('222');
                ref.update(
                    createAdjustObjWithoutDate()
                ).then(()=>{
                    this.props.reRenderLog();
                    this.setWeekNum();
                    this.updateEachDayToDosOfWeek();
                });
            }
        }
        
    }

    deleteInDB(bt){
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let id = bt.currentTarget.getAttribute("data-id");  
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("week","==",this.state.weekNum).where("year","==",this.state.year).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.update({isDone:true}).then(()=>{
                        this.props.reRenderLog();
                    })
                })
            });
        this.setState(preState=>{
            let thisWeekToDos = preState.thisWeekToDos;
            thisWeekToDos.splice(deleteIndex,1);
            return{
                thisWeekToDos:thisWeekToDos
            }
        });
    }

    deleteEachDay(bt){
        let outerIndex = bt.currentTarget.getAttribute("data-outer-index");
        let innerIndex = bt.currentTarget.getAttribute("data-inner-index");
        let id = bt.currentTarget.getAttribute("data-id");
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.doc(id).update({isDone:true}).then(()=>{
            this.props.reRenderLog();
            this.setState(preState=>{
                let eachDayToDos = preState.eachDayToDos;
                // 刪除state array內某天某件事
                eachDayToDos[outerIndex].todos.splice(innerIndex,1);
                return{
                    eachDayToDos:eachDayToDos
                }
            });
        })
    }
    
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
    }
    
    addThisWeekToDos(){
        if(handleValidation(this.state.note)==true){
            this.setState(preState=>{
                let {year, weekNum, thisWeekToDos, ifInput} = preState;
                let thing = preState.note;
                thisWeekToDos.push({"title": thing, "index": thisWeekToDos.length, "iDone": false});
                this.addToDB(thing, year, 0, 0, weekNum);
                return{
                    thisWeekToDos:thisWeekToDos,
                    note:"",
                    ifInput:!ifInput
                };
            });
        }else{
            alert("Please Input Task")
            return;
        }
    }

    addToDB(title,year,month,date,week){
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
        }).then(()=>{
            console.log('addToDB');
            this.props.reRenderLog();
        });
        
    }

    getDBdataInState(week,year,date,day,month){
        // let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisWeekToDos = [];
        let createDBObj = (doc) =>{
            return {
                title: doc.data().title,
                ifDone: doc.data().isDone,
                id: doc.id,
                list: doc.data().list
            }
        }
        if (date == 0){
            ref.where('week','==',week).where('year','==',year).where('date','==',date).where('isDone','==',false)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        thisWeekToDos.push(createDBObj(doc));
                    });
                    this.setState({
                        thisWeekToDos:thisWeekToDos
                    });
                });
        }else{
            ref.where('month','==',month).where('year','==',year).where('date','==',date).where("isDone","==",false)
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        this.setState(preState=>{
                            let {eachDayToDos} = preState;
                            eachDayToDos[day].todos = [];
                            eachDayToDos[day].todos.push(createDBObj(doc));
                            return{
                                eachDayToDos: eachDayToDos
                            }
                        });
                    });
                })
        }
    }


    setWeekNum(){
        this.setState(preState=>{
            let {year, month, date} = preState;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            // 將該週未安排事件放入state
            return {weekNum:countWeekNum(new Date(`${year}-${month}-${date}`))}
        }, ()=>{
            let {year, month, date} = this.state;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            this.getDBdataInState(countWeekNum(new Date(`${year}-${month}-${date}`)),year,0);
        })
    }

    addThisDayToDos(day){
        if(handleValidation(this.state.note)==true){
            let indexDay = day.currentTarget.getAttribute("data-addday");
            this.setState(preState=>{
                let thing = preState.note;
                let {year, eachDayToDos} = preState;
                let weekNum = 0;
                eachDayToDos[indexDay].todos.push({title:thing,ifDone:false});
                eachDayToDos[indexDay].ifInput = false;
                // 因為已經將月份日期存入eachDayToDos[]陣列裡，可以透過點擊index取出月份日期，再存入DB
                this.addToDB(thing,year,eachDayToDos[indexDay].month,eachDayToDos[indexDay].date,weekNum);
                return{
                    eachDayToDos:eachDayToDos,
                    note:""
                }
            });
        }else{
            alert("Please Input Task")
            return;
        }
    }


    updateEachDayToDosOfWeek(){
        //取得該週第一天的月份日期
        //根據今日算出這一週的第一天是幾月幾號
        //setState 將月/日/空todo存入陣列 生成週曆
        this.setState(preState=>{
            let {year, month, date} = preState;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            let eachDayToDos = [];
            for (let i=0; i<7; i++){
                let curr = new Date(`${year}-${month}-${date}`);
                let first = curr.getDate() - curr.getDay()+1;
                let firstday = new Date(curr.setDate(first));
                firstday.setDate(firstday.getDate()+i);
                eachDayToDos.push({
                    month:firstday.getMonth(),
                    date:firstday.getDate(),
                    day:i+1,
                    todos:[],
                    ifInput:false
                });
            }
            return{eachDayToDos:eachDayToDos}
        }, ()=>{
            let {year, month, date, weekNum} = this.state;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            for (let i=0; i<7; i++){
                let curr = new Date(`${year}-${month}-${date}`);
                let first = curr.getDate() - curr.getDay()+1;
                let firstday = new Date(curr.setDate(first));
                firstday.setDate(firstday.getDate()+i);
                this.getDBdataInState(weekNum,year,firstday.getDate(),i,firstday.getMonth());
            }
        });    
    }

    toggleEachDayIfInput(eachday){
        // 取得要新增事件的那一天綁定在onClick上
        // console.log(eachday.currentTarget.getAttribute("data-addindex"));
        let index = eachday.currentTarget.getAttribute("data-addindex");
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            eachDayToDos.map((eachday)=>{eachday.ifInput = false});
            eachDayToDos[index].ifInput = true;
            return {
                eachDayToDos: eachDayToDos,
                ifInput: false
            }
        });
        
    }

    toggleIfInput(){
        this.setState(preState=>{
            return{
                ifInput: !preState.ifInput
            }
        });
        this.turnOffEachDayIfInput();
    }

    showInput(){
        return(
            <div className="month_todo" data-enter={'week'} onKeyDown={this.enterClick}>
                <span>
                    <input className="noScheInput" type="text" placeholder="+ ADD WEEK TASK" onChange={this.handleNoteChange} autoFocus/>
                </span>
                <span className="month_todo_feacture2">
                    <span className="cancel" onClick={this.toggleIfInput}>Cancel</span>
                    <span className="add" id="inputWeek" onClick={this.addThisWeekToDos}>Add</span>
                </span>
            </div>
        )
    }

    showEachDayInput(i){
        return(
            <div className="month_todo" data-enter={'week-day'} onKeyDown={this.enterClick}>
                <span>
                    <input className="noScheInput" className="noScheInput" placeholder="ADD TASK" type="text" onChange={this.handleNoteChange} autoFocus/>
                </span>
                <span className="month_todo_feacture2">
                    <span className="cancel" onClick={this.turnOffEachDayIfInput}>Cancel</span>
                    <span className="add" id="inputWeekDay" data-addday={i} onClick={this.addThisDayToDos}>Add</span>
                </span>
            </div>
        )
    }
    turnOffEachDayIfInput(){
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            eachDayToDos.map((eachday)=>{eachday.ifInput = false});
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
        document.addEventListener('click', this.handleClickOutside, false);
    }

    handleWeekForward(){
        this.setState(preState=>{
            let {year, month, date} = preState;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            let newdate = new Date(`${year}-${month}-${date}`);
            newdate = newdate.setDate(newdate.getDate()+7);
            newdate = new Date(newdate);
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate(),
                eachDayToDos:[] //清空
            }
        }, ()=>{
            this.setWeekNum();
            this.updateEachDayToDosOfWeek();
        });
    }
    handleWeekBackward(){
        this.setState(preState=>{
            let {year, month, date} = preState;
            if(month<10){
                month="0"+(month+1);
            }
            if(date<10){
                date="0"+date;
            }
            let newdate = new Date(`${year}-${month}-${date}`);
            newdate = newdate.setDate(newdate.getDate()-7);
            newdate = new Date(newdate);
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate(),
                eachDayToDos:[] //清空
            }
        }, ()=>{
            this.setWeekNum();
            this.updateEachDayToDosOfWeek();
        });
    }


    componentDidUpdate(preProps){
        // 避免程式不斷更新，使用preProps
        // 原本沒有使用時，props.state更新後就進到 componentDidupdate
        // 然後因為在 componentDidupdate 裡使用 getDBdataInState，state狀態改變後又進入componentDidupdate
        // 因此程式會一直循環印出console.log("Day Update")，database會爆掉
        // console.log(preProps);
        
        if(preProps.reRender !== this.props.reRender){
            // this.updateEachDayToDosOfWeek();
            console.log("Week Update1");
            this.setWeekNum();
            this.updateEachDayToDosOfWeek();
        }
        if(preProps.btToday !== this.props.btToday){
            console.log("Week Update2");
            this.backToTodayBtn();
        }
    }
    
    enterClick(e){
        let btntype = e.currentTarget.getAttribute("data-enter");
        if (event.keyCode==13 && btntype=='week-day'){
            document.getElementById("inputWeekDay").click(); //觸動按鈕的點擊
        } 
        if (event.keyCode==13 && btntype=='week'){
            document.getElementById("inputWeek").click(); //觸動按鈕的點擊
        }
        if (event.keyCode==13 && btntype=='info'){
            document.getElementById("saveMoreInfo").click(); //觸動按鈕的點擊
        }  
    }
    render(){
        let { weekNum, thisWeekToDos,eachDayToDos, theme, ifInput } = this.state;
        let data = {
            state: {weekNum, thisWeekToDos,eachDayToDos, theme, ifInput},
            method: {
                ifChangeWeek: this.ifChangeWeek,
                handleWeekBackward: this.handleWeekBackward,
                handleWeekForward: this.handleWeekForward,
                toggleIfInput: this.toggleIfInput,
                toggleIfShowMore: this.toggleIfShowMore,
                deleteInDB: this.deleteInDB,
                showInput: this.showInput,
                toggleEachDayIfInput: this.toggleEachDayIfInput,
                deleteEachDay: this.deleteEachDay,
                showEachDayInput: this.showEachDayInput
            }
        }
        
        return <div id="week" className={`left_board left_board_${theme}`}>
            {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)} year={this.state.year} month={this.state.month} date={this.state.date}/>:''}
            {this.state.ifChangeWeek?<ChangeWeekCal changeWeek={this.changeWeek.bind(this)} weekNum={this.state.weekNum}/>:''}
            
            <LogTitle data={data}/>
            <ThisWeekToDos data={data}/>
            <EachDayToDos data={data}/>
            <div className="wbgc"></div>
            {/* 單一事件控制面板 */}
            {this.state.ifShowMore? this.showMoreInfo(): ''}
        </div>;
    }
}


export default RenderWeekLog;