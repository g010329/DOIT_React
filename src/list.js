import React from "react";
import * as firebase from "firebase";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'firebase/auth';
import 'firebase/database';
class List extends React.Component{
    constructor(props){
        super(props);
        this.state={
            createdAt:{
                year: 2020,
                month: 7,
                date: 28,
                day: null
            },
            doneList:[],
            undoneList:[],
            showMoreDoneList: false,
            showMoreTodoList: false
        }
        this.getListDBdata = this.getListDBdata.bind(this);
        this.toggleShowMoreDoneList = this.toggleShowMoreDoneList.bind(this);
        this.toggleShowMoreTodoList = this.toggleShowMoreTodoList.bind(this);
    }
    toggleShowMoreDoneList(){
        this.setState(preState=>{
            let showMoreDoneList = preState.showMoreDoneList;
            console.log(!showMoreDoneList);
            return{
                showMoreDoneList: !showMoreDoneList 
            }
        })
    }
    toggleShowMoreTodoList(){
        this.setState(preState=>{
            let showMoreTodoList = preState.showMoreTodoList;
            console.log(!showMoreTodoList);
            return{
                showMoreTodoList: !showMoreTodoList 
            }
        })
    }
    componentDidMount(){
        // console.log(this.props.showWhichList);
        this.getListDBdata();
    }
    componentDidUpdate(){
        console.log('list Update');
    }
    getListDBdata(){
        let doneList = [];
        let undoneList = [];
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid);
        // 搜尋lists
        ref.collection("lists").where("title","==",this.props.showWhichList).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                this.setState(preState=>{
                    console.log(doc.data());
                    let createdAt = preState.createdAt;
                    createdAt.year = doc.data().createdAt.toDate().getYear()+1900;
                    createdAt.month = doc.data().createdAt.toDate().getMonth();
                    createdAt.date = doc.data().createdAt.toDate().getDate();
                    createdAt.day = doc.data().createdAt.toDate().getDay();
                
                    return{
                        createdAt:createdAt
                    }    
                })
                
            })
        })
        // 搜尋todos:done
        ref.collection("todos").where("list","==",this.props.showWhichList).where("isDone","==",true).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                console.log('搜尋todos:done',doc.data());
                doneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
            })
            this.setState({doneList:doneList});
        })
        // 搜尋todos:undone
        ref.collection("todos").where("list","==",this.props.showWhichList).where("isDone","==",false).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                console.log('todos:undone',doc.data());
                undoneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
            })
            this.setState({undoneList:undoneList})
        })
    }
    render(){
        let undoneTotalTime=0;
        let undoneTimer = this.state.undoneList.map((undone,index)=>{
            console.log(parseFloat(undone.timer));
            undoneTotalTime+=parseFloat(undone.timer);
        })
        console.log('undoneTotalTime',undoneTotalTime);
        let doneTotalTime=0;
        let doneTimer = this.state.doneList.map((done,index)=>{
            console.log(done.timer);
            doneTotalTime+=parseFloat(done.timer);
        })
        
        let createdAt = this.state.createdAt;
        
        let doneList = this.state.doneList.map((doneItem,index)=><div className="listLi" key={index}>
                <div>
                    <span className="doneCircle"><i className="fas fa-circle"/></span>
                    <span>{doneItem.title}</span>
                </div>
                <div>{doneItem.timer}hr</div>
            </div>)
        let undoneList = this.state.undoneList.map((undoneItem,index)=><div className="listLi" key={index}>
                <div>
                    <span className="doneCircle"><i className="fas fa-circle"/></span>
                    <span>{undoneItem.title}</span>
                </div>
                <div>{undoneItem.timer}hr</div>
            </div>)
        let doneListContent = <div className="doneListMiddle">
                {doneList}
            </div>
        let todoListContent = <div className="doneListMiddle">
                {undoneList}
            </div>
        
        // let todoListContent = <div className="doneListMiddle">
        //         <div className="listLi">
        //             <div>
        //                 <span className="doneCircle"><i className="far fa-circle"/></span>
        //                 <span>做List版面RWD</span>
        //             </div>
        //             <div>3hr</div>
        //         </div>
        //         <div className="listLi">
        //             <div>
        //                 <span className="doneCircle"><i className="far fa-circle"/></span>
        //                 <span>List串firebase</span>
        //             </div>
        //             <div>2hr</div>
        //         </div>
                
        //     </div>
        let listBoard = <div className="listBoard">
                <div className="listTitle">
                    <span className="listTitleName">{this.props.showWhichList}</span>
                    <span className="listTitleIcon">
                        <span><i className="fas fa-pen"></i></span>
                        <span><i className="fas fa-trash"></i></span>
                    </span>
                </div>
                <div className="listInfo">
                    <div className="listInfo_div">
                        <div>Created At</div>
                        <div>{createdAt.year}-{createdAt.month+1}-{createdAt.date}</div>
                    </div>
                    <div className="listInfo_div">
                        <div>Spending Hours</div>
                        <div>{doneTotalTime+undoneTotalTime} hr(s)</div>
                    </div>
                    <div className="listInfo_div">
                        <div>Done At</div>
                        <div>???</div>
                    </div>
                </div>
                <div className="list">
                    <div className="doneListTop">
                        <div>
                            <span className="doneListTitle">TODO LIST</span>
                            <span>({this.state.undoneList.length} items)</span>
                        </div>
                        <div className="doneListTitle2">
                            <span className="listTotalHours">Total Hours :  {undoneTotalTime} hr(s)</span>
                            {this.state.showMoreTodoList?
                                <span className="lessList" onClick={this.toggleShowMoreTodoList}><i className="fas fa-caret-up"/></span>:
                                <span className="moreList" onClick={this.toggleShowMoreTodoList}><i className="fas fa-caret-down"/></span>}
                        </div>
                    </div>
                    {this.state.showMoreTodoList?todoListContent:''}
                    {/* {doneList} */}
                </div>
                <div className="list">
                    <div className="doneListTop">
                        <div>
                            <span className="doneListTitle">DONE LIST</span>
                            <span>({this.state.doneList.length} items)</span>
                        </div>
                        <div className="doneListTitle2">
                            <span className="listTotalHours">Total Hours :  {doneTotalTime} hr(s)</span>
                            {this.state.showMoreDoneList?
                                <span className="lessList" onClick={this.toggleShowMoreDoneList}><i className="fas fa-caret-up"/></span>:
                                <span className="moreList" onClick={this.toggleShowMoreDoneList}><i className="fas fa-caret-down"/></span>}
                        </div>
                    </div>
                    {this.state.showMoreDoneList?doneListContent:''}
                    {/* {doneList} */}
                </div>
                
                
                <div className="bgc"></div>
            </div>
        return <div>
            <Link to='/dashboard'>
                <div className="btDashboardbtn">
                    <span className="btDashboardbtn1"><i className="fas fa-caret-left"></i></span>
                    <span className="btDashboardbtn2">DASHBOARD</span>
                </div>
            </Link>
            {listBoard}
        </div>
    }
    
}
export default List;