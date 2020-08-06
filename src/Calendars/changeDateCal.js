import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class ChangeDateCal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            calYear: new Date().getFullYear(),
            calMonth: new Date().getMonth(),
            calFirstDateDay: new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-1`).getDay(), //1~7
            calDatesOfMonth: new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(), //28~31
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
                    calDatesOfMonth: new Date(calYear-1,12,0).getDate(),
                    calFirstDateDay: new Date(`${calYear-1}-12-1`).getDay()
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
        if(day==-1){
            day=6;
        }
        console.log(day,this.state.calFirstDateDay);
        let calDatesOfMonth = this.state.calDatesOfMonth;
        let eachMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let mCalen = <div className="calentype popUp">
                <div className="calenTitle popUp">
                    <div className="popUp" onClick={this.calMonthBackward}><i className="fas fa-angle-left popUp"></i></div>
                    <div className="popUp">{eachMonth[this.state.calMonth]} {this.state.calYear}</div>
                    <div className="popUp" onClick={this.calMonthForward}><i className="fas fa-angle-right popUp"></i></div>
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
                            {/* <tr>{this.week}</tr> */}
                            <tr>
                                <td className="datetd" data-value={1-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,1-day)}>{(1-day)>0? 1-day : ''}</td>
                                <td className="datetd" data-value={2-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,2-day)}>{(2-day)>0? 2-day : ''}</td>
                                <td className="datetd" data-value={3-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,3-day)}>{(3-day)>0? 3-day : ''}</td>
                                <td className="datetd" data-value={4-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,4-day)}>{(4-day)>0? 4-day : ''}</td>
                                <td className="datetd" data-value={5-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,5-day)}>{(5-day)>0? 5-day : ''}</td>
                                <td className="datetd" data-value={6-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,6-day)}>{(6-day)>0? 6-day : ''}</td>
                                <td className="datetd" data-value={7-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,7-day)}>{(7-day)>0? 7-day : ''}</td>
                            </tr>
                            <tr>
                                <td className="datetd" data-value={8-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,8-day)}>{8-day}</td>
                                <td className="datetd" data-value={9-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,9-day)}>{9-day}</td>
                                <td className="datetd" data-value={10-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,10-day)}>{10-day}</td>
                                <td className="datetd" data-value={11-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,11-day)}>{11-day}</td>
                                <td className="datetd" data-value={12-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,12-day)}>{12-day}</td>
                                <td className="datetd" data-value={13-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,13-day)}>{13-day}</td>
                                <td className="datetd" data-value={14-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,14-day)}>{14-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" data-value={15-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,15-day)}>{15-day}</td>
                                <td className="datetd" data-value={16-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,16-day)}>{16-day}</td>
                                <td className="datetd" data-value={17-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,17-day)}>{17-day}</td>
                                <td className="datetd" data-value={18-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,18-day)}>{18-day}</td>
                                <td className="datetd" data-value={19-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,19-day)}>{19-day}</td>
                                <td className="datetd" data-value={20-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,20-day)}>{20-day}</td>
                                <td className="datetd" data-value={21-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,21-day)}>{21-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" data-value={22-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,22-day)}>{22-day}</td>
                                <td className="datetd" data-value={23-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,23-day)}>{23-day}</td>
                                <td className="datetd" data-value={24-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,24-day)}>{24-day}</td>
                                <td className="datetd" data-value={25-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,25-day)}>{25-day}</td>
                                <td className="datetd" data-value={26-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,26-day)}>{26-day}</td>
                                <td className="datetd" data-value={27-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,27-day)}>{27-day}</td>
                                <td className="datetd" data-value={28-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,28-day)}>{28-day}</td>
                            </tr>
                            <tr>
                                <td className="datetd" data-value={29-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,29-day)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                                <td className="datetd" data-value={30-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,30-day)}>{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                                <td className="datetd" data-value={31-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,31-day)}>{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                                <td className="datetd" data-value={32-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,32-day)}>{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                                <td className="datetd" data-value={33-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,33-day)}>{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                                <td className="datetd" data-value={34-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,34-day)}>{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                                <td className="datetd" data-value={35-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,35-day)}>{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                            </tr>
                            <tr>
                                <td className="datetd" data-value={36-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,36-day)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                                <td className="datetd" data-value={37-day} onClick={()=>this.props.changeDate(this.state.calYear,this.state.calMonth,37-day)}>{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
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
        
        return <div className="showCalenD">
            {mCalen}
        </div>
        
    }
}
export default ChangeDateCal;
