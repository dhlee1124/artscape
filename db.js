const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,         // MySQL 서버 주소
    user: process.env.DB_USER,      // MySQL 사용자 이름
    password: process.env.DB_PASSWORD,  // MySQL 비밀번호
    database: process.env.DB_NAME,  // 사용할 데이터베이스 이름
});

module.exports = pool.promise();
