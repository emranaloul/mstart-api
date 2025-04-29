const express = require('express');
const app = express();
const multer = require('multer');
// const upload = multer();
const cors = require('cors');
const { uploadS3 } = require('./uploader');
const router = require('./api/router');
const authRouter = require('./auth/routes');
const handle404 = require('./errors/404');
const serverError = require('./errors/500');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/upload', uploadS3.single('media'), (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'file uploaded successfully',
    file: req.file.key,
    location: req.file.location,
  });
});
app.use('/auth', authRouter);
app.use('/api', router);
// app.post('/auth/signup', uploadS3.single('avatar'), addUserHandler);

app.use(handle404);
app.use(serverError);

module.exports = {
  server: app,
  start: (port) => {
    const PORT = port ?? 3000;
    app.listen(PORT, () => {
      console.log(`Server up on port ${port}`);
    });
  },
};
