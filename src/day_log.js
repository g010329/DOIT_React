import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
import Calendar from "./calendar";
import ChangeDateCal from "./changeDateCal";
class RenderDayLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            today:{y:new Date().getFullYear(),m:new Date().getMonth(),d:new Date().getDate()},
            year: new Date().getFullYear(), //2020
            month: new Date().getMonth(), //7
            date: new Date().getDate(), //3
            thisDayToDos:[
                // {"title":1,"index":1,"ifDone":false},
                // {"title":2,"index":1,"ifDone":false}
            ],
            ifInput: false,
            ifShowMore: false,
            note:"",
            moreInfoBoard:{
                oldTitle:'',
                index:null,
                newTitle:'',
                iYear:null,
                iMonth:null,
                iDate:null
            },
            overdue:[
                {"id":'dn1k3ednklwjebd',"title":'zzz',"ifDone":false,"year":2020,"month":5,"date":15}
            ],
            calenIfShow:false,
            ifChangeDate:false
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
        this.countWeekNum = this.countWeekNum.bind(this);
        this.ifChangeDate = this.ifChangeDate.bind(this);
        this.changeDate= this.changeDate.bind(this);
        //overdue done
        this.overdueIfDone = this.overdueIfDone.bind(this);
        
    }

    countWeekNum(d){
        //算出今日是第幾週 d=new Date("2020-05-02")
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return weekNo;
    }
    changeDate(year,month,date){
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
        let overdue =[];
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        //比較年
        ref.where("year","<",new Date().getFullYear()).where("isDone","==",false).orderBy("year","asc")
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // this.setState(preState)
                    // console.log("1",doc.data());
                    overdue.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        year: doc.data().year,
                        month: doc.data().month,
                        date: doc.data().date
                    });
                })
                this.setState({
                    overdue:overdue
                })
            })
        // 同年、月份較小
        ref.where("month","<",new Date().getMonth()).where("year","==",new Date().getFullYear()).where("isDone","==",false)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // this.setState(preState)
                    // console.log("2",doc.data());
                    overdue.push({
                        id:doc.id,
                        title: doc.data().title,
                        ifDone: doc.data().isDone,
                        year: doc.data().year,
                        month: doc.data().month,
                        date: doc.data().date
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
                // console.log("3",doc.data());
                overdue.push({
                    id:doc.id,
                    title: doc.data().title,
                    ifDone: doc.data().isDone,
                    year: doc.data().year,
                    month: doc.data().month,
                    date: doc.data().date
                });
            })
            this.setState({
                overdue:overdue
            })
        })
        
    }

    toggleIfShowMore(e){
        let oldTitle = e.currentTarget.getAttribute("data-title");
        let index = e.currentTarget.getAttribute("data-index");
        // console.log(oldTitle,index);
        this.setState(preState=>{
            let ifShowMore = preState.ifShowMore;
            let thisDayToDos = preState.thisDayToDos;
            let moreInfoBoard = preState.moreInfoBoard;
            moreInfoBoard.oldTitle = oldTitle;
            moreInfoBoard.index = index;
            moreInfoBoard.iYear = this.state.year;
            moreInfoBoard.iMonth = this.state.month;
            moreInfoBoard.iDate = this.state.date;
            console.log(moreInfoBoard);
            return{
                ifShowMore: !ifShowMore,
                note:oldTitle,
                moreInfoBoard:moreInfoBoard
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
                            <span>{this.state.moreInfoBoard.iYear}-{this.state.moreInfoBoard.iMonth+1}-{this.state.moreInfoBoard.iDate}</span></div>
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
        this.setState(preState=>{
            note = preState.note;
            let moreInfoBoard = preState.moreInfoBoard;
            let thisDayToDos = preState.thisDayToDos;
            let ifShowMore = preState.ifShowMore;
            thisDayToDos[moreInfoBoard.index].title = note;
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
        // console.log(this.state.year,this.state.month,this.state.date,oldTitle);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("year","==",this.state.year).where("month","==",this.state.month).where("date","==",this.state.date).where("title","==",oldTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.update({title:this.state.note,month:this.state.moreInfoBoard.iMonth,year:this.state.moreInfoBoard.iYear,date:this.state.moreInfoBoard.iDate,week:this.state.moreInfoBoard.iWeek})
                })
            })
        this.props.reRenderLog();
    }


    deleteInDB(bt){
        console.log('delete');
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",this.state.month).where("year","==",this.state.year).where("date","==",this.state.date).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.delete().then(()=>{
                        onsole.log('delete successfully');
                        // 要在db刪除後再setState，否則會抓到db更新前的資料去setState
                        this.setState(preState=>{
                            let thisDayToDos = preState.thisDayToDos;
                            thisDayToDos.splice(deleteIndex,1);
                            return{
                                thisDayToDos:thisDayToDos
                            }
                        });
                        this.props.reRenderLog();
                        this.getOverdueFromDB();
                    });
                })
            });
        
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
                    console.log(doc.data());
                    doc.ref.update({isDone:newStatus})
                })
            })
        // ref.where("id","==",e.currentTarget.getAttribute("data-id"))
        //     .get().then(querySnapshot=>{
        //         querySnapshot.forEach(doc=>{
        //             // console.log(doc.data());
        //             console.log("newstatus",newStatus);
        //             doc.ref.update({isDone:newStatus})
        //         })
        //     })
    }

    overdueIfDone(e){
        let id = e.currentTarget.getAttribute("data-id");
        console.log(id);
        let index = e.currentTarget.getAttribute("data-index");
        let newStatus;
        console.log(this.state.overdue);
        
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
                        ifDone: doc.data().isDone
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
        
        // console.log("Day Update",preProps.reRender,this.props.reRender);
        if(preProps.reRender !== this.props.reRender){
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
            overdue: false           
        });
    }
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        // console.log(e.currentTarget.value);
    }

    addThisDayToDos(){
        // console.log('yo');
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
    }
    showInput(){
        return(
            <div className="month_todo" data-enter={'day'} onKeyDown={this.enterClick}>
                <span>
                    <input type="checkbox" />
                    <input type="text" onChange={this.handleNoteChange} autoFocus/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.toggleIfInput}>cancel</span>
                    <span id="inputDay" onClick={this.addThisDayToDos}>add</span>
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
        this.getDBdataInState(this.state.month,this.state.year,this.state.date);
        this.getOverdueFromDB();
    }
    render(){
        let renderThisDayTodos = this.state.thisDayToDos.map((todo,index)=>
            <div className="month_todo" key={index}>
                <span><input type="checkbox" data-id={todo.id} data-index={index} data-title={todo.title} onChange={this.ifDone}></input>{todo.title}</span>
                <span className="month_todo_feacture">
                    {/* <span><i className="fas fa-angle-double-right" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span> */}
                    <span ><i className="fas fa-pen" data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-trash" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                </span>
            </div>);
        let overdue = this.state.overdue.map((todo,index)=>
            <div className="month_todo"  key={index}>
                <span><input type="checkbox" data-id={todo.id} data-index={index} data-title={todo.title} onChange={this.overdueIfDone}></input>{todo.title}</span>
                <span className="month_todo_feacture">
                    {/* <span><i className="fas fa-angle-double-right" ></i></span> */}
                    <span ><i className="fas fa-pen" data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                    <span><i className="fas fa-trash" data-id={todo.id} data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                </span>
            </div>
        );
        return <div className="right_board">
        {this.state.calenIfShow?<Calendar calenUpdateTime={this.calenUpdateTime.bind(this)}/>:''}
        {this.state.ifChangeDate?<ChangeDateCal changeDate={this.changeDate.bind(this)}/>:''}
        <div id="today" className="today_board">
            <div className="month_title">
                <span className="title_month">{this.state.month+1}/{this.state.date}</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar" onClick={this.ifChangeDate}></i></span>
                    <span><i className="fas fa-angle-left"  onClick={this.handleDateBackward}></i></span>
                    <span><i className="fas fa-angle-right" onClick={this.handleDateForward}></i></span>
                    <span><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
                </span>
            </div>
            {this.state.ifInput? this.showInput() : ''}
            <div className="month_todos">
                {/* <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div> */}
                {renderThisDayTodos}
            </div>
        </div>
        <div id="overdue" className="overdue_board">
            <div className="month_title">
                <span className="title_month">Overdue</span>
            </div>
            <div className="month_todos">
                {overdue}
            </div>
            
            
            {/* <div className="month_todos">
                <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div>
            </div> */}
        </div>  
        {/* 單一事件控制面板 */}
        {this.state.ifShowMore? this.showMoreInfo(): ''} 
    </div>
    }
}
export default RenderDayLog;