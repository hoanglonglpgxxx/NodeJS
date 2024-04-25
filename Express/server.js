const mongoose = require('mongoose');
const dotenv = require('dotenv');

//catch event uncaughtException, xử lý cho synchro code, khi có lỗi sẽ trigger event này
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down.....');
    console.log(err.name, err.message);
    process.exit(1);
});

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
    console.log('UNHANDLER REJECTION! Shutting down.....');
    console.log(err.name, err.message);
    server.close(() => { //đóng server rồi mới dừng các request
        process.exit(1);
    });
});


