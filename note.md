//use watch mode
-at terminal run: node --watch filename (like hot reload)

//callback

- syc callback: callback thực hiện ngay lập tức là sync callback
- async callback: callback dùng để tiếp tục thực thi code sau khi 1 tác vụ bất đồng bộ hoàn thành

- async: chạy các task ở background,l khi xong thì callback của nó được gọi thay vì phải đợi các task khác hoàn thành rồi mới thực hiện như sync

//Streams: trong node, xử lý luồng data theo từng phần khi data đến thay vì đợi toàn bộ luồng data khả dụng
ex: xem video utube, xem từng phần trong khi data còn lại đổ về qua thời gian

//Buffers: quyết định được thời điểm gửi data để xử lý

- buffer nodejs chỉ có 7 slot?, 64KB

-
