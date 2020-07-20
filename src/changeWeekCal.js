import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class ChangeWeekCal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            calYear: new Date().getFullYear(),
            calMonth: new Date().getMonth(),
            calFirstDateDay: new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-1`).getDay(), //1~7
            calDatesOfMonth: new Date(new Date().getFullYear(),new Date().getMonth(),0).getDate(), //28~31
            wCalYear: new Date().getFullYear(),
            wCalMonth: new Date().getMonth(),
            wCalDate:15,
            wCalWeek:28,
        };
        this.calMonthForward = this.calMonthForward.bind(this);
        this.calMonthBackward = this.calMonthBackward.bind(this);
    }
    calMonthForward(){
        this.setState(preState=>{
            let calMonth = preState.calMonth;
            let calYear = preState.calYear;
            if (calMonth<11){
                // console.log(calYear,calMonth+1,new Date(calYear,calMonth+1,0).getDate());
                return{
                    calMonth: calMonth+1,
                    calDatesOfMonth: new Date(calYear,calMonth+2,0).getDate(),
                    calFirstDateDay: new Date(`${calYear}-${calMonth+2}-1`).getDay()

                }
            }else{
                // console.log(calYear+1,0, new Date(calYear+1,0,0).getDate());
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
            let calMonth = preState.calMonth;
            let calYear = preState.calYear;
            if(calMonth==0){
                // console.log(calYear-1,11,new Date(calYear-1,0,0).getDate());
                return{
                    calYear: calYear-1,
                    calMonth: 11,
                    calDatesOfMonth: new Date(calYear-1,1,0).getDate(),
                    calFirstDateDay: new Date(`${calYear-1}-1-1`).getDay()
                }
            }else{
                // console.log(calYear,calMonth-1,new Date(calYear,calMonth-1,0).getDate());
                return{
                    calMonth: calMonth-1,
                    calDatesOfMonth: new Date(calYear,calMonth,0).getDate(),
                    calFirstDateDay: new Date(`${calYear}-${calMonth}-1`).getDay()
                }
            }
        })
    }

    render(){
        let day = this.state.calFirstDateDay-1;
        let calDatesOfMonth = this.state.calDatesOfMonth;
        let eachMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let wCalen = <div className="wcalentype">
                <div className="calenTitle">
                <div onClick={this.calMonthBackward}><i className="fas fa-angle-left"></i></div>
                <div>{eachMonth[this.state.calMonth]} {this.state.calYear}</div>
                <div onClick={this.calMonthForward}><i className="fas fa-angle-right"></i></div>
            </div>
                <div className="calenBoard">
                <table>
                    <thead>
                        <tr>
                            <th>M</th>
                            <th>T</th>
                            <th>W</th>
                            <th>T</th>
                            <th>F</th>
                            <th>S</th>
                            <th>S</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>{this.week}</tr> */}
                        <tr>
                            <td onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,1-day,999)}>{(1-day)>0? 1-day : ''}</td>
                            <td className="darktd">{(2-day)>0? 2-day : ''}</td>
                            <td className="darktd">{(3-day)>0? 3-day : ''}</td>
                            <td className="darktd">{(4-day)>0? 4-day : ''}</td>
                            <td className="darktd">{(5-day)>0? 5-day : ''}</td>
                            <td className="darktd">{(6-day)>0? 6-day : ''}</td>
                            <td className="darktd">{7-day}</td>
                        </tr>
                        <tr>
                            <td className="weektd" data-value={8-day} onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,8-day,999)}>{8-day}</td>
                            <td className="darktd">{9-day}</td>
                            <td className="darktd">{10-day}</td>
                            <td className="darktd">{11-day}</td>
                            <td className="darktd">{12-day}</td>
                            <td className="darktd">{13-day}</td>
                            <td className="darktd">{14-day}</td>
                        </tr>
                        <tr>
                            <td className="weektd" data-value={15-day} onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,15-day,999)}>{15-day}</td>
                            <td className="darktd">{16-day}</td>
                            <td className="darktd">{17-day}</td>
                            <td className="darktd">{18-day}</td>
                            <td className="darktd">{19-day}</td>
                            <td className="darktd">{20-day}</td>
                            <td className="darktd">{21-day}</td>
                        </tr>
                        <tr>
                            <td className="weektd" data-value={22-day} onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,22-day,999)}>{22-day}</td>
                            <td className="darktd">{23-day}</td>
                            <td className="darktd">{24-day}</td>
                            <td className="darktd">{25-day}</td>
                            <td className="darktd">{26-day}</td>
                            <td className="darktd">{27-day}</td>
                            <td className="darktd">{28-day}</td>
                        </tr>
                        <tr>
                            <td className="weektd" data-value={29-day} onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,29-day,999)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                            <td className="darktd">{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                            <td className="darktd">{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                            <td className="darktd">{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                            <td className="darktd">{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                            <td className="darktd">{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                            <td className="darktd">{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                        </tr>
                        <tr>
                            <td className="weektd" data-value={36-day} onClick={()=>this.props.changeWeek(this.state.wCalYear,this.state.wCalMonth,36-day,999)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                            <td className="darktd">{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
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
        return <div className="showCalenW">
            {wCalen}
        </div>
        
    }
}
export default ChangeWeekCal;
