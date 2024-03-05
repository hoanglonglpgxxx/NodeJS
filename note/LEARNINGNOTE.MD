\*\*callback

- syc callback: callback thực hiện ngay lập tức là sync callback
- async callback: callback dùng để tiếp tục thực thi code sau khi 1 tác vụ bất đồng bộ hoàn thành

- async: chạy các task ở background,l khi xong thì callback của nó được gọi thay vì phải đợi các task khác hoàn thành rồi mới thực hiện như sync

\*\*Streams:

- Trong node, xử lý luồng data theo từng phần khi data đến thay vì đợi toàn bộ luồng data khả dụng

* ex: xem video utube, xem từng phần trong khi data còn lại đổ về qua thời gian

\*\*Buffers: quyết định được thời điểm gửi data để xử lý

- buffer nodejs chỉ có 7 slot?, 64KB

-PARSE VARIABLE FROM URL

//ABOUT BACKEND

- Domain name is not real address, DNS will convert domain name to real IP address

---

xem lại vid 3 folder 4 về threads
xem lại folder 4-5 để nắm base-
!!! tìm hiểu event loop
https://anonystick.com/blog-developer/he-thong-eventloop-trong-nodejs-cach-hoat-dong-va-cach-su-dung-voi-loi-giai-thich-can-ke-2022122761300007

---

\*\*eventLoop

- most important feature, khiến async function khả thi
- gồm 4 phase:

* expired timer callbacks
* I/O polling and callbacks
* setImmediate callbacks
* close callbacks

robust: mạnh
orchestration: cấu hình tự động
accountability: nhiệm vụ/trách nhiệm

\*\*EXPRESS

- sử dụng mvc architecture

* REST API

- chia api thành logical resources

  1. resources ở đây là object, tất cả info có thể đặt tên là resource
  2. endpoints should contain only resources(nouns) & use HTTP methods for actions
  3. PUT/PATCH: update, PUT thay đổi toàn bộ resouce, PATCH chỉ thay đổi field được yêu cầu,
     > Nếu không có sẵn resource mà dùng PUT -> như POST -> tạo 1 resource mới
     > Nếu không có sẵn resource mà dùng PATCH -> FAIL, không tạo resource mới

- expose structured, resource-based URLs
- use http methods
- thường send data as json (key of json must be String)
- be stateless: all state handled on the client(not on server) aka request must contain all the information necessary to process a certain request.The server should not have to remember previous requests

- Middleware thực thi theo thứ tự khai báo
- Param Middleware
- Environment variables
- cơ chế process, process.env trên toàn bộ tiến trình

folder 8 vid 5 00:00

- Mongoose is an Object Data Modelling lib for MongoDB and Node.js, a higher level of abstraction
