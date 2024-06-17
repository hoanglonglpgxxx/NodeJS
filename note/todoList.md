//tìm hiểu .create(),.save(),xem lại section async await
//đang lỗi fail thì không ghi log
//sửa lại logic - cơ chế ghi log, cho hàm writeLog vào hàm catchAsync, khi có class appError thì lấy status code và msg từ apperror
//đang có 1 vấn đề, lúc call /signup nếu lấy req.body thì bị lộ pass, cũng không phải password sau mã hóa
FIX LỖI KHI RUN SERVER
DeprecationWarning: The URL mongodb://mitsngeither:Abc.2010%40@ac-w1rf4ag-shard-00-00.rfwzvbn.mongodb.net:27017,ac-w1rf4ag-shard-00-01.rfwzvbn.mongodb.net:27017,ac-w1rf4ag-shard-00-02.rfwzvbn.mongodb.net:27017/tours-test?authSource=admin&replicaSet=atlas-u74ctn-shard-0&retryWrites=true&w=majority&ssl=true is invalid. Future versions of Node.js will throw an error.
(Use `node --trace-deprecation ...` to show where the warning was created)
//writelog vẫn chưa có hướng để run khi return new appError()

- add 2-factor authen

READ BOOK PAGE

- TABLE HAS NAME, LINK TO IMAGE OF BOOK, RATING STARS, DESCRIPTION OF REVIEW CONTENT, TYPE(EBOOK, BOOK, PDF,...), NUMBER, CREATED TIME, END TIME(END TIME WILL BE DISABLE, ONLY CHANGE AS LAST UPDATE TIME, can set to unchangable state)
- import/export json - excel
- add js để validate các field trong login/signup
- implement token blacklist để logout
- thiếu reroute khi đã login thì /login trỏ về /me
- check lại luồng môi trường prod, hình như đang lỗi error page
