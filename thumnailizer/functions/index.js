'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp');
const admin = require('firebase-admin');
admin.initializeApp();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_400x300 = "400x300";
const THUMB_160x120 = "160x120";
const THUMB_120x120 = "120x120";

// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const [, thumbnailId] = fileDir.split("/");
  const fileName = path.basename(filePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return functions.logger.log('This is not an image.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return functions.logger.log('Already a Thumbnail.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_120x120) || fileName.startsWith(THUMB_160x120) || fileName.startsWith(THUMB_400x300)) {
    return functions.logger.log('Already a Thumbnail.');
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  await mkdirp(tempLocalDir)

  /* --- STARTS_1 ---*/

  let thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_400x300}_${fileName}`));
  let tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  const thumbFile1 = bucket.file(thumbFilePath);

  // Download file from bucket.
  await file.download({destination: tempLocalFile});
  functions.logger.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_400x300}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  functions.logger.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  functions.logger.log('Thumbnail uploaded to Storage at', thumbFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalThumbFile);

  /* --- ENDS_1 ---*/

  /* --- STARTS_2 ---*/

  thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_160x120}_${fileName}`));
  tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  let thumbFile2 = bucket.file(thumbFilePath);

  functions.logger.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_160x120}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  functions.logger.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  functions.logger.log('Thumbnail uploaded to Storage at', thumbFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalThumbFile);

  /* --- ENDS_2 ---*/


  /* --- STARTS_3 ---*/

  thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_120x120}_${fileName}`));
  tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  let thumbFile3 = bucket.file(thumbFilePath);

  functions.logger.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_120x120}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  functions.logger.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  functions.logger.log('Thumbnail uploaded to Storage at', thumbFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);

  /* --- ENDS_3 ---*/


  // Get the Signed URLs for the thumbnail and original image.
  const results = await Promise.all([
    thumbFile1.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    }),
    thumbFile2.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    }),
    thumbFile3.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    }),
  ]);
  functions.logger.log('Got Signed URLs.');

  const thumbResult1 = results[0];
  const thumbFileUrl1 = thumbResult1[0];

  const thumbResult2 = results[1];
  const thumbFileUrl2 = thumbResult2[0];

  const thumbResult3 = results[2];
  const thumbFileUrl3 = thumbResult3[0];

  // Add the URLs to the Database
  admin.firestore().collection('thumbnails').doc(thumbnailId).set({
      "400x300": thumbFileUrl1,
      "160x120": thumbFileUrl2,
      "120x120": thumbFileUrl3,
  })
  return functions.logger.log('Thumbnail URLs saved to database.');
});
