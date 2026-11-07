// A tiny in-memory stand-in for the Mongoose models, so the real Express app, middleware and
// controllers can be tested without a MongoDB server. It supports exactly the calls the code makes.
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const getPath = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const matches = (doc, query) =>
    Object.entries(query).every(([key, cond]) => {
        const value = getPath(doc, key);
        if (value === undefined) return false;
        if (cond && typeof cond === 'object' && Array.isArray(cond.$in)) {
            return cond.$in.some((candidate) => String(candidate) === String(value));
        }
        return String(value) === String(cond);
    });

const applyUpdate = (doc, update) => {
    const hasOperators = Object.keys(update).some((key) => key.startsWith('$'));
    if (!hasOperators) {
        Object.assign(doc, update);
        return;
    }
    Object.assign(doc, update.$set || {});
    Object.keys(update.$unset || {}).forEach((key) => delete doc[key]);
    Object.entries(update.$inc || {}).forEach(([key, amount]) => {
        doc[key] = (doc[key] || 0) + amount;
    });
};

const createFakeModel = ({ hashPassword = false, unique = [], defaults = {} } = {}) => {
    const store = [];

    class Doc {
        constructor(data = {}) {
            Object.assign(this, defaults, data);
            if (!this._id) this._id = new mongoose.Types.ObjectId();
        }

        toObject() {
            return { ...this };
        }

        async save() {
            for (const field of unique) {
                const value = this[field];
                const clash = store.find((other) => other !== this && value !== undefined && other[field] === value);
                if (clash) {
                    const error = new Error(`E11000 duplicate key: ${field}`);
                    error.code = 11000;
                    throw error;
                }
            }
            // Same behaviour as the real pre-save hook: hash a newly set password once.
            if (hashPassword && this.password && !String(this.password).startsWith('$2')) {
                this.password = await bcrypt.hash(this.password, 4);
            }
            if (!store.includes(this)) store.push(this);
            return this;
        }

        static async findOne(query) {
            return store.find((doc) => matches(doc, query)) || null;
        }

        static async findById(id) {
            return store.find((doc) => String(doc._id) === String(id)) || null;
        }

        static async find(query = {}) {
            return store.filter((doc) => matches(doc, query));
        }

        static async findOneAndDelete(query) {
            const doc = store.find((d) => matches(d, query));
            if (doc) store.splice(store.indexOf(doc), 1);
            return doc || null;
        }

        static async findOneAndUpdate(query, update) {
            const doc = store.find((d) => matches(d, query));
            if (!doc) return null;
            applyUpdate(doc, update);
            return doc;
        }

        static async findByIdAndUpdate(id, update) {
            const doc = store.find((d) => String(d._id) === String(id));
            if (!doc) return null;
            applyUpdate(doc, update);
            return doc;
        }

        static async updateOne(query, update) {
            const doc = store.find((d) => matches(d, query));
            if (doc) applyUpdate(doc, update);
            return { modifiedCount: doc ? 1 : 0 };
        }

        static async updateMany(query, update) {
            const docs = store.filter((d) => matches(d, query));
            docs.forEach((doc) => applyUpdate(doc, update));
            return { modifiedCount: docs.length };
        }

        static async deleteOne(query) {
            const doc = store.find((d) => matches(d, query));
            if (doc) store.splice(store.indexOf(doc), 1);
            return { deletedCount: doc ? 1 : 0 };
        }
    }

    Doc.store = store;
    Doc.reset = () => { store.length = 0; };
    return Doc;
};

const models = {
    user: createFakeModel({ hashPassword: true, unique: ['email'] }),
    admin: createFakeModel({ hashPassword: true, unique: ['email'] }),
    cart: createFakeModel({ defaults: { status: 'Pending' } }),
    food: createFakeModel({ unique: ['name'] }),
    payment: createFakeModel({ unique: ['reference'], defaults: { status: 'Paid' } }),
};

const files = {
    user: '../../model/userModel',
    admin: '../../model/adminModel',
    cart: '../../model/cartModel',
    food: '../../model/adminUploadFoodModel',
    payment: '../../model/PaymentModel',
};

// Must run before anything requires the real models.
const install = () => {
    Object.entries(files).forEach(([name, relative]) => {
        const resolved = require.resolve(path.join(__dirname, relative));
        require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: models[name], children: [], paths: [] };
    });
};

const resetAll = () => Object.values(models).forEach((model) => model.reset());

module.exports = { models, install, resetAll };
