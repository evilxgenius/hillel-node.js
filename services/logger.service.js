import EventEmitter from 'node:events';
import { appendFileSync } from 'node:fs';

const fileUploading = new EventEmitter();

const addLeadingZero = (value) => (value < 10 ? `0${value}` : value);

const writeToLog = (log) => {
    const now = new Date();
    const day = addLeadingZero(now.getDate());
    const month = addLeadingZero(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = addLeadingZero(now.getHours());
    const minutes = addLeadingZero(now.getMinutes());
    const seconds = addLeadingZero(now.getSeconds());
    const timestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;    

    appendFileSync('./logs/uploads.log', `${timestamp} -> ${log}\n`, (err) => {
        if (err) throw err;
    });
};

fileUploading.on('fileUploadStart', () => writeToLog('File upload has started'));
fileUploading.on('fileUploadEnd', () => writeToLog('File has been uploaded'));
fileUploading.on('fileUploadFailed', (err) => writeToLog(`Error occurred, file upload was failed. ${err}`));

export default fileUploading;