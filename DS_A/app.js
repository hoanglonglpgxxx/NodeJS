/* eslint-disable no-plusplus */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-shadow */
//-can use data structures / algorith to solve probs
// 2 arrs, return whether 2 arras contain any common items(T/F)
/*
ex: arr1 = ['a','x','c'];
------
arr2 = ['d','b','m','u'] => arr1 & arr2 => false
arr3  = ['x','y','z'] => arr1 & arr3 => true
*/

// const arr1 = ['a', 'c', 'd', 'x'];
// const arr2 = ['d', 'x', 'av'];

/* function test(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                return true;
            }
        }
    }
    return false;
}  *///->O(a*b):vì arr1 & arr2 có thể khác size


//better solution
/* function test(arr1, arr2) {
    //loop through first arr and create obj where props == items in arr
    const map = {};
    for (let i = 0; i < arr1.length; i++) {
        if (!map[i]) {
            const item = arr1[i];
            map[item] = true;
        }
    }
    //loop through second arr and check if item in second arr exists on created obj
    for (let j = 0; j < arr2.length; j++) {
        if (map[arr2[j]]) {
            return true;
        }
    }
    return false;
}//->Time Colexity: O(a+b) vì 2 loop không lồng nhau nữa
test(arr1, arr2); */

//-----------------------------------ARRAY
/*1. array 
lokpup O(1)
push O(1)
insert O(n)
delete O(n)
*/
//const strings = ['a', 'b', 'd', 'c'];

// console.log(strings[2]);//lookup
//strings.push('e'); //O(1)
//console.log(strings); //pop O(1), unshift O(n) do phải loop qua các string còn lại để reindex
//splice() O(n) (tính worst case mới là n)

//Static and dynamic arr: static phải khai báo trước số lượng item; js là dynamic arr, auto allocate memory
//primitive type khi gán qua lại thì so sánh luôn true, 
//reference type thì không
const obj1 = { val: 2 };
const obj2 = obj1; //trỏ vào ô nhớ của obj1, khi đổi val của obj1 thì ob2 cũng bị đổi
const obj3 = { val: 2 };
console.log(obj1 === obj2);
console.log(obj1 === obj3); //false vì khác ô nhớ?

//context vs scope
//context khác với scope, context là this