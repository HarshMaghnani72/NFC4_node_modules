const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');

let bucket;

const init = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('studygroup');
    bucket = new GridFSBucket(db, { bucketName: 'files' });
};

init();

exports.uploadFile = async (fileBuffer, groupId) => {
    try {
        const uploadStream = bucket.openUploadStream(`${groupId}_${Date.now()}`);
        uploadStream.write(fileBuffer);
        uploadStream.end();
        return new Promise((resolve, reject) => {
            uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
            uploadStream.on('error', reject);
        });
    } catch (error) {
        throw new Error('File upload failed: ' + error.message);
    }
};

exports.getFile = async (fileId) => {
    try {
        return bucket.openDownloadStreamByName(fileId);
    } catch (error) {
        throw new Error('File retrieval failed: ' + error.message);
    }
};