const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const multer = require('multer');

// 프로필 업로드
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  });
  const upload = multer({ storage });

// 회원가입 API 
router.post('/signup', upload.single('profile_picture'), async (req, res) => {
    const { name, username, password, confirmPassword } = req.body;
  
    if (!name || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: '모든 필드를 입력하세요.' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
  
    const user = { name, username, password: hashedPassword, profile_picture: profilePicture };
  
    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '회원가입 실패' });
      }
      res.status(201).json({ message: '회원가입 성공' });
    });
  });

// 로그인 API
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 입력하세요.' });
    }
  
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
      const user = results[0];
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
  
      res.status(200).json({ message: '로그인 성공', user: { id: user.id, name: user.name } });
    });
});


module.exports = router;

