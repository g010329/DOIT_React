import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class ChangeMonthCal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            yCalYear: 2020, 
        };
        this.yCalYearForward = this.yCalYearForward.bind(this);
        this.yCalYearBackward = this.yCalYearBackward.bind(this);
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
    render(){
        let yCalen = <div  className="calentype">
                <div className="calenTitle">
                    <div onClick={this.yCalYearBackward}><i className="fas fa-angle-left"></i></div>
                    <div className="calenTM">{this.state.yCalYear}</div>
                    <div onClick={this.yCalYearForward}><i className="fas fa-angle-right"></i></div>
                </div>
                <div className="calenBoard">
                    <table className="calenMonth">
                        <tbody>
                            <tr>
                                <td data-monthval={0} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,0)}}>
                                    <button>JAN</button>
                                </td>
                                <td data-monthval={1} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,1)}}>
                                    <button>FEB</button>
                                </td>
                                <td data-monthval={2} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,2)}}>
                                    <button>MAR</button>
                                </td>
                            </tr>
                            <tr>
                                <td data-monthval={3} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,3)}}>
                                    <button>APR</button>
                                </td>
                                <td data-monthval={4} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,4)}}>
                                    <button>MAY</button>
                                </td>
                                <td data-monthval={5} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,5)}}>
                                    <button>JUN</button>
                                </td>
                            </tr>
                            <tr>
                                <td data-monthval={6} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,6)}}>
                                    <button>JUL</button>
                                </td>
                                <td data-monthval={7} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,7)}}>
                                    <button>AUG</button>
                                </td>
                                <td data-monthval={8} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,8)}}>
                                    <button>SEP</button>
                                </td>
                            </tr>
                            <tr>
                                <td data-monthval={9} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,9)}}>
                                    <button>OCT</button>
                                </td>
                                <td data-monthval={10} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,10)}}>
                                    <button>NOV</button>
                                </td>
                                <td data-monthval={11} onClick={this.changeMonth} onClick={()=>{this.props.changeMonth(this.state.yCalYear,11)}}>
                                    <button>DEC</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        return <div className="showCalenM">
            {yCalen}
        </div>
        
    }
}
export default ChangeMonthCal;
