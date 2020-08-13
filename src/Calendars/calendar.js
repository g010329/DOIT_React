import React from "react";
import * as firebase from "firebase";
import {countWeekNum,handleValidation} from '../util.js';
import 'firebase/auth';
import 'firebase/database';
class Calendar extends React.Component{
    constructor(props){
        super(props);
        let today = new Date();
        this.state={
            calenType: 'day', // 種類month week day 
            //年曆
            yCalYear: today.getFullYear(), 
            //日曆
            calYear: today.getFullYear(),
            calMonth: today.getMonth(),
            calFirstDateDay: new Date(`${today.getFullYear()}-${today.getMonth()+1}-1`).getDay(), //1~7
            calDatesOfMonth: new Date(today.getFullYear(),today.getMonth()+1,0).getDate(), //28~31
            //週曆
            wCalYear: today.getFullYear(),
            wCalMonth: today.getMonth(),
        };
        this.calWeekForward = this.calWeekForward.bind(this);
        this.calWeekBackward = this.calWeekBackward.bind(this);
        this.calMonthForward = this.calMonthForward.bind(this);
        this.calMonthBackward = this.calMonthBackward.bind(this);
        this.yCalYearForward = this.yCalYearForward.bind(this);
        this.yCalYearBackward = this.yCalYearBackward.bind(this);
        this.setCalenType = this.setCalenType.bind(this);
    }
    yCalYearForward(){
        this.setState(preState=>{
            return{
                yCalYear: preState.yCalYear + 1
            }
        })
    }
    yCalYearBackward(){
        this.setState(preState=>{
            return{
                yCalYear: preState.yCalYear - 1
            }
        })
    }
    calMonthForward(){
        this.setState(preState=>{
            let {calYear, calMonth} = preState;
            if (calMonth<11){
                return{
                    calMonth: calMonth+1,
                    calDatesOfMonth: new Date(calYear,calMonth+2,0).getDate(),
                    calFirstDateDay: new Date(`${calYear}-${calMonth+2}-1`).getDay()
                }
            }else{
                return{
                    calYear: calYear+1,
                    calMonth: 0,
                    calDatesOfMonth: new Date(calYear+1,1,0).getDate(),
                    calFirstDateDay: new Date(`${calYear+1}-1-1`).getDay()
                }
            }
        })
    }

    calMonthBackward(){
        this.setState(preState=>{
            let {calYear, calMonth} = preState;
            if(calMonth==0){
                return{
                    calYear: calYear-1,
                    calMonth: 11,
                    calDatesOfMonth: new Date(calYear-1,1,0).getDate(),
                    calFirstDateDay: new Date(`${calYear-1}-1-1`).getDay()
                }
            }else{
                return{
                    calMonth: calMonth-1,
                    calDatesOfMonth: new Date(calYear,calMonth,0).getDate(),
                    calFirstDateDay: new Date(`${calYear}-${calMonth}-1`).getDay()
                }
            }
        })
    }
    calWeekForward(){
        this.setState(preState=>{
            let {wCalYear, wCalMonth} = preState;
            if (wCalMonth<11){
                return{
                    wCalMonth: wCalMonth+1,
                    calDatesOfMonth: new Date(wCalYear,wCalMonth+2,0).getDate(),
                    calFirstDateDay: new Date(`${wCalYear}-${wCalMonth+2}-1`).getDay()
                }
            }else{
                return{
                    wCalYear: wCalYear+1,
                    wCalMonth: 0
                }
            }
        })
    }
    calWeekBackward(){
        this.setState(preState=>{
            let {wCalYear, wCalMonth} = preState;
            if(wCalMonth==0){
                return{
                    wCalYear: wCalYear-1,
                    wCalMonth: 11,
                    calDatesOfMonth: new Date(wCalYear-1,1,0).getDate(),
                    calFirstDateDay: new Date(`${wCalYear-1}-1-1`).getDay()
                }
            }else{
                return{
                    wCalMonth: wCalMonth-1,
                    calDatesOfMonth: new Date(wCalYear,wCalMonth,0).getDate(),
                    calFirstDateDay: new Date(`${wCalYear}-${wCalMonth}-1`).getDay()
                }
            }
        })
    }

