import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
import Calendar from "./calendar";
import ChangeWeekCal from "./changeWeekCal.js";
import {countWeekNum,handleValidation} from './util.js';
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
        //ifDone
        this.ifDone = this.ifDone.bind(this);
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
        // 點擊sidebar外部關閉sidebar
        // console.log(event.target.className);
        let cN = event.target.classList;
        if(cN.contains('popUp')){
            // console.log('dont clos div');
        }else{
            // console.log('outside');
            this.setState({
                ifChangeWeek:false,
                calenIfShow:false,
            })
        }
        
    }
    chooseList(e){
        let list = e.target.value;
        console.log(e.target.value);
        this.setState(preState=>{
            let moreInfoBoard = preState.moreInfoBoard;
            moreInfoBoard.list = list;
            return{
                moreInfoBoard: moreInfoBoard
            }
        })
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
        console.log(year,month,date,week);
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
            });
            this.getDBdataInState(countWeekNum(new Date(`${year}-${month+1}-${date}`)),year,0);
            this.updateEachDayToDosOfWeek();
        }
        
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
        if(date<1){
            return;
        }if(date>new Date(year,month+1,0).getDate() && date!==999){
            return;
        }else{
            this.setState(preState=>{
                let moreInfoBoard = preState.moreInfoBoard;
                moreInfoBoard.iYear = year;
                moreInfoBoard.iMonth = month;
                moreInfoBoard.iDate = date;
                moreInfoBoard.iWeek = null;
                console.log(week,'999 表示點選的是週曆'); 
                if(week==999){
                    week = countWeekNum(new Date(`${year}-${month+1}-${date}`));
                    console.log('換算後的週數',week)
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = week;
                }
                if(date==999){
                    console.log('表示在選擇月份')
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = null
                }
                
                console.log('calenUpdateTime',moreInfoBoard);
                return{
                    moreInfoBoard:moreInfoBoard,
                    calenIfShow:false
                } 
            })
        }
        
    }
    toggleIfShowMore(e){
        // console.log(e.currentTarget.getAttribute("data-index"));
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let id = e.currentTarget.getAttribute("data-id");
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-innerindex");
        let month = e.currentTarget.getAttribute("data-month");
        let date = e.currentTarget.getAttribute("data-date");
        let list = e.currentTarget.getAttribute("data-list");
        // console.log(month,date);
        // console.log('list',list);
        console.log('toggleIfShowMore',month);
        this.setState(preState=>{
            
            let ifShowMore = preState.ifShowMore;
            let moreInfoBoard = preState.moreInfoBoard;
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
                // moreInfoBoard.iMonth = parseInt(month);
                moreInfoBoard.iWeek = this.state.weekNum;
                moreInfoBoard.iDate = 0;
                moreInfoBoard.list = list;
            }
            // moreInfoBoard.iMonth = this.state.month;
            
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
        console.log(this.state.moreInfoBoard);
        let showScheTime1 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}</span>
        let showScheTime2 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-week{this.state.moreInfoBoard.iWeek}</span>
        let showScheTime3 = <span className="littleCal popUp">{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}-{this.state.moreInfoBoard.iDate}</span>
        let iWeek = this.state.moreInfoBoard.iWeek;
        let iDate = this.state.moreInfoBoard.iDate;
        let iMonth = this.state.moreInfoBoard.iMonth;
        let list = this.state.moreInfoBoard.list;
        return(
            <div id="moreInfo" className="bt_moreInfo_board" data-enter={'info'} onKeyDown={this.enterClick}>
                <div className="infoflex">
                    <div className="info1">
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="15" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle} autoFocus></textarea>
                        {/* <textarea  className="info_contentInput" cols="50" rows="3" placeholder="Write here"></textarea> */}
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
                    {/* <i className="fas fa-trash-alt"></i> */}
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
                    // thisWeekToDos:thisWeekToDos,
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
                            console.log('111');
                            doc.ref.update({
                                title:this.state.note,
                                month:this.state.moreInfoBoard.iMonth,
                                year:this.state.moreInfoBoard.iYear,
                                date:this.state.moreInfoBoard.iDate,
                                week:this.state.moreInfoBoard.iWeek,
                                list: this.state.moreInfoBoard.list
                            }).then(()=>{
                                this.props.reRenderLog();
                            })
                        }else{
                            console.log('222');
                            doc.ref.update({
                                title:this.state.note,
                                month:this.state.moreInfoBoard.iMonth,
                                year:this.state.moreInfoBoard.iYear,
                                week:this.state.moreInfoBoard.iWeek,
                                list: this.state.moreInfoBoard.list
                            })
                        }
                        
                    })
                });
            alert('確認修改?');
            // this.props.reRenderLog();
        }else{
            console.log('adjust day to do');
            this.setState(preState=>{
                note = preState.note;
                let moreInfoBoard = preState.moreInfoBoard;
                let eachDayToDos = preState.eachDayToDos;
                let ifShowMore = preState.ifShowMore;
                eachDayToDos[moreInfoBoard.index].todos[moreInfoBoard.innerIndex].title = note;
                
                // console.log(eachDayToDos);
                return{
                    // eachDayToDos:eachDayToDos,
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            console.log('ha',this.state.moreInfoBoard);
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos").doc(this.state.moreInfoBoard.id);
            if(this.state.moreInfoBoard.iDate!=null){
                console.log('1');
                ref.update({
                    title:this.state.note,
                    month:this.state.moreInfoBoard.iMonth,
                    year:this.state.moreInfoBoard.iYear,
                    date:this.state.moreInfoBoard.iDate,
                    week:this.state.moreInfoBoard.iWeek,
                    list: this.state.moreInfoBoard.list
                }).then(()=>{
                    this.props.reRenderLog();
                    this.setWeekNum();
                    this.updateEachDayToDosOfWeek();
                });
            }else{
                console.log('2');
                ref.update({
                    title:this.state.note,
                    month:this.state.moreInfoBoard.iMonth,
                    year:this.state.moreInfoBoard.iYear,
                    week:this.state.moreInfoBoard.iWeek,
                    list: this.state.moreInfoBoard.list
                }).then(()=>{
                    this.props.reRenderLog();
                    this.setWeekNum();
                    this.updateEachDayToDosOfWeek();
                });
            }
            console.log("note:",this.state.note);
            
        }
        
    }

    deleteInDB(bt){
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let id = bt.currentTarget.getAttribute("data-id");
        console.log('id',id);
        let db = firebase.firestore();    
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

    ifDone(e){
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-inner-index");
        let outerIndex = e.currentTarget.getAttribute("data-outer-index");
        let title = e.currentTarget.getAttribute("data-title");
        let month = parseInt(e.currentTarget.getAttribute("data-month"));
        let date = parseInt(e.currentTarget.getAttribute("data-date"));
        let week = parseInt(e.currentTarget.getAttribute("data-week"));
        console.log('ifDone',month);
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
        let id = bt.currentTarget.getAttribute("data-id");
        // console.log('刪除週日0',id,outerIndex,innerIndex);
        // console.log(outerIndex,innerIndex);
        console.log('deleteEachDay',targetMonth);
        let db = firebase.firestore();
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
                let thing = preState.note;
                let {year} = preState;
                let {month} = preState;
                let {weekNum} = preState;
                let thisWeekToDos = preState.thisWeekToDos;
                let ifInput = preState.ifInput;
                thisWeekToDos.push({"title":thing,"index":thisWeekToDos.length,"iDone":false});
                console.log('addThisWeekToDos');
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
        }).then(()=>{
            console.log('addToDB');
            this.props.reRenderLog();
        });
        
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
                            id: doc.id,
                            list: doc.data().list
                        });
                    });
                    this.setState({
                        thisWeekToDos:thisWeekToDos
                    });
                });
        }else{
            ref.where('month','==',month).where('year','==',year).where('date','==',date).where("isDone","==",false)
                .get().then(querySnapshot => {
                    // console.log(week,year,date);
                    querySnapshot.forEach(doc=>{
                        // console.log(day);
                        this.setState(preState=>{
                            let eachDayToDos = preState.eachDayToDos;
                            eachDayToDos[day].todos.push({
                                title:doc.data().title,
                                ifDone:false,id:doc.id,
                                list: doc.data().list
                            });
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
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            // 將該週未安排事件放入state
            this.getDBdataInState(countWeekNum(new Date(`${year}-${month+1}-${date}`)),this.state.year,0);
            return {weekNum:countWeekNum(new Date(`${year}-${month+1}-${date}`))}
        })
    }

    addThisDayToDos(day){
        if(handleValidation(this.state.note)==true){
            let indexDay = day.currentTarget.getAttribute("data-addday");
            // console.log(day.currentTarget.getAttribute("data-addday"));
            this.setState(preState=>{
                let thing = preState.note;
                let eachDayToDos = preState.eachDayToDos;
                let {year} = preState;
                let {month} = preState;
                let date = preState.date;
                // let weekNum = preState.weekNum;
                let weekNum = 0;
                let todayDay = new Date(`${year}-${month+1}-${date}`).getDay();
                eachDayToDos[indexDay].todos.push({title:thing,ifDone:false});
                eachDayToDos[indexDay].ifInput = false;
                // console.log(eachDayToDos[indexDay].month+1+' / '+eachDayToDos[indexDay].date);
                console.log('addThisDayToDos',thing,year,eachDayToDos[indexDay].month,eachDayToDos[indexDay].date,weekNum);
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
                eachDayToDos.push({
                    month:firstday.getMonth(),
                    date:firstday.getDate(),
                    day:i+1,
                    todos:[],
                    ifInput:false
                });
                this.getDBdataInState(weekNum,year,firstday.getDate(),i,firstday.getMonth());
                // console.log('updateEachDayToDosOfWeek',weekNum,year,firstday.getDate(),i,firstday.getMonth());
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
        document.addEventListener('click', this.handleClickOutside, false);
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
        let theme = this.state.theme;
        // 此週待辦
        let renderThisWeekTodos = this.state.thisWeekToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {/* <input className="checkbox" type="checkbox" data-week={this.state.weekNum} data-index={index} data-title={todo.title} onChange={this.ifDone}></input> */}
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf2_${theme}`}>
                    {/* <span><i className="fas fa-angle-double-right" ></i></span> */}
                    <span><i className="fas fa-pen" data-id={todo.id} data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                </span>
            </div>);
        let dayName = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        // 每日待辦
        let renderEachDayTodos = this.state.eachDayToDos.map((eachday,index)=>{
            // console.log(eachday.month,new Date().getMonth(),eachday.date,new Date().getDate())
            return <div className={eachday.month== new Date().getMonth()&&eachday.date==new Date().getDate()?"week_day week_day_today":"week_day weekday_dk"} key={index}>
                <div className="week_day_a">
                    <span className={`week_day_title week_day_title_${theme}`}>{eachday.month+1}月{eachday.date}日</span>
                    <span className={`week_day_title week_day_title_${theme}`}>{dayName[index]}</span>
                    <span className={`w_add_bt w_add_bt_${theme}`} data-addindex={index} data-month={eachday.month} data-date={eachday.date} onClick={this.toggleEachDayIfInput}>+</span>
                </div>
                {/* 每日新增todo */}
                {eachday.ifInput? this.showEachDayInput(index) : ''}

                {eachday.todos.map((todo,innerindex)=>
                    <div className="month_todo" key={innerindex}>
                        <span key={innerindex}>
                            {/* <input className="checkbox" type="checkbox" data-title={todo.title} data-inner-index={innerindex} data-outer-index={index} data-month={eachday.month} data-date={eachday.date} onChange={this.ifDone}></input> */}
                        {todo.title}</span>
                        <span className={`month_todo_feacture mf3_${theme}`}>
                            <span><i className="fas fa-pen" data-id={todo.id} data-title={todo.title} data-index={index} data-month={eachday.month} data-date={eachday.date} data-innerindex={innerindex} onClick={this.toggleIfShowMore} ></i></span>
                            <span><i className="fas fa-check" data-id={todo.id} data-inner-index={innerindex} data-outer-index={index} data-title={todo.title} onClick={this.deleteEachDay}></i></span>
                        </span>
                    </div>)}
                </div>});
        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此週待辦事項！</div>

        // console.log(this.state.eachDayToDos);
        return <div id="week" className={`left_board left_board_${theme}`}>
            {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)} year={this.state.year} month={this.state.month} date={this.state.date}/>:''}
            {this.state.ifChangeWeek?<ChangeWeekCal changeWeek={this.changeWeek.bind(this)} weekNum={this.state.weekNum}/>:''}
            <div className={`month_title month_title_${theme}`}>
                <span className="title_month">Week {this.state.weekNum}</span>
                <span className="title_right">
                    <span className={`icon_hover_span popUp icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={this.ifChangeWeek}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left" onClick={this.handleWeekBackward}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={this.handleWeekForward}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
                </span>
            </div>
            <div className="month_todos">
                {this.state.ifInput? this.showInput() : ''}
                {renderThisWeekTodos==''?hint:''}
                {/* <div>{renderAddThing}</div> */}
                {renderThisWeekTodos}
            </div>
            <div className="week_log">
                {renderEachDayTodos}               
            </div> 
            <div className="wbgc"></div>
            {/* 單一事件控制面板 */}
            {this.state.ifShowMore? this.showMoreInfo(): ''}
        </div>;
    }
}


export default RenderWeekLog;