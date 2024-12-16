import { openSync, writeSync, closeSync} from 'node:fs';

const STORES = {
    users: './storage/users.store.json',
    products: './storage/products.store.json',
    carts: './storage/carts.store.json'
}

function initializeStorage() {
    Object.values(STORES).forEach(path => {
        try {
            const file = openSync(path, 'ax');
            writeSync(file, '[]')
            closeSync(file);
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
    });
}

export {
    STORES,
    initializeStorage
}