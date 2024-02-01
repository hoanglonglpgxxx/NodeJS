(function () {
    const a = 'asd';
    console.log(a);
})();

//this is IIFE: immediately invoked func expression
//vars and funcs only avail in this func(provide its own scope)
//each loaded module in nodeJS wrapped with an IIFE -> provides private scope
//so can repeat var and func names without conflicts
(function () {
    const b = 'bsd';
    console.log(b);
})();