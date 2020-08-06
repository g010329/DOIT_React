import React from "react";
import db from "../firebase.js";
import Calendar from "../Calendars/calendar";
import ChangeDateCal from "../Calendars/changeDateCal";
import {countWeekNum,handleValidation} from '../util.js';

import LogTitle from "./dayLogTitle.js";
import ThisDayToDos from "./thisDayToDos.js";
import Overdue from "./overdue.js"
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
                // {"title":1,"index":1,"ifDone":false}
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
        //timer
        this.timer = this.timer.bind(this); 
        this.chooseList = this.chooseList.bind(this);  
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
        }else{
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
            let {year, month, date} = preState;
            // 將該週未安排事件放入state
            return {weekNum:countWeekNum(new Date(`${year}-${month+1}-${date}`))}
        })
    }
    
    changeDate(year,month,date){
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
            console.log('更換日')
            return{
                ifChangeDate: !preState.ifChangeDate
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
                let {moreInfoBoard} = preState;
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
        this.setState(preState=>{
            let calenIfShow = !preState.calenIfShow;
            return{
                calenIfShow: calenIfShow
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
        this.getDBdataInState(new Date().getMonth(),new Date().getFullYear(),new Date().getDate());
    }
    getOverdueFromDB(){
        let createOverdueObj=(doc)=>{
            return {
                id:doc.id,
                title: doc.data().title,
                ifDone: doc.data().isDone,
                year: doc.data().year,
                month: doc.data().month,
                date: doc.data().date,
                week: null,
                timer: doc.data().timer,
                list: doc.data().list
            }
        }
        let overdue =[];
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let conditions=[
            //比較年、同年但月份較小、同年同月份日期小、比較週數
            ref.where("year","<",new Date().getFullYear()).where("isDone","==",false).orderBy("year","asc"),
            ref.where("month","<",new Date().getMonth()).where("year","==",new Date().getFullYear()).where("isDone","==",false).where('week',"==",0),
            ref.where("month","<",new Date().getMonth()).where("year","==",new Date().getFullYear()).where("isDone","==",false).where('week',"==",null),
            ref.where("date","<",new Date().getDate()).where("date",">",0).where("year","==",new Date().getFullYear()).where("month","==",new Date().getMonth()).where("isDone","==",false),
            ref.where("week","<",countWeekNum(new Date())).where("week",">",0).where("isDone","==",false)
        ];
        for (let i=0; i<5; i++){
            conditions[i].get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    overdue.push(createOverdueObj(doc));
                })
                this.setState({
                    overdue:overdue
                })
            })
        }
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
        if(type=='overdue'){
            this.setState(preState=>{
                let {ifShowMore, moreInfoBoard} = preState;
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
                    note: oldTitle,
                    moreInfoBoard: moreInfoBoard,
                    calenIfShow: false
                }
            })
        }else{
            this.setState(preState=>{
                let {ifShowMore, moreInfoBoard} = preState;
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
                    note: oldTitle,
                    moreInfoBoard: moreInfoBoard,
                    calenIfShow: false
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
        let {iMonth, iWeek, iDate, list} = this.state.moreInfoBoard;
        return(
            <div id="moreInfo" className="bt_moreInfo_board" data-enter={'info'} onKeyDown={this.enterClick}>
                <div className="infoflex">
                    <div className="info1">
                        <textarea  id="testHeight" className="info_titleInput" onChange={this.handleNoteChange} onInput={this.autoHeight} cols="15" rows="1" placeholder="Title"  defaultValue={this.state.moreInfoBoard.oldTitle} autoFocus required></textarea>
                    </div>
                    <div>
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
                            </div>
                            
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
        let note;
        this.setState(preState=>{
            note = preState.note;
            let {moreInfoBoard, thisDayToDos, ifShowMore} = preState;
            console.log(moreInfoBoard);
            if(moreInfoBoard.iDate!=this.state.date){
                thisDayToDos.splice(moreInfoBoard.index,1);
            }
            return{
                thisDayToDos: thisDayToDos,
                ifShowMore: !ifShowMore,
                calenIfShow: false
            }
        });
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        console.log('adjust todo',this.state.timer);
        ref.doc(this.state.moreInfoBoard.id)
            .update({
                title: this.state.note,
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
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        if(dataType == 'overdue'){
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
                });
            });
        }
    }

    getDBdataInState(month,year,date){
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisDayToDos = [];
        ref.where("year","==",year).where("month","==",month).where("date","==",date).where('isDone','==',false)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
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
            timer: 0,
            week: 0          
        });
    }
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
    }

    addThisDayToDos(){
        if(handleValidation(this.state.note)==true){
            // alert("Form submitted");
            this.setState(preState=>{
                let {thisDayToDos, ifInput, year, month, date} = preState;
                let thing = preState.note;
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
    }

    toggleIfInput(){
        this.setState(preState=>{
            return{
                ifInput: !preState.ifInput
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
            let {year, month, date} = preState;
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
            let {year, month, date} = preState;
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
        let {year, month, date, theme, thisDayToDos, ifInput, overdue} = this.state;
        return <div className={`right_board right_board_${theme}`}>
        {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)} year={year} month={month} date={date}/>:''}
        {this.state.ifChangeDate?<ChangeDateCal changeDate={this.changeDate.bind(this)}/>:''}
        <div id="today" className={`today_board today_board_${theme}`}>
            <LogTitle year={year} month={month} date={date} theme={theme} ifChangeDate={this.ifChangeDate.bind(this)} handleDateBackward={this.handleDateBackward.bind(this)} handleDateForward={this.handleDateForward.bind(this)} toggleIfInput={this.toggleIfInput.bind(this)}/>
            <ThisDayToDos theme={theme} thisDayToDos={thisDayToDos} ifInput={ifInput} toggleIfShowMore={this.toggleIfShowMore.bind(this)} deleteInDB={this.deleteInDB.bind(this)} showInput={this.showInput.bind(this)}/>
        </div>
        
        {this.state.overdue==''?'':<Overdue theme={theme} overdue={overdue} toggleIfShowMore={this.toggleIfShowMore.bind(this)} deleteInDB={this.deleteInDB.bind(this)}/>}
        {/* 單一事件控制面板 */}
        {this.state.ifShowMore? this.showMoreInfo(): ''} 
    </div>
    }
}
export default RenderDayLog;