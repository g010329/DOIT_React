import React from "react";
import * as firebase from "firebase";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'firebase/auth';
import 'firebase/database';
// google chart
import { Chart } from "react-google-charts";
// import * as React from "react";
// import { render } from "react-dom";

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
            listTitle:this.props.showWhichList,
            listId:null,
            doneList:[],
            undoneList:[],
            showMoreDoneList: false,
            showMoreTodoList: true,
            showPieChart: false,
            pieChartData:[]
        }
        this.getListDBdata = this.getListDBdata.bind(this);
        this.toggleShowMoreDoneList = this.toggleShowMoreDoneList.bind(this);
        this.toggleShowMoreTodoList = this.toggleShowMoreTodoList.bind(this);
        this.toggleShowPieChart = this.toggleShowPieChart.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.adjsutListTitleInDB = this.adjsutListTitleInDB.bind(this);
        this.autoHeight = this.autoHeight.bind(this);
        this.enterClick - this.enterClick.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteListInDB = this.deleteListInDB.bind(this);
    }
    enterClick(e){
        let btntype = e.currentTarget.getAttribute("data-enter");
        // console.log('enter0');
        if (event.keyCode==13 && btntype=='titleName'){
            // console.log('enter1');
            document.getElementById("adjsutList").click(); //觸動按鈕的點擊
        } 
    }
    handleNoteChange(e){
        this.setState({
            note: e.currentTarget.value,
            // listTitle: e.currentTarget.value
        });
        // console.log('note: '+e.currentTarget.value);
    }
    adjsutListTitleInDB(){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("lists");
        ref.doc(this.state.listId).update({title:this.state.note}).then(()=>{console.log('update title')})
    }
    deleteListInDB(){
        if (this.deleteConfirm()){
            alert('刪除');
            let db = firebase.firestore();
            let ref = db.collection("members").doc(this.props.uid).collection("lists");
            ref.doc(this.state.listId).delete().then(()=>{console.log('delete list')})
        }else{
            return;
        }
        
    }
    deleteConfirm(){
        if(window.confirm('列表刪除後即無法復原，仍要刪除嗎？')){
            return true;
        }else{
            return false;
        }
    }
    toggleShowMoreDoneList(){
        this.setState(preState=>{
            let showMoreDoneList = preState.showMoreDoneList;
            return{
                showMoreDoneList: !showMoreDoneList 
            }
        })
    }
    toggleShowMoreTodoList(){
        this.setState(preState=>{
            let showMoreTodoList = preState.showMoreTodoList;
            return{
                showMoreTodoList: !showMoreTodoList 
            }
        })
    }
    toggleShowPieChart(){
        // console.log('pie!!');
        this.setState(preState=>{
            let showPieChart = preState.showPieChart;
            return{
                showPieChart: !showPieChart 
            }
        })
        
    }
    componentDidMount(){
        this.getListDBdata();
    }
    componentDidUpdate(preProps){
        if(preProps.showWhichList !== this.props.showWhichList){
            // console.log('list Update');
            this.getListDBdata();
        }
        
    }
    adjustTodo(){

    }
    getListDBdata(){
        let doneList = [];
        let undoneList = [];
        let pieChartData = [['Task', 'Spending Hours']];
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid);
        // 搜尋lists
        ref.collection("lists").where("title","==",this.props.showWhichList).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                this.setState(preState=>{
                    // console.log(doc.data());
                    let createdAt = preState.createdAt;
                    createdAt.year = doc.data().createdAt.toDate().getYear()+1900;
                    createdAt.month = doc.data().createdAt.toDate().getMonth();
                    createdAt.date = doc.data().createdAt.toDate().getDate();
                    createdAt.day = doc.data().createdAt.toDate().getDay();
                
                    return{
                        createdAt:createdAt,
                        listId: doc.id
                    }    
                })
                
            })
        })
        // 搜尋todos:done
        ref.collection("todos").where("list","==",this.props.showWhichList).where("isDone","==",true).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                // console.log('搜尋todos:done',doc.data());
                doneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
                pieChartData.push([doc.data().title, parseFloat(doc.data().timer)]);
            })
            // console.log('done-pieChartData',pieChartData)
            this.setState({
                doneList:doneList,
                pieChartData: pieChartData
            });
        })
        // 搜尋todos:undone
        ref.collection("todos").where("list","==",this.props.showWhichList).where("isDone","==",false).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                // console.log('todos:undone',doc.data());
                undoneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
                pieChartData.push([doc.data().title, parseFloat(doc.data().timer)]);
            })
            // console.log('undone-pieChartData',this.state.pieChartData);
            this.setState({
                undoneList:undoneList,
                pieChartData: pieChartData
            })
        })
    }
    autoHeight(){
        let x = document.getElementById("inputTitle");
        x.style.height = 'auto';
        x.style.height = x.scrollHeight + "px";
    }
    render(){
        let undoneTotalTime=0;
        let undoneTimer = this.state.undoneList.map((undone,index)=>{
            // console.log(parseFloat(undone.timer));
            undoneTotalTime+=parseFloat(undone.timer);
        })
        // console.log('undoneTotalTime',undoneTotalTime);
        let doneTotalTime=0;
        let doneTimer = this.state.doneList.map((done,index)=>{
            // console.log(done.timer);
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
        let pieChart = <Chart
                // width={'500px'}
                // height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={
                    // [['Task', 'Spending Hours'],
                    // ['Work', 11],
                    // ['Eat', 2],
                    // ['Commute', 2],
                    // ['Watch TV', 2],
                    // ['Sleep', 7]]
                    this.state.pieChartData
                }
                // options={{
                //     title: 'My Daily Activities',
                // }}
                rootProps={{ 'data-testid': '1' }}
            />
        let chart = <div className="list2">
                <div className="doneListTop">
                    <div>
                        <span className="doneListTitle">TIME DISTRIBUTION</span>
                        <span>({this.state.undoneList.length+this.state.doneList.length} items)</span>
                    </div>
                    <div className="doneListTitle2">
                        {this.state.showPieChart?
                            <span className="lessList" onClick={this.toggleShowPieChart}><i className="fas fa-caret-up"/></span>:
                            <span className="moreList" onClick={this.toggleShowPieChart}><i className="fas fa-caret-down"/></span>}
                    </div>
                </div>
                <div className="showPieChart">
                    {this.state.showPieChart? pieChart:''}
                </div>
                
                
            </div>
        let listBoard = <div className="listBoard">
                <div className="listTitle">
                    {/* <span className="listTitleName">{this.props.showWhichList}</span> */}
                    <textarea id="inputTitle" rows="1" onInput={this.autoHeight} className="listTitleName" defaultValue={this.state.listTitle} onChange={this.handleNoteChange}/>
                    <span className="listTitleIcon" data-enter="titleName" onKeyDown={this.enterClick}>
                        <span id="adjsutList" onClick={this.adjsutListTitleInDB}><i className="fas fa-pen"></i></span>
                        <span onClick={this.deleteListInDB}><i className="fas fa-trash"></i></span>
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
                
                {chart}
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