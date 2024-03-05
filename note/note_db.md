- use ten_db: switch to db, nếu không có sẽ tạo mới

  \*Create

- db.ten_collection.insertMany([{} , {}]): k có sẽ tự tạo collection, value string dùng double quote, key k cần cũng được
- db.ten_collection.insertOne(): chỉ tạo 1
- insert không cần giống field

\*Query(Read)

- db.ten_collection.find(): show all document
- db.ten_collection.find({field_and_value}): truyền object chứa field và value để search cụ thể
- db.ten_collection.find({ten_field : {$lte: value},....}): find all document có value bé hơn hoặc = value truyền vào(có thể thay = $gte, $gt, $lt); có thể truyền nhiều object tìm kiếm
-> ex: b.tours.find({price: {$gt: 500}, price: {$gt: 4}})
-> db.ten_collection.find({ $or: [{price: $lt: 500}, {rating: {$gte: 4.2}, ...}]}): có $or thì tìm những document thỏa mãn 1 trong những các object truyền vào
  -> db.ten_collection.find({ name: 1}): đây là projection, sẽ chỉ xuất \_id và tên field của các collection thỏa mãn, có thể truyền vào tất cả kiểu query trên

\*Query(Update)

- db.ten_collection.updateOne( {search_object} , {$set: {update_object}}): nếu match multiple documents, chỉ update first one
- db.ten_collection.updateMany( {search_object} , {$set: {update_object}}): tương tự updateOne nhưng nếu match multiple documents thì replace all
- db.ten_collection.replaceOne(), replaceMany() tương tự

\*Query(Delete)

- db.ten_collection.deleteOne( {search_object}): nếu match multiple documents, chỉ delete first one
  -> db.tours.deleteMany({}): nếu truyền object rỗng thì delete All(cant come back, should have backup)
- db.ten_collection.deleteMany( {search_object}): tương tự deleteOne nhưng nếu match multiple documents thì delete all

- show dbs: show all db
- show collections: show all collections of db

- quit(): quit mongo shell

-CÓ CẦN CONNECT MONGO SHELL KHÔNG?
