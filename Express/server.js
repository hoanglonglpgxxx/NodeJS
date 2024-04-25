const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', process.env.DATABASE_PASSWORD
);


mongoose
    .connect(
        DB,
        { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
    ).then(() => console.log('DB connected'));

const app = require('./app');
// console.log(app.get('env'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

//catch event unhandledRejection, xử lý cho async code, khi có lỗi chưa xử lý sẽ trigger event này
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLER REJECTION! Shutting down.....');
    server.close(() => { //đóng server rồi mới dừng các request
        process.exit(1);
    });
});