    setCalenType(e){
        let calenType = e.currentTarget.getAttribute("data-calenType");
        this.setState({
            calenType:calenType
        })
    }

    render(){
        let day = this.state.calFirstDateDay-1;
        if(day == -1){
            day = 6;
        }
        let calDatesOfMonth = this.state.calDatesOfMonth;
        let eachMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let yCalen = <div className="calentype popUp">
                <div className="calenTitle popUp">
                    <div className="popUp" onClick={this.yCalYearBackward}><i className="fas fa-angle-left popUp"></i></div>
                    <div className="calenTM popUp">{this.state.yCalYear}</div>
                    <div className="popUp" onClick={this.yCalYearForward}><i className="fas fa-angle-right popUp"></i></div>
                </div>
                <div className="calenBoard popUp">
                <table className="calenMonth">
                    <tbody>
                        <tr>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,0,999,0)}}>
                                <button>JAN</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,1,999,0)}}>
                                <button>FEB</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,2,999,0)}}>
                                <button>MAR</button>
                            </td>
                        </tr>
                        <tr>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,3,999,0)}}>
                                <button>APR</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,4,999,0)}}>
                                <button>MAY</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,5,999,0)}}>
                                <button>JUN</button>
                            </td>
                        </tr>
                        <tr>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,6,999,0)}}>
                                <button>JUL</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,7,999,0)}}>
                                <button>AUG</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,8,999,0)}}>
                                <button>SEP</button>
                            </td>
                        </tr>
                        <tr>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,9,999,0)}}>
                                <button>OCT</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,10,999,0)}}>
                                <button>NOV</button>
                            </td>
                            <td onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,11,999,0)}}>
                                <button>DEC</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        
        let wCalen = <div className="calentype popUp">
                <div className="calenTitle popUp">
                    <div className="popUp" onClick={this.calWeekBackward}><i className="fas fa-angle-left popUp"></i></div>
                    <div className="calenTM popUp">{eachMonth[this.state.wCalMonth]} {this.state.wCalYear}</div>
                    <div className="popUp" onClick={this.calWeekForward}><i className="fas fa-angle-right popUp" ></i></div>
                </div>
                <div className="calenBoard popUp">
                    <table>
                        <thead>
                            <tr>
                                <th className="popUp">M</th>
                                <th className="popUp">T</th>
                                <th className="popUp">W</th>
                                <th className="popUp">T</th>
                                <th className="popUp">F</th>
                                <th className="popUp">S</th>
                                <th className="popUp">S</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,1-day,999)}>{(1-day)>0? 1-day : ''}</td>
                                <td className="darktd">{(2-day)>0? 2-day : ''}</td>
                                <td className="darktd">{(3-day)>0? 3-day : ''}</td>
                                <td className="darktd">{(4-day)>0? 4-day : ''}</td>
                                <td className="darktd">{(5-day)>0? 5-day : ''}</td>
                                <td className="darktd">{(6-day)>0? 6-day : ''}</td>
                                <td className="darktd">{7-day}</td>
                            </tr>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,8-day,999)}>{8-day}</td>
                                <td className="darktd">{9-day}</td>
                                <td className="darktd">{10-day}</td>
                                <td className="darktd">{11-day}</td>
                                <td className="darktd">{12-day}</td>
                                <td className="darktd">{13-day}</td>
                                <td className="darktd">{14-day}</td>
                            </tr>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,15-day,999)}>{15-day}</td>
                                <td className="darktd">{16-day}</td>
                                <td className="darktd">{17-day}</td>
                                <td className="darktd">{18-day}</td>
                                <td className="darktd">{19-day}</td>
                                <td className="darktd">{20-day}</td>
                                <td className="darktd">{21-day}</td>
                            </tr>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,22-day,999)}>{22-day}</td>
                                <td className="darktd">{23-day}</td>
                                <td className="darktd">{24-day}</td>
                                <td className="darktd">{25-day}</td>
                                <td className="darktd">{26-day}</td>
                                <td className="darktd">{27-day}</td>
                                <td className="darktd">{28-day}</td>
                            </tr>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,29-day,999)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                                <td className="darktd">{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                                <td className="darktd">{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                                <td className="darktd">{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                                <td className="darktd">{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                                <td className="darktd">{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                                <td className="darktd">{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                            </tr>
                            <tr>
                                <td className="weektd" onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,36-day,999)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                                <td className="darktd">{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
                                <td className="popUp"></td>
                                <td className="popUp"></td>
                                <td className="popUp"></td>
                                <td className="popUp"></td>
                                <td className="popUp"></td>
                            </tr> 
                        </tbody>
                    </table>
                </div>
            </div>
        let mCalen = <div className="calentype">
                <div className="calenTitle popUp">
                    <div onClick={this.calMonthBackward}><i className="fas fa-angle-left popUp"></i></div>
                    <div className="calenTM popUp">{eachMonth[this.state.calMonth]} {this.state.calYear}</div>
                    <div onClick={this.calMonthForward}><i className="fas fa-angle-right popUp"></i></div>
                </div>
                <div className="calenBoard popUp">
                    <table>
                        <thead>
                            <tr>
                                <th className="popUp">M</th>
                                <th className="popUp">T</th>
                                <th className="popUp">W</th>
                                <th className="popUp">T</th>
                                <th className="popUp">F</th>
                                <th className="popUp">S</th>
                                <th className="popUp">S</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,1-day,0)}>{(1-day)>0? 1-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,2-day,0)}>{(2-day)>0? 2-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,3-day,0)}>{(3-day)>0? 3-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,4-day,0)}>{(4-day)>0? 4-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,5-day,0)}>{(5-day)>0? 5-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,6-day,0)}>{(6-day)>0? 6-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,7-day,0)}>{7-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,8-day,0)}>{8-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,9-day,0)}>{9-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,10-day,0)}>{10-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,11-day,0)}>{11-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,12-day,0)}>{12-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,13-day,0)}>{13-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,14-day,0)}>{14-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,15-day,0)}>{15-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,16-day,0)}>{16-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,17-day,0)}>{17-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,18-day,0)}>{18-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,19-day,0)}>{19-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,20-day,0)}>{20-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,21-day,0)}>{21-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,22-day,0)}>{22-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,23-day,0)}>{23-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,24-day,0)}>{24-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,25-day,0)}>{25-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,26-day,0)}>{26-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,27-day,0)}>{27-day}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,28-day,0)}>{28-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,29-day,0)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,30-day,0)}>{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,31-day,0)}>{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,32-day,0)}>{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,33-day,0)}>{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,34-day,0)}>{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,35-day,0)}>{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                            </tr>
                            <tr>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,36-day,0)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                                <td className="datetd" onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,37-day,0)}>{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr> 
                        </tbody>
                    </table>
                </div>
            </div>
        
        return <div className="showCalen">
            <div className="changeCalen">
                <div className="data-calentype popUp" data-calentype='day' onClick={this.setCalenType}>DAY</div>
                <div className="data-calentype popUp" data-calentype='week' onClick={this.setCalenType}>WEEK</div>
                <div className="data-calentype popUp" data-calentype='month' onClick={this.setCalenType}>MONTH</div>
            </div>
                {this.state.calenType=='month'? yCalen : ''}
                {this.state.calenType=='week'? wCalen : ''}
                {this.state.calenType=='day'? mCalen : ''}
        </div>
    }
}


export default Calendar;