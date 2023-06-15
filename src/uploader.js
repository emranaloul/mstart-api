const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const params = {
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
        accessKeyId: process.env.AWS_ACCESS_KEY,
    },

}
const client = new S3Client(params);
const filerFilter = (req, file, cb) => {
    if (file.mimetype === 'image.jpeg' || file.mimetype === 'image.png' || file.mimetype === 'image.pdf') {
        cb(null, true);
    } else {
        cb(new Error('file type is not supported, only JPEG and PNG'), false)
    }
}

const uploadS3 = multer({
    filerFilter,
    limits: {
        files: 5,
        fileSize: 500000,
    },
    storage: multerS3({
        acl: 'public-read',
        s3: client,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        },
    })
});

const deleteRemoteFile = async fileUrl => {
    try {
        const key = fileUrl.split('/')[3];
        const input = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }
        const command = new DeleteObjectCommand(input)
        await client.send(command)

        return 'deleted successfully'
    } catch (error) {
        throw new Error(error.message)
    }
}


module.exports = {
    uploadS3,
    deleteRemoteFile,
}