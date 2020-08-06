import React from "react";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
class ChangeMonthCal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            yCalYear: new Date().getFullYear(), 
        };
        this.yCalYearForward = this.yCalYearForward.bind(this);
        this.yCalYearBackward = this.yCalYearBackward.bind(this);
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
    render(){
        let yCalen = <div  className="calentype popUp">
                <div className="calenTitle popUp">
                    <div onClick={this.yCalYearBackward}><i className="fas fa-angle-left popUp"></i></div>
                    <div className="calenTM popUp">{this.state.yCalYear}</div>
                    <div onClick={this.yCalYearForward}><i className="fas fa-angle-right popUp"></i></div>
                </div>
                <div className="calenBoard popUp">
                    <table className="calenMonth">
                        <tbody>
                            <tr>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,0)}}>
                                    <button>JAN</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,1)}}>
                                    <button>FEB</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,2)}}>
                                    <button>MAR</button>
                                </td>
                            </tr>
                            <tr>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,3)}}>
                                    <button>APR</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,4)}}>
                                    <button>MAY</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,5)}}>
                                    <button>JUN</button>
                                </td>
                            </tr>
                            <tr>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,6)}}>
                                    <button>JUL</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,7)}}>
                                    <button>AUG</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,8)}}>
                                    <button>SEP</button>
                                </td>
                            </tr>
                            <tr>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,9)}}>
                                    <button>OCT</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,10)}}>
                                    <button>NOV</button>
                                </td>
                                <td onClick={()=>{this.props.changeMonth(this.state.yCalYear,11)}}>
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
