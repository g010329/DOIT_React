import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
import Calendar from "./calendar";
import ChangeDateCal from "./changeDateCal";
import {countWeekNum,handleValidation} from './util.js';
class RenderDayLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            today:{y:new Date().getFullYear(),m:new Date().getMonth(),d:new Date().getDate()},
            year: new Date().getFullYear(), //2020
            month: new Date().getMonth(), //7
            date: new Date().getDate(), //3
            weekNum: null,
            thisDayToDos:[
                // {"title":1,"index":1,"ifDone":false},
                // {"title":2,"index":1,"ifDone":false}
            ],
            ifInput: false,
            ifShowMore: false,
            note:"",
            // errors: {},
            timer:0,
            moreInfoBoard:{
                oldTitle:'',
                index:null,
                newTitle:'',
                iYear:null,
                iMonth:null,
                iDate:null,
                list:null
            },
            overdue:[
                // {"id":'dn1k3ednklwjebd',"title":'zzz',"ifDone":false,"year":2020,"month":5,"date":15}
            ],
            calenIfShow:false,
            ifChangeDate:false,
            theme: this.props.theme
        }
        this.handleDateForward = this.handleDateForward.bind(this);
        this.handleDateBackward = this.handleDateBackward.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.toggleIfInput = this.toggleIfInput.bind(this);
        this.showInput = this.showInput.bind(this);
        this.addThisDayToDos = this.addThisDayToDos.bind(this);
        this.addThisDayToDos = this.addThisDayToDos.bind(this);
        // firebase
        this.addToDB = this.addToDB.bind(this);
        this.getDBdataInState = this.getDBdataInState.bind(this);
        this.deleteInDB = this.deleteInDB.bind(this);
        //ifDone
        this.ifDone = this.ifDone.bind(this);
        // adjust
        this.toggleIfShowMore = this.toggleIfShowMore.bind(this);
        this.showMoreInfo = this.showMoreInfo.bind(this);
        this.adjustTodo = this.adjustTodo.bind(this);
        // overdue
        this.getOverdueFromDB = this.getOverdueFromDB.bind(this);
        // today btn
        this.backToTodayBtn = this.backToTodayBtn.bind(this);
        // calen
        this.calenUpdateTime = this.calenUpdateTime.bind(this);
        this.showCalen = this.showCalen.bind(this);
        //date calen
        this.setWeekNum = this.setWeekNum.bind(this);
        this.ifChangeDate = this.ifChangeDate.bind(this);
        this.changeDate= this.changeDate.bind(this);
        //overdue done
        this.overdueIfDone = this.overdueIfDone.bind(this);
        //timer
        this.timer = this.timer.bind(this); 
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
            console.log('dont clos div');
        }else{
            console.log('outside');
            this.setState({
                calenIfShow:false,
                ifChangeDate:false
            })
        }
        
    }

    timer(e){
        this.setState({
            timer: e.currentTarget.value
        });
        console.log(this.state.timer);
    }

    setWeekNum(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            // 將該週未安排事件放入state
            return {weekNum:countWeekNum(new Date(`${year}-${month+1}-${date}`))}
        })
    }
    
    changeDate(year,month,date){
        console.log(year,month,date);
        if(date<1){
            return;
        }
        if(date>new Date(year,month+1,0).getDate()){
            return;
        }else{
            this.setState(preState=>{
                this.getDBdataInState(month,year,date);
                return{
                    year:year,
                    month:month,
                    date:date,
                    ifChangeDate:false
                }
            });
        }
    }
    ifChangeDate(){
        this.setState(preState=>{
            let ifChangeDate = !preState.ifChangeDate;
            console.log('更換日')
            return{
                ifChangeDate: ifChangeDate
            }
        })
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
        this.getDBdataInState(new Date().getMonth(),new Date().getFullYear(),new Date().getDate());
    }
    
    getOverdueFromDB(){
        // console.log('0getOverdueFromDB');
        let overdue =[];
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        //比較年
        ref.where("year","<",new Date().getFullYear()).where("isDone","==",false).orderBy("year","asc")
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // this.setState(preState)
                    // console.log('1getOverdueFromDB','id',doc.id);
                    overdue.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        year: doc.data().year,
                        month: doc.data().month,
                        date: doc.data().date,
                        week: null,
                        timer: doc.data().timer,
                        list: doc.data().list
                    });
                })
                this.setState({
                    overdue:overdue
                })
            })
        // 同年、月份較小
        ref.where("month","<",new Date().getMonth()).where("year","==",new Date().getFullYear()).where("isDone","==",false).where('week',"==",0)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // this.setState(preState)
                    // console.log('2getOverdueFromDB',doc.data());
                    overdue.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        year: doc.data().year,
                        month: doc.data().month,
                        date: doc.data().date,
                        week: null,
                        timer: doc.data().timer,
                        list: doc.data().list
                    });
                })
                this.setState({
                    overdue:overdue
                })
            })
            ref.where("month","<",new Date().getMonth()).where("year","==",new Date().getFullYear()).where("isDone","==",false).where('week',"==",null)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // this.setState(preState)
                    // console.log('2getOverdueFromDB',doc.data());
                    overdue.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        year: doc.data().year,
                        month: doc.data().month,
                        date: doc.data().date,
                        week: null,
                        timer: doc.data().timer,
                        list: doc.data().list
                    });
                })
                this.setState({
                    overdue:overdue
                })
            })
        // 同年、同月份、日期小
        ref.where("date","<",new Date().getDate()).where("date",">",0).where("year","==",new Date().getFullYear()).where("month","==",new Date().getMonth()).where("isDone","==",false)
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc=>{
                // this.setState(preState)
                // console.log('3getOverdueFromDB','id',doc.id);
                overdue.push({
                    id:doc.id,
                    title: doc.data().title,
                    ifDone: doc.data().isDone,
                    year: doc.data().year,
                    month: doc.data().month,
                    date: doc.data().date,
                    week: null,
                    timer: doc.data().timer,
                    list: doc.data().list
                });
            })
            this.setState({
                overdue:overdue
            })
        })
        //比較週數
        ref.where("week","<",countWeekNum(new Date())).where("week",">",0).where("isDone","==",false)
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc=>{
                overdue.push({
                    id:doc.id,
                    title: doc.data().title,
                    ifDone: doc.data().isDone,
                    year: doc.data().year,
                    month: doc.data().month,
                    date: doc.data().date,
                    week: null,
                    timer: doc.data().timer,
                    list: doc.data().list
                });
            })
            this.setState({
                overdue:overdue
            })
        })
    }

    toggleIfShowMore(e){
        let type = e.currentTarget.getAttribute("data-type");
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let index = e.currentTarget.getAttribute("data-index");
        let year = e.currentTarget.getAttribute("data-year");
        let month = e.currentTarget.getAttribute("data-month");
        let date = e.currentTarget.getAttribute("data-date");
        let week = e.currentTarget.getAttribute("data-week");
        let id = e.currentTarget.getAttribute("data-id");
        let list = e.currentTarget.getAttribute("data-list");
        let timer = e.currentTarget.getAttribute("data-timer");
        console.log('list',list);
        // console.log(year,month,date);
        // console.log(type);
        // console.log(timer);
        if(type=='overdue'){
            this.setState(preState=>{
                let ifShowMore = preState.ifShowMore;
                let moreInfoBoard = preState.moreInfoBoard;
                moreInfoBoard.oldTitle = oldTitle;
                moreInfoBoard.index = index;
                moreInfoBoard.iYear = parseInt(year);
                moreInfoBoard.iMonth = parseInt(month);
                moreInfoBoard.iDate = parseInt(date);
                moreInfoBoard.iWeek = week;
                moreInfoBoard.id = id;
                moreInfoBoard.timer = timer;
                moreInfoBoard.list = list;
                // console.log('toggleIfShowMore',moreInfoBoard);
                return{
                    ifShowMore: !ifShowMore,
                    note:oldTitle,
                    moreInfoBoard:moreInfoBoard,
                    calenIfShow:false
                }
            })
        }else{
            this.setState(preState=>{
                let ifShowMore = preState.ifShowMore;
                let moreInfoBoard = preState.moreInfoBoard;
                moreInfoBoard.oldTitle = oldTitle;
                moreInfoBoard.index = index;
                moreInfoBoard.iYear = this.state.year;
                moreInfoBoard.iMonth = this.state.month;
                moreInfoBoard.iDate = this.state.date;
                moreInfoBoard.id = id;
                moreInfoBoard.iWeek = null;
                moreInfoBoard.timer = timer;
                moreInfoBoard.list = list;
                // console.log('toggleIfShowMore',moreInfoBoard);
                return{
                    ifShowMore: !ifShowMore,
                    note:oldTitle,
                    moreInfoBoard:moreInfoBoard,
                    calenIfShow:false
                }
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
    autoHeight(){
        let x = document.getElementById("testHeight");
        x.style.height = 'auto';
        x.style.height = x.scrollHeight + "px";
    }
    showMoreInfo(){
        console.log('listItems',this.props.listItems);
        let selectList = this.props.listItems.map((list,index)=><option value={list.title} data-list={list.title} key={index}>{list.title}</option>)
        console.log('showMoreInfo',this.state.moreInfoBoard);
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
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="15" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle} autoFocus required></textarea>
                        {/* <textarea  className="info_contentInput" cols="50" rows="3" placeholder="Write here"></textarea> */}
                    </div>
                    <div>
                        {/* <div className="info"><i className="fas fa-check-square"></i>
                            <span>task</span></div> */}
                        <div className="info popUp" onClick={this.showCalen}>
                            <div className="infoLi popUp">
                                <i className="fas fa-calendar popUp"></i>
                                <span className="addList popUp">Change Time</span>
                            </div>
                            <div className="infoLi2 popUp">
                                {iDate==0&&iWeek==null&&iMonth>=0? showScheTime1:''}
                                {iWeek!=null && this.state.moreInfoBoard.iWeek!=0 && this.state.moreInfoBoard.iDate==0? showScheTime2:''}
                                {((iWeek==0 || this.state.moreInfoBoard.iWeek==undefined) && this.state.moreInfoBoard.iDate>0)? showScheTime3:''}
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
                        <div className="info">
                            <div className="infoLi">
                                <i className="fas fa-clock"></i>
                                <span className="addList">Timer</span>
                            </div>
                            <div className="infoLi2">
                                <input className="inputTimer" type="number" step=".5" defaultValue={this.state.moreInfoBoard.timer} onClickCapture={this.timer} autoFocus/>
                                {/* <input type="text" placeholder="spending hours?" onChange={this.timer} autoFocus/> */}
                            </div>
                            
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
        let note;
        this.setState(preState=>{
            note = preState.note;
            let moreInfoBoard = preState.moreInfoBoard;
            let thisDayToDos = preState.thisDayToDos;
            let ifShowMore = preState.ifShowMore;
            let timer = preState.timer;
            // thisDayToDos[moreInfoBoard.index].title = note;
            console.log(moreInfoBoard);
            if(moreInfoBoard.iDate!=this.state.date){
                thisDayToDos.splice(moreInfoBoard.index,1);
            }
            // console.log(thisDayToDos);
            return{
                thisDayToDos:thisDayToDos,
                ifShowMore: !ifShowMore,
                calenIfShow:false
            }
        });
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        console.log('adjust todo',this.state.timer);
        ref.doc(this.state.moreInfoBoard.id)
            .update({
                title:this.state.note,
                month:this.state.moreInfoBoard.iMonth,
                year:this.state.moreInfoBoard.iYear,
                date:this.state.moreInfoBoard.iDate,
                week:this.state.moreInfoBoard.iWeek,
                timer:this.state.timer,
                list: this.state.moreInfoBoard.list
                
            }).then(()=>{
                console.log('update成功');
                this.getDBdataInState(this.state.month,this.state.year,this.state.date);
                this.getOverdueFromDB();
                this.props.reRenderLog();
        })
    }


    deleteInDB(bt){
        console.log('delete');
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let dataId = bt.currentTarget.getAttribute("data-id");
        let dataType = bt.currentTarget.getAttribute("data-type");
        // console.log(deleteTitle,deleteIndex,this.state.month ,this.state.year,this.state.date);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        if(dataType == 'overdue'){
            // console.log('overdue')
            // ref.doc(dataId).delete().then(()=>{
            ref.doc(dataId).update({isDone:true}).then(()=>{
                console.log('overdue刪除成功');
                this.props.reRenderLog();
                
                this.getDBdataInState(this.state.month,this.state.year,this.state.date);
                this.setState(preState=>{
                    let overdue = preState.overdue;
                    overdue.splice(deleteIndex,1);
                    return{
                        overdue:overdue
                    }
                });
                
            })
        }else{
            // console.log('day');
            ref.where("month","==",this.state.month).where("year","==",this.state.year).where("date","==",this.state.date).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.update({isDone:true}).then(()=>{
                    // doc.ref.delete().then(()=>{
                        console.log('日刪除成功');
                        this.props.reRenderLog();
                        this.getOverdueFromDB();
                        // 要在db刪除後再setState，否則會抓到db更新前的資料去setState
                        this.setState(preState=>{
                            let thisDayToDos = preState.thisDayToDos;
                            thisDayToDos.splice(deleteIndex,1);
                            return{
                                thisDayToDos:thisDayToDos
                            }
                        });
                        
                    });
                })
            });
        }
    }

    ifDone(e){
        // console.log(this.state.year,this.state.month,this.state.date);
        let index = e.currentTarget.getAttribute("data-index");
        let title = e.currentTarget.getAttribute("data-title");
        let id = e.currentTarget.getAttribute("data-id");
        let newStatus;
        // console.log(index,title,id);
        this.setState(preState=>{
            let thisDayToDos = preState.thisDayToDos;
            newStatus = !thisDayToDos[index].ifDone;
            thisDayToDos[index].ifDone = newStatus;
        });
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",this.state.month).where("year","==",this.state.year).where("date","==",this.state.date).where("title","==",title)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    // console.log(doc.data());
                    doc.ref.update({isDone:newStatus})
                })
            })
        
    }

    overdueIfDone(e){
        let id = e.currentTarget.getAttribute("data-id");
        // console.log(id);
        let index = e.currentTarget.getAttribute("data-index");
        let newStatus;
        // console.log(this.state.overdue);
        
        this.setState(preState=>{
            let overdue = preState.overdue;
            console.log(overdue[index].ifDone,!overdue[index].ifDone);
            newStatus = !overdue[index].ifDone;
            overdue[index].ifDone = newStatus;
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("todos").doc(id);
            // ref.get().then(querySnapshot=>{
            //             console.log(querySnapshot.data());
            //             querySnapshot.data().ref.update({isDone:newStatus})
                    
            //     })
            ref.update({isDone:newStatus}).then(()=>{
                console.log('成功修改');
            });
        });
        
    }

    getDBdataInState(month,year,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisDayToDos = [];
        // console.log(month,year,date);
        ref.where("year","==",year).where("month","==",month).where("date","==",date).where('isDone','==',false)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // console.log(doc.data());
                    thisDayToDos.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        timer: doc.data().timer,
                        list: doc.data().list
                    });
                })
                this.setState({thisDayToDos:thisDayToDos});
            });
    }
    
    componentDidUpdate(preProps){
        // 避免程式不斷更新，使用preProps
        // 原本沒有使用時，props.state更新後就進到 componentDidupdate
        // 然後因為在 componentDidupdate 裡使用 getDBdataInState，state狀態改變後又進入componentDidupdate
        // 因此程式會一直循環印出console.log("Day Update")，database會爆掉

        if(preProps.reRender !== this.props.reRender){
            console.log("Day Update");
            this.getDBdataInState(this.state.month,this.state.year,this.state.date);
            this.getOverdueFromDB();
        }
        if(preProps.btToday !== this.props.btToday){
            this.backToTodayBtn();
        }
        
    }

    

    addToDB(title,year,month,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos").doc();
        ref.set({
            title: title,
            year: year,
            // 存入DB的月份，假設七月，會顯示6
            month: month,
            date: date,
            type: "task",
            isDone: false,
            overdue: false,
            timer:0          
        });
    }
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        // console.log(e.currentTarget.value);
    }

    addThisDayToDos(){
        if(handleValidation(this.state.note)==true){
            // alert("Form submitted");
            this.setState(preState=>{
                let thing = preState.note;
                let thisDayToDos = preState.thisDayToDos;
                let ifInput = preState.ifInput;
                let {year} = preState;
                let {month} = preState;
                let date = preState.date;
                this.addToDB(thing,year,month,date);
                thisDayToDos.push({"title":thing,"index":thisDayToDos.length,"ifDone":false});
                // console.log(list);
                this.props.reRenderLog();
                return{
                    thisDayToDos:thisDayToDos,
                    note:"",
                    ifInput:!ifInput
                };
            });
            this.getOverdueFromDB();
        }else{
            alert("Please Input Task")
            return;
        }
        // console.log('yo');
        
        
    }

    toggleIfInput(){
        // console.log(this.state.ifInput);
        this.setState(preState=>{
            let ifInput = preState.ifInput;
            ifInput = !ifInput;
            console.log(ifInput);
            return{
                ifInput: ifInput
            }
        });
    }

    enterClick(e){
        let btntype = e.currentTarget.getAttribute("data-enter");
        if (event.keyCode==13 && btntype=='day'){
            document.getElementById("inputDay").click(); //觸動按鈕的點擊
        } 
        if (event.keyCode==13 && btntype=='info'){
            document.getElementById("saveMoreInfo").click(); //觸動按鈕的點擊
        } 
    }
    showInput(){
        return(
            <div className="month_todo" data-enter={'day'} onKeyDown={this.enterClick}>
                <span>
                    <input className="noScheInput" type="text" placeholder="+ ADD TASK" onChange={this.handleNoteChange} autoFocus required="required"/>
                </span>
                <span className="month_todo_feacture2">
                    <span className="cancel" onClick={this.toggleIfInput}>Cancel</span>
                    <span className="add" id="inputDay" onClick={this.addThisDayToDos}>Add</span>
                </span>
            </div>
        )
    }

    handleDateForward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()+1);
            newdate = new Date(newdate);
            this.getDBdataInState(newdate.getMonth(),newdate.getFullYear(),newdate.getDate());
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate()
            }
        });
    }
    handleDateBackward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()-1);
            newdate = new Date(newdate);
            this.getDBdataInState(newdate.getMonth(),newdate.getFullYear(),newdate.getDate());
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate()
            }
        });
    }
    componentDidMount(){
        this.setWeekNum();
        this.getDBdataInState(this.state.month,this.state.year,this.state.date);
        this.getOverdueFromDB();
        document.addEventListener('click', this.handleClickOutside, false);
    }
    render(){
        let theme = this.state.theme;
        let renderThisDayTodos = this.state.thisDayToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf4_${theme}`}>
                    <span ><i className="fas fa-pen" data-list={todo.list} data-timer={todo.timer} data-id={todo.id} data-type={'date'} data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-type={'day'} data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                </span>
            </div>);
        let overdue = this.state.overdue.map((todo,index)=>
            <div className="month_todo"  key={index}>
                <span>
                    {todo.title}
                </span>
                <span className={`month_todo_feacture mf2_${theme}`}>
                    <span ><i className="fas fa-pen" data-list={todo.list} data-timer={todo.timer} data-type={'overdue'} data-id={todo.id} data-year={todo.year} data-month={todo.month} data-week={todo.week} data-date={todo.date} data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-check" data-type={'overdue'} data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                </span>
            </div>
        );
        let hint = <div className={`hint hint_${theme}`}>hint：點擊右上+按鈕，新增此日待辦事項！</div>
        let overdueDiv = <div id="overdue" className={`overdue_board overdue_board_${theme}`}>
                <div className={`month_title month_title_${theme}`}>
                    <span className="title_month">Overdue</span>
                </div>
                <div className="month_todos">
                    {overdue}
                </div>
            </div>  
        let todayHint = <span className="onlyShowToday">Today </span>
        let yearHint = <span className="showYear">{this.state.year}</span>
        return <div className={`right_board right_board_${theme}`}>
        {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)} year={this.state.year} month={this.state.month} date={this.state.date}/>:''}
        {this.state.ifChangeDate?<ChangeDateCal changeDate={this.changeDate.bind(this)}/>:''}
        <div id="today" className={`today_board today_board_${theme}`}>
            <div className={`month_title month_title_${theme}`}>
                <div>
                    {this.state.date==new Date().getDate()&&this.state.month==new Date().getMonth()?todayHint:''}
                    <span className="title_month">
                        {this.state.month+1}/{this.state.date}
                    </span>
                    {this.state.date==new Date().getDate()&&this.state.month==new Date().getMonth()?'':yearHint}
                    
                </div>
                
                <span className="title_right">
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={this.ifChangeDate}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left"  onClick={this.handleDateBackward}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={this.handleDateForward}></i></span>
                    <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
                </span>
            </div>
            
            <div className="month_todos">
                {this.state.ifInput? this.showInput() : ''}
                {renderThisDayTodos==''?hint:''}
                {renderThisDayTodos}
            </div>
        </div>
        
        {this.state.overdue==''?'':overdueDiv}
        {/* 單一事件控制面板 */}
        {this.state.ifShowMore? this.showMoreInfo(): ''} 
    </div>
    }
}
export default RenderDayLog;