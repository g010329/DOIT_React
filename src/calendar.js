import React from "react";
class Calendar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            calendarType: 'month', // 種類month week day 
            year: 2020,
            month: 7,
            firstDateDay:3,
            thisMonthDates:31
        };
        this.week = this.week.bind(this);
    }

    week(){
        for(let i; i<firstDateDay-1; i++){
            return <td></td>
        }
        for(let i; i<7-firstDateDay; i++){
            return <td>{i+1}</td>
        }
        
    }

    render(){
        let day = 3;
        let week;


        return <div>
            <div className="calencalen">
                <div className="calenTitle">
                <div><i className="fas fa-angle-left"></i></div>
                <div>2020</div>
                <div><i className="fas fa-angle-right"></i></div>
            </div>
                <div className="calenBoard">
                <table className="calenMonth">
                    <tbody>
                        <tr>
                            <td>
                                <button>JAN</button>
                            </td>
                            <td>
                                <button>FEB</button>
                            </td>
                            <td>
                                <button>MAR</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>APR</button>
                            </td>
                            <td>
                                <button>MAY</button>
                            </td>
                            <td>
                                <button>JUN</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>JUL</button>
                            </td>
                            <td>
                                <button>AUG</button>
                            </td>
                            <td>
                                <button>SEP</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>OCT</button>
                            </td>
                            <td>
                                <button>NOV</button>
                            </td>
                            <td>
                                <button>DEC</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            <div className="calencalen">
                <div className="calenTitle">
                <div><i className="fas fa-angle-left"></i></div>
                <div>July 2020</div>
                <div><i className="fas fa-angle-right"></i></div>
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
                        <tr>{this.week}</tr>
                        {/* <tr>
                            <td></td>
                            <td></td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>11</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>13</td>
                            <td>14</td>
                            <td>15</td>
                            <td>16</td>
                            <td>17</td>
                            <td>18</td>
                            <td>19</td>
                        </tr>
                        <tr>
                            <td>20</td>
                            <td>21</td>
                            <td>22</td>
                            <td>23</td>
                            <td>24</td>
                            <td>25</td>
                            <td>26</td>
                        </tr>
                        <tr>
                            <td>27</td>
                            <td>28</td>
                            <td>29</td>
                            <td>30</td>
                            <td>31</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    }
}
export default Calendar;