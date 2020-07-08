import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class RenderDayLog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            year: new Date().getFullYear(), //2020
            month: new Date().getMonth(), //7
            date: new Date().getDate(), //3
            thisDayToDos:[
                {"title":1,"index":1,"ifDone":false},
                {"title":2,"index":1,"ifDone":false}
            ],
            ifInput: false,
            note:""
        }
        this.handleDateForward = this.handleDateForward.bind(this);
        this.handleDateBackward = this.handleDateBackward.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.toggleIfInput = this.toggleIfInput.bind(this);
        this.showInput = this.showInput.bind(this);
        this.thisDayToDos = this.addThisDayToDos.bind(this);
        this.addThisDayToDos = this.addThisDayToDos.bind(this);
    }

    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        console.log(e.currentTarget.value);
    }

    addThisDayToDos(){
        console.log('yo');
        this.setState(preState=>{
            let thing = preState.note;
            let thisDayToDos = preState.thisDayToDos;
            let ifInput = preState.ifInput;
            thisDayToDos.push({"title":thing,"index":thisDayToDos.length,"ifDone":false});
            // console.log(list);
            return{
                thisDayToDos:thisDayToDos,
                note:"",
                ifInput:!ifInput
            };
        });
    }

    toggleIfInput(){
        // console.log(this.state.ifInput);
        this.setState(preState=>{
            let ifInput = preState.ifInput;
            ifInput = !ifInput;
            console.log(ifInput);
            return{
                ifInput: ifInput
            }
        });
    }

    showInput(){
        return(
            <div className="month_todo">
                <span>
                    <input type="checkbox" />
                    <input type="text" onChange={this.handleNoteChange}/>
                </span>
                <span className="month_todo_feacture">
                    <span onClick={this.toggleIfInput}>cancel</span>
                    <span onClick={this.addThisDayToDos}>add</span>
                </span>
            </div>
        )
    }

    handleDateForward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()+1);
            newdate = new Date(newdate);
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate()
            }
        });
    }
    handleDateBackward(){
        this.setState(preState=>{
            let year = preState.year;
            let month = preState.month;
            let date = preState.date;
            let newdate = new Date(`${year}-${month+1}-${date}`);
            newdate = newdate.setDate(newdate.getDate()-1);
            newdate = new Date(newdate);
            return{
                year: newdate.getFullYear(),
                month: newdate.getMonth(),
                date: newdate.getDate()
            }
        });
    }

    render(){
        let renderThisDayTodos = this.state.thisDayToDos.map((todo,index)=>
        <div className="month_todo" key={index}>
            <span><input type="checkbox" name="" id=""></input>{todo.title}</span>
            <span className="month_todo_feacture">
                <span><i className="fas fa-angle-double-right"></i></span>
                <span ><i className="fas fa-info-circle"></i></span>
                <span><i className="fas fa-arrows-alt"></i></span>
            </span>
        </div>);
        return <div className="right_board">
        <div className="today_board">
            <div className="month_title">
                <span className="title_month">Today {this.state.month+1}/{this.state.date}</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar"></i></span>
                    <span><i className="fas fa-angle-left"  onClick={this.handleDateBackward}></i></span>
                    <span><i className="fas fa-angle-right" onClick={this.handleDateForward}></i></span>
                    <span><i className="fas fa-plus" onClick={this.toggleIfInput}></i></span>
                </span>
            </div>
            {this.state.ifInput? this.showInput() : ''}
            <div className="month_todos">
                {/* <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div> */}
                {renderThisDayTodos}
            </div>
        </div>
        <div className="overdue_board">
            <div className="month_title">
                <span className="title_month">Overdue</span>
            </div>
            <div className="month_todos">
                <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div>
            </div>
        </div>   
    </div>
    }
}
export default RenderDayLog;