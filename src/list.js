import React from "react";
import db from "./firebase.js";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
// google chart
import { Chart } from "react-google-charts";

class List extends React.Component{
    constructor(props){
        super(props);
        this.testHeight = React.createRef();
        this.adjsutList = React.createRef();
        this.state={
            createdAt:{
                year: 2020,
                month: 7,
                date: 28,
                day: null
            },
            listId:null,
            doneList:[],
            undoneList:[],
            showMoreDoneList: false,
            showMoreTodoList: true,
            showPieChart: false,
            pieChartData:[],
            redirect:false,
            showWhichList: ''
        }
        this.getListDBdata = this.getListDBdata.bind(this);
        this.toggleShowMoreDoneList = this.toggleShowMoreDoneList.bind(this);
        this.toggleShowMoreTodoList = this.toggleShowMoreTodoList.bind(this);
        this.toggleShowPieChart = this.toggleShowPieChart.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.adjustListTitleInDB = this.adjustListTitleInDB.bind(this);
        this.autoHeight = this.autoHeight.bind(this);
        this.enterClick = this.enterClick.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteListInDB = this.deleteListInDB.bind(this);
    }
    enterClick(e){
        let btntype = e.currentTarget.getAttribute("data-enter");
        if (event.keyCode==13 && btntype=='titleName'){
            this.adjsutList.current.click();
        } 
    }
    handleNoteChange(e){
        this.setState({
            note: e.currentTarget.value,
        });
    }
    adjustListTitleInDB(){
        let ref = db.collection("members").doc(this.props.uid).collection("lists");
        ref.doc(this.state.listId).update({title:this.state.note}).then(()=>{console.log('update title')})
    }
    deleteListInDB(){
        if (this.deleteConfirm()){
            let ref = db.collection("members").doc(this.props.uid).collection("lists");
            ref.doc(this.state.listId).delete().then(()=>{
                this.setState({redirect:true});
                this.props.getListFromDB();
            })
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
        this.setState(preState=>{
            let showPieChart = preState.showPieChart;
            return{
                showPieChart: !showPieChart 
            }
        })
        
    }
    componentDidMount(){
        this.setState({
            showWhichList:this.props.showWhichList
        })
        this.getListDBdata();
    }
    componentDidUpdate(preProps){
        if(preProps.showWhichList !== this.props.showWhichList){
            this.setState({
                showWhichList:this.props.showWhichList
            })
            this.getListDBdata();
        }
    }

    getListDBdata(){
        let doneList = [];
        let undoneList = [];
        let pieChartData = [['Task', 'Spending Hours']];
        let ref = db.collection("members").doc(this.props.uid);
        // 搜尋lists
        ref.collection("lists").where("title","==",this.props.showWhichList).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                this.setState(preState=>{
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
                doneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
                pieChartData.push([doc.data().title, parseFloat(doc.data().timer)]);
            })
            this.setState({
                doneList:doneList,
                pieChartData: pieChartData
            });
        })
        // 搜尋todos:undone
        ref.collection("todos").where("list","==",this.props.showWhichList).where("isDone","==",false).get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                undoneList.push({
                    title: doc.data().title,
                    timer: doc.data().timer
                });
                pieChartData.push([doc.data().title, parseFloat(doc.data().timer)]);
            })
            this.setState({
                undoneList:undoneList,
                pieChartData: pieChartData
            })
        })
    }
    autoHeight(){
        let x = this.testHeight.current;
        x.style.height = 'auto';
        x.style.height = x.scrollHeight + "px";
    }
    render(){
        
        let {theme} = this.props;
        let undoneTotalTime=0;
        let undoneTimer = this.state.undoneList.map((undone,index)=>{
            undoneTotalTime+=parseFloat(undone.timer);
        })
        let doneTotalTime=0;
        let doneTimer = this.state.doneList.map((done,index)=>{
            doneTotalTime+=parseFloat(done.timer);
        })
        let createdAt = this.state.createdAt;
        let doneList = this.state.doneList.map((doneItem,index)=><div className={`listLi listLi_${theme}`} key={index}>
                <div>
                    <span className="doneCircle"><i className="fas fa-circle"/></span>
                    <span>{doneItem.title}</span>
                </div>
                <div>{doneItem.timer}hr</div>
            </div>)
        let undoneList = this.state.undoneList.map((undoneItem,index)=><div className={`listLi listLi_${theme}`} key={index}>
                <div>
                    <span className="doneCircle"><i className="far fa-circle"/></span>
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
        
        let pieChart = <Chart
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
                    <textarea ref={this.testHeight} rows="1" onInput={this.autoHeight} className={`listTitleName listTN_${theme}`} defaultValue={this.state.showWhichList} onChange={this.handleNoteChange}/>
                    <span className="listTitleIcon" data-enter="titleName" onKeyDown={this.enterClick}>
                        <span className={`listIcon_${theme}`} ref={this.adjsutLis} onClick={this.adjustListTitleInDB}><i className="fas fa-pen"></i></span>
                        <span className={`listIcon_${theme}`} onClick={this.deleteListInDB}><i className="fas fa-trash"></i></span>
                    </span>
                </div>
                <div className={`listInfo listInfo_${theme}`}>
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
                <div className={`list list_${theme}`}>
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
                <div className={`list list_${theme}`}>
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
                <div className={`bgc bgc_${theme}`}></div>
            </div>
        let listpage = <div><Link to='/dashboard'>
                <div className={`btDashboardbtn btDash_${theme}`}>
                    <span className="btDashboardbtn1"><i className="fas fa-caret-left"></i></span>
                    <span className="btDashboardbtn2">DASHBOARD</span>
                </div>
            </Link>
            {listBoard}</div>
        let reDirect = <Redirect to={"/dashboard"}/>
        return <div>
            {this.state.redirect? reDirect:listpage}
            
        </div>
    }
    
}
export default List;