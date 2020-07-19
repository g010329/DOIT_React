import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class Calendar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            calenType: 'week', // 種類month week day 
            //年曆
            yCalYear: 2020, 
            //日曆
            calYear: new Date().getFullYear(),
            calMonth: new Date().getMonth(),
            calFirstDateDay: new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-1`).getDay(), //1~7
            calDatesOfMonth: new Date(new Date().getFullYear(),new Date().getMonth(),0).getDate(), //28~31
            //週曆
            wCalYear: new Date().getFullYear(),
            wCalMonth: new Date().getMonth(),
            wCalDate:15,
            wCalWeek:28,
        };
        // ----
        this.calMonthForward = this.calMonthForward.bind(this);
        this.calMonthBackward = this.calMonthBackward.bind(this);
        this.yCalYearForward = this.yCalYearForward.bind(this);
        this.yCalYearBackward = this.yCalYearBackward.bind(this);
        // ----
        this.changeMonth = this.changeMonth.bind(this);
        this.changeDate = this.changeDate.bind(this);
        //
        this.setCalenType = this.setCalenType.bind(this);
        this.getWeekNumber= this.getWeekNumber.bind(this);
    }
    yCalYearForward(){
        this.setState(preState=>{
            let yCalYear = preState.yCalYear;
            return{
                yCalYear: yCalYear+1
            }
        })
    }
    yCalYearBackward(){
        this.setState(preState=>{
            let yCalYear = preState.yCalYear;
            return{
                yCalYear: yCalYear-1
            }
        })
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
    calWeekForward(){
        this.setState(preState=>{
            let calMonth = preState.calMonth;
            let calYear = preState.calYear;
            if (calMonth<11){
                // console.log(calYear,calMonth+1,new Date(calYear,calMonth+1,0).getDate());
                return{
                    wCalMonth: wCalMonth+1,
                    wCalDatesOfMonth: new Date(wCalYear,wCalMonth+2,0).getDate(),
                    wCalFirstDateDay: new Date(`${wCalYear}-${wCalMonth+2}-1`).getDay()

                }
            }else{
                // console.log(calYear+1,0, new Date(calYear+1,0,0).getDate());
                return{
                    wCalYear: wCalYear+1,
                    wCalMonth: 0,
                    // wCalDatesOfMonth: new Date(wCalYear+1,1,0).getDate(),
                    // wCalFirstDateDay: new Date(`${wCalYear+1}-1-1`).getDay(),
                }
            }
        })
    }
    calWeekBackward(){
        this.setState(preState=>{
            let wCalMonth = preState.wCalMonth;
            let wCalYear = preState.wCalYear;
            if(wCalMonth==0){
                // console.log(calYear-1,11,new Date(calYear-1,0,0).getDate());
                return{
                    wCalYear: calYear-1,
                    wCalMonth: 11,
                    wCalDatesOfMonth: new Date(wCalYear-1,1,0).getDate(),
                    wCalFirstDateDay: new Date(`${wCalYear-1}-1-1`).getDay()
                }
            }else{
                // console.log(calYear,calMonth-1,new Date(calYear,calMonth-1,0).getDate());
                return{
                    wCalMonth: calMonth-1,
                    wCalDatesOfMonth: new Date(calYear,calMonth,0).getDate(),
                    wCalFirstDateDay: new Date(`${calYear}-${calMonth}-1`).getDay()
                }
            }
        })
    }
    changeMonth(e){
        let {yCalYear} = this.state;
        let newMonth = parseInt(e.currentTarget.getAttribute("data-monthval"));
        console.log(yCalYear,newMonth);
    }
    changeDate(e){
        let calYear = this.state.calYear;
        let calMonth = this.state.calMonth;
        let calDatesOfMonth = this.state.calDatesOfMonth;
        let newDate = parseInt(e.currentTarget.getAttribute("data-value"));
        //擋掉日期<0跟>天數
        if( 0<newDate && newDate<=calDatesOfMonth ){
            console.log(calYear,calMonth,newDate);
        }
        
    }
    // changeWeek(e){
    //     let wCalYear = this.state.wCalYear;
    //     let wCalMonth = this.state.wCalMonth;
    //     let wCalDate = this.state.wCalDate;
    //     let wCalWeek =this.state.wCalWeek;
    //     console.log(wCalYear,wCalMonth,wCalDate);
    // }
    setCalenType(e){
        let calenType = e.currentTarget.getAttribute("data-calenType");
        // console.log(calenType);
        this.setState(preState=>{
            console.log('換曆',calenType);
            return{
                calenType:calenType
            }
        })
    }
    getWeekNumber(d) {
        console.log(d);
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return [d.getUTCFullYear(), weekNo];
    }
    render(){
        let day = this.state.calFirstDateDay-1;
        let calDatesOfMonth = this.state.calDatesOfMonth;
        let eachMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let yCalen = <div className="calentype">
                <div className="calenTitle">
                    <div onClick={this.yCalYearBackward}><i className="fas fa-angle-left"></i></div>
                    <div>{this.state.yCalYear}</div>
                    <div onClick={this.yCalYearForward}><i className="fas fa-angle-right"></i></div>
                </div>
                <div className="calenBoard">
                <table className="calenMonth">
                    <tbody>
                        <tr>
                            <td data-monthval={0} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,0,0,0)}}>
                                <button>JAN</button>
                            </td>
                            <td data-monthval={1} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,1,0,0)}}>
                                <button>FEB</button>
                            </td>
                            <td data-monthval={2} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,2,0,0)}}>
                                <button>MAR</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-monthval={3} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,3,0,0)}}>
                                <button>APR</button>
                            </td>
                            <td data-monthval={4} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,4,0,0)}}>
                                <button>MAY</button>
                            </td>
                            <td data-monthval={5} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,5,0,0)}}>
                                <button>JUN</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-monthval={6} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,6,0,0)}}>
                                <button>JUL</button>
                            </td>
                            <td data-monthval={7} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,7,0,0)}}>
                                <button>AUG</button>
                            </td>
                            <td data-monthval={8} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,8,0,0)}}>
                                <button>SEP</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-monthval={9} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,9,0,0)}}>
                                <button>OCT</button>
                            </td>
                            <td data-monthval={10} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,10,0,0)}}>
                                <button>NOV</button>
                            </td>
                            <td data-monthval={11} onClick={this.changeMonth} onClick={()=>{this.props.calenUpdateTime(this.state.yCalYear,11,0,0)}}>
                                <button>DEC</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        
        let wCalen = <div className="calentype">
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
                                <td data-value={1-day} onClick={this.changeWeek} onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,1-day,999)}>{(1-day)>0? 1-day : ''}</td>
                                <td>{(2-day)>0? 2-day : ''}</td>
                                <td>{(3-day)>0? 3-day : ''}</td>
                                <td>{(4-day)>0? 4-day : ''}</td>
                                <td>{(5-day)>0? 5-day : ''}</td>
                                <td>{(6-day)>0? 6-day : ''}</td>
                                <td>{7-day}</td>
                            </tr>
                            <tr>
                                <td data-value={8-day} onClick={this.changeWeek} onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,8-day,999)}>{8-day}</td>
                                <td>{9-day}</td>
                                <td>{10-day}</td>
                                <td>{11-day}</td>
                                <td>{12-day}</td>
                                <td>{13-day}</td>
                                <td>{14-day}</td>
                            </tr>
                            <tr>
                                <td data-value={15-day} onClick={this.changeWeek}  onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,15-day,999)}>{15-day}</td>
                                <td>{16-day}</td>
                                <td>{17-day}</td>
                                <td>{18-day}</td>
                                <td>{19-day}</td>
                                <td>{20-day}</td>
                                <td>{21-day}</td>
                            </tr>
                            <tr>
                                <td data-value={22-day}  onClick={this.changeWeek} onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,22-day,999)}>{22-day}</td>
                                <td>{23-day}</td>
                                <td>{24-day}</td>
                                <td>{25-day}</td>
                                <td>{26-day}</td>
                                <td>{27-day}</td>
                                <td>{28-day}</td>
                            </tr>
                            <tr>
                                <td data-value={29-day} onClick={this.changeWeek}onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,29-day,999)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                                <td>{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                                <td>{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                                <td>{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                                <td>{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                                <td>{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                                <td>{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                            </tr>
                            <tr>
                                <td data-value={36-day}onClick={this.changeWeek} onClick={()=>this.props.calenUpdateTime(this.state.wCalYear,this.state.wCalMonth,36-day,999)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                                <td>{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
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
        let mCalen = <div className="calentype">
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
                                <td data-value={1-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,1-day,0)}>{(1-day)>0? 1-day : ''}</td>
                                <td data-value={2-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,2-day,0)}>{(2-day)>0? 2-day : ''}</td>
                                <td data-value={3-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,3-day,0)}>{(3-day)>0? 3-day : ''}</td>
                                <td data-value={4-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,4-day,0)}>{(4-day)>0? 4-day : ''}</td>
                                <td data-value={5-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,5-day,0)}>{(5-day)>0? 5-day : ''}</td>
                                <td data-value={6-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,6-day,0)}>{(6-day)>0? 6-day : ''}</td>
                                <td data-value={7-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,7-day,0)}>{7-day}</td>
                            </tr>
                            <tr>
                                <td data-value={8-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,8-day,0)}>{8-day}</td>
                                <td data-value={9-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,9-day,0)}>{9-day}</td>
                                <td data-value={10-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,10-day,0)}>{10-day}</td>
                                <td data-value={11-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,11-day,0)}>{11-day}</td>
                                <td data-value={12-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,12-day,0)}>{12-day}</td>
                                <td data-value={13-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,13-day,0)}>{13-day}</td>
                                <td data-value={14-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,14-day,0)}>{14-day}</td>
                            </tr>
                            <tr>
                                <td data-value={15-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,15-day,0)}>{15-day}</td>
                                <td data-value={16-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,16-day,0)}>{16-day}</td>
                                <td data-value={17-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,17-day,0)}>{17-day}</td>
                                <td data-value={18-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,18-day,0)}>{18-day}</td>
                                <td data-value={19-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,19-day,0)}>{19-day}</td>
                                <td data-value={20-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,20-day,0)}>{20-day}</td>
                                <td data-value={21-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,21-day,0)}>{21-day}</td>
                            </tr>
                            <tr>
                                <td data-value={22-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,22-day,0)}>{22-day}</td>
                                <td data-value={23-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,23-day,0)}>{23-day}</td>
                                <td data-value={24-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,24-day,0)}>{24-day}</td>
                                <td data-value={25-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,25-day,0)}>{25-day}</td>
                                <td data-value={26-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,26-day,0)}>{26-day}</td>
                                <td data-value={27-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,27-day,0)}>{27-day}</td>
                                <td data-value={28-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,28-day,0)}>{28-day}</td>
                            </tr>
                            <tr>
                                <td data-value={29-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,29-day,0)}>{(29-day)<=calDatesOfMonth? 29-day : ''}</td>
                                <td data-value={30-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,30-day,0)}>{(30-day)<=calDatesOfMonth? 30-day : ''}</td>
                                <td data-value={31-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,31-day,0)}>{(31-day)<=calDatesOfMonth? 31-day : ''}</td>
                                <td data-value={32-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,32-day,0)}>{(32-day)<=calDatesOfMonth? 32-day : ''}</td>
                                <td data-value={33-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,33-day,0)}>{(33-day)<=calDatesOfMonth? 33-day : ''}</td>
                                <td data-value={34-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,34-day,0)}>{(34-day)<=calDatesOfMonth? 34-day : ''}</td>
                                <td data-value={35-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,35-day,0)}>{(35-day)<=calDatesOfMonth? 35-day : ''}</td>
                            </tr>
                            <tr>
                                <td data-value={36-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,36-day,0)}>{(36-day)<=calDatesOfMonth? 36-day : ''}</td>
                                <td data-value={37-day} onClick={this.changeDate} onClick={()=>this.props.calenUpdateTime(this.state.calYear,this.state.calMonth,37-day,0)}>{(37-day)<=calDatesOfMonth? 37-day : ''}</td>
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
                <div data-calentype='day' onClick={this.setCalenType}>DAY</div>
                <div data-calentype='week' onClick={this.setCalenType}>WEEK</div>
                <div data-calentype='month' onClick={this.setCalenType}>MONTH</div>
            </div>
                {this.state.calenType=='month'? yCalen : ''}
                {this.state.calenType=='week'? wCalen : ''}
                {this.state.calenType=='day'? mCalen : ''}
        </div>
    }
}


export default Calendar;