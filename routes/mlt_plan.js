const express = require('express');
const router = express.Router();
const db = require('../db');


// Plan 생성 API (다른 정보들은 NULL로 설정)
router.post('/planning', async (req, res) => {
    try {
        const [result] = await db.query(
            'INSERT INTO plan (title, description, poster_image_url, location) VALUES (NULL, NULL, NULL, NULL)'
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error during data insertion:', error); // 상세 로그 출력
        res.status(500).json({ error: '데이터 삽입 중 오류 발생', details: error.message });
    }
});

// Plan 제목 업데이트 API
router.put('/plan/:id/title', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        await db.query(
            'UPDATE plan SET title = ? WHERE id = ?',
            [title, id]
        );
        res.status(200).json({ message: '제목이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Plan 제목 가져오기 API
router.get('/plan/:id/title', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT title FROM plan WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ title: rows[0].title });
        } else {
            res.status(404).json({ error: 'Plan을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Plan 설명 업데이트 API
router.put('/plan/:id/description', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        await db.query(
            'UPDATE plan SET description = ? WHERE id = ?',
            [description, id]
        );
        res.status(200).json({ message: '설명이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Plan 설명 가져오기 API
router.get('/plan/:id/description', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT description FROM plan WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ description: rows[0].description });
        } else {
            res.status(404).json({ error: 'Plan을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Plan 포스터 이미지 URL 업데이트 API
router.put('/plan/:id/poster', async (req, res) => {
    const { id } = req.params;
    const { poster_image_url } = req.body;
    try {
        await db.query(
            'UPDATE plan SET poster_image_url = ? WHERE id = ?',
            [poster_image_url, id]
        );
        res.status(200).json({ message: '포스터 이미지가 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Plan 포스터 이미지 URL 가져오기 API
router.get('/plan/:id/poster', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT poster_image_url FROM plan WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ poster_image_url: rows[0].poster_image_url });
        } else {
            res.status(404).json({ error: 'Plan을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Plan 장소 업데이트 API
router.put('/plan/:id/location', async (req, res) => {
    const { id } = req.params;
    const { location } = req.body;
    try {
        await db.query(
            'UPDATE plan SET location = ? WHERE id = ?',
            [location, id]
        );
        res.status(200).json({ message: '장소가 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Plan 장소 가져오기 API
router.get('/plan/:id/location', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT location FROM plan WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ location: rows[0].location });
        } else {
            res.status(404).json({ error: 'Plan을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});


// Exhibition List 생성 API (다른 정보들은 NULL로 설정)
router.post('/exhib_list', async (req, res) => {
    const { plan_id } = req.body;
    if (!plan_id) {
        return res.status(400).json({ error: 'plan_id is required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO exhibition_list (plan_id, artwork_image_url, artwork_title, artwork_description) VALUES (?, NULL, NULL, NULL)',
            [plan_id]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: '데이터 삽입 중 오류 발생' });
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/* 파일 저장 경로와 파일 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // 이미지가 저장될 폴더
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름을 고유하게 저장하기 위해 타임스탬프 사용
    },
  });
  
  // multer 설정
  const upload = multer({ storage });
  
  // 이미지 업로드 API
  app.post('/upload', upload.single('image'), (req, res) => {
    try {
      // 파일이 업로드 되었는지 확인
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      // 이미지 URL 생성
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      // 클라이언트에 이미지 URL 반환
      res.json({ imageUrl });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
*/


// Exhibition List 작품 이미지 URL 업데이트 API
router.put('/exhib_list/:id/artwork_image_url', async (req, res) => {
    const { id } = req.params;
    const { artwork_image_url } = req.body;
    try {
        await db.query(
            'UPDATE exhibition_list SET artwork_image_url = ? WHERE id = ?',
            [artwork_image_url, id]
        );
        res.status(200).json({ message: '작품 이미지 URL이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Exhibition List 작품 이미지 URL 가져오기 API
router.get('/exhib_list/:id/artwork_image_url', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT artwork_image_url FROM exhibition_list WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ artwork_image_url: rows[0].artwork_image_url });
        } else {
            res.status(404).json({ error: 'Exhibition을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Exhibition List 작품 제목 업데이트 API
router.put('/exhib_list/:id/artwork_title', async (req, res) => {
    const { id } = req.params;
    const { artwork_title } = req.body;
    try {
        await db.query(
            'UPDATE exhibition_list SET artwork_title = ? WHERE id = ?',
            [artwork_title, id]
        );
        res.status(200).json({ message: '작품 제목이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Exhibition List 작품 제목 가져오기 API
router.get('/exhib_list/:id/artwork_title', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT artwork_title FROM exhibition_list WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ artwork_title: rows[0].artwork_title });
        } else {
            res.status(404).json({ error: 'Exhibition을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Exhibition List 작품 설명 업데이트 API
router.put('/exhib_list/:id/artwork_description', async (req, res) => {
    const { id } = req.params;
    const { artwork_description } = req.body;
    try {
        await db.query(
            'UPDATE exhibition_list SET artwork_description = ? WHERE id = ?',
            [artwork_description, id]
        );
        res.status(200).json({ message: '작품 설명이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Exhibition List 작품 설명 가져오기 API
router.get('/exhib_list/:id/artwork_description', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT artwork_description FROM exhibition_list WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ artwork_description: rows[0].artwork_description });
        } else {
            res.status(404).json({ error: 'Exhibition을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Notes 생성 API (다른 정보들은 NULL로 설정)
router.post('/notes', async (req, res) => {
    const { plan_id } = req.body; 
    if (!plan_id) {
        return res.status(400).json({ error: 'plan_id is required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO notes (plan_id, content) VALUES (?, NULL)',
            [plan_id]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: '데이터 삽입 중 오류 발생' });
    }
});

// Notes 내용 업데이트 API
router.put('/notes/:id/content', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        await db.query(
            'UPDATE notes SET content = ? WHERE id = ?',
            [content, id]
        );
        res.status(200).json({ message: '메모 내용이 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 업데이트 중 오류 발생' });
    }
});

// Notes 내용 가져오기 API
router.get('/notes/:id/content', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT content FROM notes WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json({ content: rows[0].content });
        } else {
            res.status(404).json({ error: 'Notes를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
});

// Notes 삭제 API
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM notes WHERE id = ?', [id]);
        res.status(200).json({ message: '메모가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '데이터 삭제 중 오류 발생' });
    }
});

module.exports = router;
