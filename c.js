(function (msg) {
    const a = 'asd';
    console.log(msg, a);
})('hi');

//this is IIFE: immediately invoked func expression
//vars and funcs only avail in this func(provide its own scope)
//each loaded module in nodeJS wrapped with an IIFE -> provides private scope
//so can repeat var and func names without conflicts
(function (msg) {
    const b = 'bsd';
    console.log(msg, b);
})('hey');

//module wrapper - has 5 params: exports, require, module, __filename, __dirname
