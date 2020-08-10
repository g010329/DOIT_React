import {countWeekNum, format} from "../util.js";

test("Test CountWeekNum Function", ()=>{
	expect(countWeekNum(new Date("2020-08-10"))).toBe(33);
});

test("Test Format Function", ()=>{
	expect(format(0)).toBe("00");
	expect(format(9)).toBe("09");
	expect(format(12)).toBe(null);
	expect(format(-1)).toBe(null);
});