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
  //? cơ chế process, process.env trên toàn bộ tiến trình

- Mongoose is an Object Data Modelling lib for MongoDB and Node.js, a higher level of abstraction

- MVC architecture ????, separate application logic and business logic

* application: code that is only concerned abt the application's implementation, not the underlying business problem that r trying to solve(ex: showing and selling tours), cocerned abt managing requests and responses, only abt the app's more technical aspects(KEEP IN CONTROLLER)
* business lgoic: related to business rules, how the business works & business needs(ex: creating new tours in the DB) (KEEP IN MODEL)

- Protocol and host list are required in "mongodb+srv: lỗi này do bản của mongoose
- đọc các query method của mongoose

- delete in JS: an operator, remove a property from an obj

  -end của 1 middleware luôn là next();

Official Flutter Documentation and Codelabs: The official Flutter website provides comprehensive documentation and interactive codelabs that cover various aspects of Flutter development. These resources are free to access and can be a great starting point for beginners. You can find them at Flutter.dev.

YouTube Tutorials: There are numerous free tutorials available on YouTube that cover Flutter development. Channels like "The Net Ninja," "Reso Coder," "Academind," and "Flutter Community" offer high-quality tutorials for beginners and advanced users alike.

Udemy Free Courses: Udemy occasionally offers free courses on Flutter development. Keep an eye out for promotions or search specifically for free Flutter courses on the platform.

FreeCodeCamp: FreeCodeCamp, an online learning platform, occasionally offers courses on Flutter development. Check their website or YouTube channel for any available resources.

GitHub Repositories and Open Source Projects: Many developers share their Flutter projects and tutorials on GitHub for free. You can explore repositories, study the code, and even contribute to open source projects to enhance your Flutter skills.

Flutter Community: The Flutter community is very active and supportive. Websites like Flutter Community (https://fluttercommunity.dev/) aggregate various resources, including articles, tutorials, and open source projects contributed by the community.

Flutter Bootcamp by London App Brewery: While not entirely free, the London App Brewery occasionally offers scholarships for their Flutter bootcamp. Keep an eye on their website or social media for any opportunities.

Remember to verify the credibility and quality of the resources you choose to ensure you're learning accurate and up-to-date information. Additionally, participating in online forums like the Flutter subreddit or the Flutter Discord channel can help you connect with other learners and developers for support and guidance.

- Virtual props: khai báo ở schema, có return nhưng không lưu trong DB, getter function của virtual props phải là func thường, not arrow func DO CẦN THIS
- do không trong DB nên không query được
  -> tên_schema.virutal('tên_field')

-hook in nodejs???

//ERROR HANDLING
folder 9 vid 7
-cài ndb: npm i ndb --save-dev
