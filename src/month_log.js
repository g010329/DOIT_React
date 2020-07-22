import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
import Calendar from "./calendar";
import ChangeMonthCal from "./changeMonthCal";
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
                // {"title":'add somthing todo',"index":1,"ifDone":false,"content":''}
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
            reRender: false,
            ifInput: false,
            ifShowMore: false,
            note:"",
            moreInfoBoard:{
                id:'',
                oldTitle: '',
                newTitle: '',
                index: 0,
                innerIndex: null,
                content: null,
                iYear:null,
                iMonth:null,
                iDate:null
            },
            calenIfShow:false,
            ifChangeMonth:false
            
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
        // moreinfo-adjust
        this.autoHeight = this.autoHeight.bind(this);
        this.showMoreInfo = this.showMoreInfo.bind(this);
        this.toggleIfShowMore = this.toggleIfShowMore.bind(this);
        this.adjustTodo = this.adjustTodo.bind(this);
        // moreinfo-content
        // this.handleContent = this.handleContent.bind(this);
        //ifDone
        this.ifDone = this.ifDone.bind(this);
        //calen
        this.showCalen = this.showCalen.bind(this);
        //下層的calen Component取得新時間後傳回上層
        this.calenUpdateTime = this.calenUpdateTime.bind(this);
        this.adjustTimeInDB = this.adjustTimeInDB.bind(this);
        this.countWeekNum = this.countWeekNum.bind(this);
        this.ifChangeMonth = this.ifChangeMonth.bind(this);
        //today
        this.backToTodayBtn = this.backToTodayBtn.bind(this);
    }
    changeMonth(year,month){
        // console.log(year,month);
        this.setState(preState=>{
            let daysOfMonth = preState.daysOfMonth;
            let eachDayToDos = preState.eachDayToDos;
            console.log(year,month);
            eachDayToDos=[];
            for (let i=0; i<new Date(year,month+1,0).getDate(); i++){
                eachDayToDos.push({
                    date:i,
                    day:new Date(`${year}-${month+1}-${i+1}`).getDay(),
                    todos:[],
                    ifInput: false,
                    
                });
                this.getDBdataInState(month,year,0);
            }
            return{
                year:year,
                month:month,
                daysOfMonth:new Date(year,month+1,0).getDate(),
                eachDayToDos:eachDayToDos,
                ifChangeMonth:false
                
            }
        });
        
    }
    ifChangeMonth(){
        this.setState(preState=>{
            let ifChangeMonth = !preState.ifChangeMonth;
            console.log('更換月')
            return{
                ifChangeMonth: ifChangeMonth
            }
        })
    }
    calenUpdateTime(year,month,date,week){
        console.log('calenUpdateTime',year,month,date,week);
        if(date<1){
            return;
        }
        if(date>new Date(year,month+1,0).getDate() && date!==999){
            return;
        }else{
            console.log('123');
            this.setState(preState=>{
                let moreInfoBoard = preState.moreInfoBoard;
                moreInfoBoard.iYear = year;
                moreInfoBoard.iMonth = month;
                moreInfoBoard.iDate = date;
                console.log(week,'999 表示點選的是週曆'); 
                if(week==999){
                    week = this.countWeekNum(new Date(`${year}-${month+1}-${date}`));
                    console.log('換算後的週數',week)
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = week;
                }
                if(date==999){
                    console.log('表示在選擇月份')
                    moreInfoBoard.iDate = 0;
                    moreInfoBoard.iWeek = null
                }
                // moreInfoBoard.iWeek = week;
                console.log('calenUpdateTime',moreInfoBoard);
                return{
                    moreInfoBoard:moreInfoBoard,
                    calenIfShow:false
                } 
            })
        }
        
    }
    countWeekNum(d){
        //算出今日是第幾週 d=new Date("2020-05-02")
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    }
    adjustTodo(){
        console.log('');
        let oldTitle = this.state.moreInfoBoard.oldTitle;
        let note;
        // 該月
        if (this.state.moreInfoBoard.innerIndex == null){
            console.log('修改月未安排',this.state.moreInfoBoard);
            this.setState(preState=>{
                note = preState.note;
                let moreInfoBoard = preState.moreInfoBoard;
                let thisMonthToDos = preState.thisMonthToDos;
                let eachDayToDos = preState.eachDayToDos;
                let ifShowMore = preState.ifShowMore;
                thisMonthToDos[moreInfoBoard.index].title = note;
                console.log('adjust month to do');
                console.log(eachDayToDos);
                // console.log(moreInfoBoard.iMonth,this.state.month);
                // console.log(moreInfoBoard);
                return{
                    thisMonthToDos:thisMonthToDos,
                    ifShowMore:!ifShowMore,
                    calenIfShow:false,
                    eachDayToDos:eachDayToDos
                }
            });
            // console.log('ha',this.state.note,this.state.year,this.state.month,oldTitle);
            console.log(this.state.moreInfoBoard.id);
            // console.log(this.state.moreInfoBoard.iYear,this.state.moreInfoBoard.iMonth,this.state.moreInfoBoard.iDate,this.state.moreInfoBoard.iWeek)
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos");
            //沒改過時間的
            if (this.state.moreInfoBoard.iDate==null){
                console.log('沒改時間');
                
                ref.doc(this.state.moreInfoBoard.id).update({title:this.state.note})
                    .then(()=>{
                        this.getDBdataInState(this.state.month,this.state.year,0);
                        this.props.reRenderLog();
                    })
                
            }else{
                //改過時間的
                // ref.where("year","==",this.state.year).where("month","==",this.state.month).where("title","==",oldTitle)
                // .get().then(querySnapshot=>{
                //     querySnapshot.forEach(doc=>{
                //         doc.ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek})
                //     })
                // });
                console.log('改過時間','m',this.state.moreInfoBoard.iMonth,'year',this.state.moreInfoBoard.iYear,'date',this.state.moreInfoBoard.iDate,'week',this.state.moreInfoBoard.iWeek);
                ref.doc(this.state.moreInfoBoard.id).update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek});
            }
            
            // ref.where("id","==",this.state.moreInfoBoard.id)
            //     .get().then(querySnapshot=>{
            //         querySnapshot.forEach(doc=>{
            //             doc.ref.update({title:'this.state.note',month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek})
            //         })
            //     });
            alert('確認修改?');
            this.props.reRenderLog();
        }else{ //該月每天
            // console.log('adjust day to do');
            this.setState(preState=>{
                note = preState.note;
                let moreInfoBoard = preState.moreInfoBoard;
                let eachDayToDos = preState.eachDayToDos;
                let ifShowMore = preState.ifShowMore;
                eachDayToDos[moreInfoBoard.index].todos[moreInfoBoard.innerIndex].title = note;
                console.log('adjust month-day to do');
                if(moreInfoBoard.iMonth!=this.state.month){
                    eachDayToDos[moreInfoBoard.index].todos.splice(moreInfoBoard.index,1);
                }
                return{
                    eachDayToDos: eachDayToDos,
                    ifShowMore:!ifShowMore,
                    calenIfShow:false
                }
            });
            console.log('ha',this.state.note,this.state.year,this.state.month,oldTitle);
            console.log(this.state.moreInfoBoard.iYear,this.state.moreInfoBoard.iMonth,this.state.moreInfoBoard.iDate,this.state.moreInfoBoard.iWeek)
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos");
            ref.where("year","==",this.state.year).where("month","==",this.state.month).where("date","==",parseInt(this.state.moreInfoBoard.index)+1).where("title","==",this.state.moreInfoBoard.oldTitle)
                .get().then(querySnapshot=>{
                    querySnapshot.forEach(doc=>{
                        doc.ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate})
                            .then(()=>{this.props.reRenderLog();})
                    })
                })
        }
    }
    toggleIfShowMore(e){
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let index = e.currentTarget.getAttribute("data-index");
        let innerIndex = e.currentTarget.getAttribute("data-innerindex");
        let id = e.currentTarget.getAttribute("data-id");
        
        this.setState(preState=>{
            let ifShowMore = preState.ifShowMore;
            let moreInfoBoard = preState.moreInfoBoard;
            moreInfoBoard.oldTitle = oldTitle;
            moreInfoBoard.index = index;
            moreInfoBoard.innerIndex = innerIndex;
            moreInfoBoard.id = id;
            moreInfoBoard.iYear = this.state.year;
            moreInfoBoard.iMonth = this.state.month;
            console.log('toggleIfShowMore','index:',index,'inner:',innerIndex,moreInfoBoard);
            if(innerIndex==null){
                //月
                moreInfoBoard.iDate = 0;
                moreInfoBoard.iWeek = null;
            }
            if (innerIndex!=null){
                //月-日
                console.log('m')
                moreInfoBoard.iDate = parseInt(index)+1;
                moreInfoBoard.iWeek = null;
            }
            
            moreInfoBoard.calenType = 'month';
            
            return{
                ifShowMore: !ifShowMore,
                note : oldTitle,
                moreInfoBoard: moreInfoBoard,
                calenIfShow: false
            }
        })
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

    adjustTimeInDB(){
        let id = this.state.moreInfoBoard.id;
        console.log('adjustTimeInDB',this.state.moreInfoBoard.id,this.state.moreInfoBoard.iYear,this.state.moreInfoBoard.iMonth,this.state.moreInfoBoard.iDate);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("id","==",id)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    console.log('adjustTimeInDB');
                    console.log(doc.data());
                })
            })
    }

    showMoreInfo(){
        // console.log('showMoreInfo',this.state.moreInfoBoard);
        let showScheTime1 = <span>{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}</span>
        let showScheTime2 = <span>{this.state.moreInfoBoard.iYear}-week{this.state.moreInfoBoard.iWeek}</span>
        let showScheTime3 = <span>{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}-{this.state.moreInfoBoard.iDate}</span>
        let iWeek = this.state.moreInfoBoard.iWeek;
        let iDate = this.state.moreInfoBoard.iDate;
        let iMonth = this.state.moreInfoBoard.iMonth;
        
        return(
            <div id="moreInfo" className="bt_moreInfo_board" data-enter={'info'} onKeyDown={this.enterClick}>
                <div className="infoflex">
                    <div className="info1">
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="25" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle} autoFocus></textarea>
                        {/* <textarea  className="info_contentInput" onChange={this.handleContent} cols="50" rows="3" placeholder="Write here"></textarea> */}
                    </div>
                    <div className="info2">
                        {/* <div className="info"><i className="fas fa-check-square"></i>
                            <span>task</span></div> */}
                        <div className="info" onClick={this.showCalen}><i className="fas fa-calendar" ></i>
                            {iDate==0&&iWeek==null&&iMonth>=0? showScheTime1:''}
                            {iWeek!=null && this.state.moreInfoBoard.iWeek!=0 && this.state.moreInfoBoard.iDate==0? showScheTime2:''}
                            {((iWeek==0 || this.state.moreInfoBoard.iWeek==undefined) && this.state.moreInfoBoard.iDate>0)? showScheTime3:''}
                        </div>
                        {/* <div className="info"><i className="fas fa-list-ul"></i>
                            <span>add to list</span></div> */}
                    </div>
                </div>
                <div>
                    <span onClick={this.toggleIfShowMore}>cancel</span>
                    <span id="saveMoreInfo" onClick={this.adjustTodo}>save</span>
                    <i className="fas fa-trash-alt"></i>
                </div>
            </div>
        )
    }
    
    addThisDayToDos(day){
        let indexDay = day.currentTarget.getAttribute("data-addday");
        // console.log(day.currentTarget.getAttribute("data-addday"));
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = parseInt(indexDay)+1;
            let thing = preState.note;
            let eachDayToDos = preState.eachDayToDos;
            eachDayToDos[indexDay].todos.push({title:thing});
            eachDayToDos[indexDay].ifInput = false;
            this.addToDB(thing, year, month, date, 0);
            this.props.reRenderLog();
            return{
                eachDayToDos:eachDayToDos,
                note:""
            }
        });
    }

    ifDone(e){
        // console.log(this.state.month);
        let index=e.currentTarget.getAttribute("data-index");
        let title=e.currentTarget.getAttribute("data-title");
        let newStatus;
        this.setState(preState=>{
            let thisMonthToDos = preState.thisMonthToDos;
            newStatus = !thisMonthToDos[index].ifDone;
            thisMonthToDos[index].ifDone = newStatus;
        });
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",this.state.month).where("year","==",this.state.year).where("date","==",0).where("title","==",title)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    console.log(doc.id);
                    doc.ref.update({isDone:newStatus})
                })
            })
    }

    toggleEachDateIfInput(eachday){
        // 取得要新增事件的那一天index綁定在onClick上
        // console.log(eachday.currentTarget.getAttribute("data-addindex"));
        let index = eachday.currentTarget.getAttribute("data-addindex");
        this.setState(preState=>{
            let eachDayToDos = preState.eachDayToDos;
            let ifInput = preState.ifInput;
            eachDayToDos.map((eachday,index)=>{eachday.ifInput = false});
            eachDayToDos[index].ifInput = true;
            // console.log(eachDayToDos);
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
            content: '',
            isDone: false,
            overdue: false           
        })
        .then(()=>{
            this.getDBdataInState(this.state.month,this.state.year,0);
        });
        // console.log('add');
    }

    getDBdataInState(month,year,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        
        let thisMonthToDos = [];
        
        if(date == 0){
            ref.where('month','==',month).where('year','==',year).where('date','==',date).where('isDone','==',false)
                .get().then(querySnapshot => {
                // .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc=>{
                        thisMonthToDos.push({
                            title: doc.data().title,
                            ifDone: doc.data().isDone,
                            id: doc.id
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
                            eachDayToDos[doc.data().date-1].todos.push({title:doc.data().title,id:doc.id});
                            return{
                                eachDayToDos: eachDayToDos
                            }
                        });
                        // console.log(doc.data());
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
            this.props.reRenderLog();
            return{
                thisMonthToDos:thisMonthToDos,
                note:"",
                ifInput:!ifInput
            };
            
        });
    }
    deleteInDB(bt){
        
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",this.state.month).where("year","==",this.state.year).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.delete().then(()=>{
                        this.props.reRenderLog();
                    });
                })
            });

        this.setState(preState=>{
            let thisMonthToDos = preState.thisMonthToDos;
            thisMonthToDos.splice(deleteIndex,1);
            return{
                thisMonthToDos:thisMonthToDos
            }
        });
        
    }
    
    
    updateEachDayToDos(){
        this.setState(preState=>{
            let {year} = preState;
            let {month} = preState;
            let daysOfMonth = preState.daysOfMonth;
            let eachDayToDos = preState.eachDayToDos;
            // 畫面會有瞬間清空bug
            eachDayToDos =[];
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
        <div className="month_todo addmd" data-enter={'month-date'} onKeyDown={this.enterClick}>
            <span>
                <input  className="addmd_input" placeholder="ADD TASK" type="text" onChange={this.handleNoteChange} autoFocus/>
            </span>
            <span className="month_todo_feacture">
                <span onClick={this.turnOffEachDayIfInput}>cancel</span>
                <span id="inputMonthDate" data-addday={i} onClick={this.addThisDayToDos} >add</span>
            </span>
        </div>
        )
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
        this.updateEachDayToDos();
        this.getDBdataInState(new Date().getMonth(),new Date().getFullYear(),0);
        this.getDBdataInState(new Date().getMonth(),new Date().getFullYear(),new Date().getDate());
    }

    handleMonthForward(){
        this.setState(preState=>{
            let {year} = this.state;
            let {month} = this.state;
            let {eachDayToDos} = this.state;
            if(month<11){
                this.getDBdataInState(this.state.month+1,this.state.year,0);
                // console.log(year,month+1);
                // console.log(year,month+2,new Date(year,month+2,0).getDate());
                return{
                    month: month+1,
                    daysOfMonth: new Date(year,month+2,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }else{
                // console.log('123')
                this.getDBdataInState(0,this.state.year+1,0);
                // console.log(year+1,0);
                // console.log(year+1,1,new Date(year+1,1,0).getDate());
                return{
                    year: year+1,
                    month: 0,
                    daysOfMonth: new Date(year+1,1,0).getDate(),
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
                console.log(year-1,11);
                console.log(year-1,12,new Date(year-1,12,0).getDate());
                return{
                    year: year-1,
                    month: 11,
                    daysOfMonth: new Date(year-1,12,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }else{
                this.getDBdataInState(this.state.month-1,this.state.year,0);
                console.log(year,month-1);
                console.log(year,month,new Date(year,month,0).getDate());
                return{
                    month: month-1,
                    daysOfMonth: new Date(year,month,0).getDate(),
                    eachDayToDos:[] //清空
                }
            }
            
        });
        this.updateEachDayToDos();
    }
    componentDidUpdate(preProps){
        if(preProps.reRender !== this.props.reRender){
            console.log("Month Update");
            this.updateEachDayToDos();
            this.getDBdataInState(this.state.month,this.state.year,0);
        }
        if(preProps.btToday !== this.props.btToday){
            this.backToTodayBtn();
            console.log("Month Update2");
        }
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
        console.log('note: '+e.currentTarget.value);
    }
    showInput(){
        return(
        <div className="month_todo" data-enter={'month'} onKeyDown={this.enterClick}>
            <span>
                <input className="noScheInput"  type="text" placeholder="+ ADD MONTH TASK" onChange={this.handleNoteChange} autoFocus/>
            </span>
            <span className="month_todo_feacture">
                <span onClick={this.toggleIfInput}>cancel</span>
                <span id="inputMonth" onClick={this.addThisMonthToDos}>add</span>
            </span>
        </div>
        )
    }
    
    

    autoHeight(){
        let x = document.getElementById("testHeight");
        x.style.height = 'auto';
        x.style.height = x.scrollHeight + "px";
    }
    enterClick(e){
        let btntype = e.currentTarget.getAttribute("data-enter");
        if (event.keyCode==13 && btntype=='month-date'){
            document.getElementById("inputMonthDate").click(); //觸動按鈕的點擊
        } 
        if (event.keyCode==13 && btntype=='month'){
            document.getElementById("inputMonth").click(); //觸動按鈕的點擊
        } 
        if (event.keyCode==13 && btntype=='info'){
            document.getElementById("saveMoreInfo").click(); //觸動按鈕的點擊
        } 
    }
    render(){
        // console.log(`${this.state.year}/${this.state.month}`);
        // console.log(this.state.eachDayToDos);
        let eachMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let eachDay = ["S","M","T","W","T","F","S"];
        // render 該月事項
        let renderThisMonthTodos = this.state.thisMonthToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
            <span><input className="checkbox" type="checkbox" data-index={index} data-title={todo.title} onChange={this.ifDone}></input>{todo.title}</span>
            <span className="month_todo_feacture">
                {/* <span><i className="fas fa-angle-double-right" ></i></span> */}
                <span ><i className="fas fa-pen" data-id={todo.id} data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                <span><i className="fas fa-trash" data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
            </span>
        </div>);
        // render 每日事項
        let renderEachDayTodos = this.state.eachDayToDos.map((eachday,index)=>
            <div key={index}>
            {/* 每日事項input */}
                <div className="month_day" >
                {/* 每日新增事件 */}
                
                <div className="month_day_a">
                    <span className="m_date" >{eachday.date+1}</span>
                    <span className="m_day_of_week" >{eachDay[eachday.day]}</span>
                    <span className="m_add_bt"  data-addindex={index} onClick={this.toggleEachDateIfInput}>+</span>
                </div>
                <div className="month_day_b">
                    {eachday.todos.map((todo,innerIndex)=><span data-id={todo.id} data-title={todo.title} data-index={index} data-innerindex={innerIndex} onClick={this.toggleIfShowMore} className="m_bt" key={innerIndex}>{todo.title}</span>)}
                    <div>{eachday.ifInput? this.showEachDateInput(index) : ''}</div>
                </div>
            </div>
            </div>);
        let hint = <div className="hint">hint: 試試點擊右上+按鈕，新增此月待辦事項！</div>
                
        return <div id="month" className="left_board">
        {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)} year={this.state.year} month={this.state.month} date={this.state.date}/>:''}
        {this.state.ifChangeMonth?<ChangeMonthCal changeMonth={this.changeMonth.bind(this)}/>:''}
        {/* 月-標題 */}
        <div className="month_title">
            <span>
                <span className="title_month">{eachMonth[this.state.month] }</span>
                <span className="title_monthyear"> &nbsp; of {this.state.year}</span>
            </span>
            <span className="title_right">
                <span className="icon_hover_span"><i className="fas fa-calendar" onClick={this.ifChangeMonth}></i></span>
                <span className="icon_hover_span"><i className="fas fa-angle-left"  value="-" onClick={this.handleMonthBackward}></i></span>
                <span className="icon_hover_span"><i className="fas fa-angle-right" onClick={this.handleMonthForward}></i></span>
                <span className="icon_hover_span"><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
            </span>
        </div>
        
        {/* 月-未安排事項 */}
        <div className="month_todos">
            {this.state.ifInput? this.showInput() : ''}
            {renderThisMonthTodos==''?hint:''}
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
        {/* 單一事件控制面板 */}
        {this.state.ifShowMore? this.showMoreInfo(): ''}
    </div>;
    }
}



export default RenderMonthLog;