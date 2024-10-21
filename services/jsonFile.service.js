import fs, { writeFileSync } from 'node:fs';
import { Writable } from 'node:stream';
import crypto from 'node:crypto';

class JsonWritableStream extends Writable {
    constructor(Model, prors = {}) {
        super({ objectMode: true });
        this.Model = Model;
        this.path = Model.STORAGE;
        this.props = prors;
        this.tempStorage = [];
        this.tempStorageSize = 0;
    }

    resetStorage() {
        this.tempStorage = []
        this.tempStorageSize = 0;
    }

    _write(chunk, encoding, callback) {
        if (this.tempStorageSize <= 1000) {
            if (this.props.generateId) chunk.id = crypto.randomUUID();

            this.tempStorage.push(new this.Model(chunk));
            this.tempStorageSize++;
        } else {
            JsonFile.append(this.path, this.tempStorage, encoding);
            this.resetStorage();
        }
        callback();
    }

    _final() {
        if (this.props.source) fs.unlinkSync(this.props.source);
    }
}

const readFromFile = (path, callbackFn) => {
    const json = fs.readFileSync(path, 'utf8');
    const content = JSON.parse(json);

    return callbackFn(content);
};

function write(path, content) {
    fs.writeFileSync(path, JSON.stringify(content));
}

function append(path, data, encoding) {
    const rawContent = JSON.stringify(data);
    const content = rawContent.startsWith('[') ? rawContent.slice(1, -1) : rawContent;
    const file = fs.openSync(path, 'a');
    const stats = fs.fstatSync(file);

    fs.ftruncateSync(file, stats.size - 1);
    fs.appendFileSync(file, stats.size > 2 ? `,${content}]` : `${content}]`);
    fs.closeSync(file);
}

function read(path) {
    return readFromFile(path, (content) => content);
}

function findBy(path, params) { 
    return readFromFile(path, (content) => {
        const keys = Object.keys(params).filter((k) => k !== 'password');

        return content.find((row) => {
            return keys.every((k) => row[k] === params[k]);
        });
    });
}

const JsonFile = { read, write, append, findBy };
export { JsonFile, JsonWritableStream };
