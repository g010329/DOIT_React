import React from "react";
import LogTitle from "./dayLogTitle.js";
import renderer from 'react-test-renderer';

test("Test LogTitle Component", ()=>{
    let today = new Date();
    let tree = renderer.create(
        <LogTitle data={
            {state:{year:today.getFullYear(),month:today.getMonth(),date:today.getDate(),theme:'dk'},
            method:{
                ifChangeDate:()=>{},
                handleDateBackward:()=>{},
                handleDateForward:()=>{},
                toggleIfInput:()=>{}
            }}}
        />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(
        <LogTitle data={
            {state:{year:2020,month:8,date:1,theme:'dk'},
            method:{
                ifChangeDate:()=>{},
                handleDateBackward:()=>{},
                handleDateForward:()=>{},
                toggleIfInput:()=>{}
            }}}
        />).toJSON();
    expect(tree).toMatchSnapshot();
});