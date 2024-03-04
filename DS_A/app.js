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

const arr1 = ['a', 'c', 'd', 'x'];
const arr2 = ['d', 'x', 'av'];

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
function test(arr1, arr2) {
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
test(arr1, arr2);