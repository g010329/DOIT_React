import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class RenderDayLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
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
                newTitle:''
            }
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
            // console.log(moreInfoBoard);
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
                        <textarea  className="info_contentInput" cols="50" rows="3" placeholder="Write here"></textarea>
                    </div>
                    <div>
                        <div className="info"><i className="fas fa-check-square"></i>
                            <span>task</span></div>
                        <div className="info"><i className="fas fa-calendar"></i>
                            <span>7/2</span></div>
                        <div className="info"><i className="fas fa-list-ul"></i>
                            <span>add to list</span></div>
                    </div>
                </div>
                <div>
                    {/* <span onClick={this.toggleIfShowMore}>cancel</span> */}
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
            // console.log(thisDayToDos);
            return{
                thisDayToDos:thisDayToDos,
                ifShowMore: !ifShowMore
            }
        });
        console.log(this.state.year,this.state.month,this.state.date,oldTitle);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("year","==",this.state.year).where("month","==",this.state.month).where("date","==",this.state.date).where("title","==",oldTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.update({title:this.state.note})
                })
            })
        this.props.reRenderLog();
    }


    deleteInDB(bt){
        let deleteTitle = bt.currentTarget.getAttribute("data-title");
        let deleteIndex = bt.currentTarget.getAttribute("data-delete-index");
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        ref.where("month","==",this.state.month).where("year","==",this.state.year).where("date","==",this.state.date).where("title","==",deleteTitle)
            .get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    doc.ref.delete().then(()=>{
                        // 要在db刪除後再setState，否則會抓到db更新前的資料去setState
                        this.setState(preState=>{
                            let thisDayToDos = preState.thisDayToDos;
                            thisDayToDos.splice(deleteIndex,1);
                            return{
                                thisDayToDos:thisDayToDos
                            }
                        });
                        this.props.reRenderLog();
                    });
                })
            });
    }

    ifDone(e){
        console.log(this.state.year,this.state.month,this.state.date);
        let index=e.currentTarget.getAttribute("data-index");
        let title=e.currentTarget.getAttribute("data-title");
        let newStatus;
        console.log(index," ",title);
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
    }

    getDBdataInState(month,year,date){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("todos");
        let thisDayToDos = [];
        // console.log(month,year,date);
        ref.where("year","==",year).where("month","==",month).where("date","==",date)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc=>{
                    // console.log(doc.data());
                    thisDayToDos.push({
                        // id:doc.id,
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
        
        console.log("Day Update",preProps.reRender,this.props.reRender);
        if(preProps.reRender !== this.props.reRender){
            this.getDBdataInState(this.state.month,this.state.year,this.state.date);
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
        console.log('yo');
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

    showInput(){
        return(
            <div className="month_todo">
                <span>
                    <input type="checkbox" />
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.toggleIfInput}>cancel</span>
                    <span onClick={this.addThisDayToDos}>add</span>
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
    }
    render(){
        let renderThisDayTodos = this.state.thisDayToDos.map((todo,index)=>
        <div className="month_todo" key={index}>
            <span><input type="checkbox" data-index={index} data-title={todo.title} onChange={this.ifDone}></input>{todo.title}</span>
            <span className="month_todo_feacture">
                <span><i className="fas fa-angle-double-right" data-delete-index={index} data-title={todo.title} onClick={this.deleteInDB}></i></span>
                <span ><i className="fas fa-info-circle" data-index={index} data-title={todo.title} onClick={this.toggleIfShowMore}></i></span>
                <span><i className="fas fa-arrows-alt"></i></span>
            </span>
        </div>);
        return <div className="right_board">
        <div id="today" className="today_board">
            <div className="month_title">
                <span className="title_month">Today {this.state.month+1}/{this.state.date}</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar"></i></span>
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
                <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div>
            </div>
        </div>  
        {/* 單一事件控制面板 */}
        {this.state.ifShowMore? this.showMoreInfo(): ''} 
    </div>
    }
}
export default RenderDayLog;