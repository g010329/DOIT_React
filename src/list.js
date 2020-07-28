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
            undoneList:[]
        }
        this.getListDBdata = this.getListDBdata.bind(this);
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
                    title: doc.date().title,
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
            console.log(undone.timer);
            undoneTotalTime+=parseInt(undone.timer);
        })
        
        let createdAt = this.state.createdAt;
        let doneList = this.state.doneList.map((doneItem,index)=><div className="listLi" key={index}>
                <span>{doneItem.title}</span><span>{doneItem.timer}hr</span>
            </div>)
        let undoneList = this.state.undoneList.map((undoneItem,index)=><div className="listLi" key={index}>
                <span>{undoneItem.title}</span><span>{undoneItem.timer}hr</span>
            </div>)
        let listBoard = <div className="listBoard">
                <div className="listTitle">[個人專案]{this.props.showWhichList}</div>
                <div>Created At: {createdAt.year}-{createdAt.month+1}-{createdAt.date}</div>
                <div>Done At: ???</div>
                <div>Spending Hours: 40hrs</div>
                <div className="list">
                    <div className="doneListTitle">DONE</div>
                    <div className="doneListMiddle">
                        <div className="listLi">
                            <div>做List版面UI</div><div>3hr</div>
                        </div>
                        <div className="listLi">
                            <div>List串firebase</div><div>5hr</div>
                        </div>
                        <div className="listLi">
                            <div>想一下圖表怎麼做</div><div>1hr</div>
                        </div>
                    </div>
                    
                        
                    {/* {doneList} */}
                    <div>Total Hours:  304hrs</div>
                </div>
                <div className="list">
                    <div className="doneListTitle">TODO</div>
                    <div className="listLi">
                        <div>List版面RWD</div><div>3hr</div>
                    </div>
                    {/* {undoneList} */}
                    <div>Total Hours: {undoneTotalTime} hrs</div>
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