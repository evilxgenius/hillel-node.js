import { ObjectId } from 'mongodb';
import connection from './DatabaseClient.service.js';

export default class Student {
    static DATABASE = 'university';
    static COLLECTION = 'students';

    async _action(callback) {
        const client = connection();
        const collection = client.db(Student.DATABASE).collection(Student.COLLECTION);

        return callback(collection);
    }

    findAll() {
        return this._action(c => c.find().toArray());
    }

    find(id) {
        return this._action(c => c.findOne({ _id: new ObjectId(id) }));
    }

    create(params) {
        return this._action(c => c.insertOne(params));
    }

    update(id, params) {
        return this._action(c => c.updateOne({ _id: new ObjectId(id) }, { $set: params }));
    }

    destroy(id) {
        return this._action(c => c.deleteOne({ _id: new ObjectId(id) }));
    }
}
