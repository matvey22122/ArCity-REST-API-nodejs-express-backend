import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const expirationTime = 1209600 * 1000;
const getExpirationTime = () => {
    return Date.now() + expirationTime
};

const refreshTocken = new Schema({
    value: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: expirationTime / 1000,
    },
    expiresAt: {
        type: Date,
        default: getExpirationTime
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    }
},  { versionKey: false });

const RefreshTocken = mongoose.model("RefreshTocken", refreshTocken);

const create = (tocken, userToAttach) => {
    const newRefreshTocken = new RefreshTocken({
        value: tocken,
        user: userToAttach._id
    });
    return newRefreshTocken.save()
};
const findByValue = (value) => {
    return RefreshTocken.findOne({value: value})
};
const deleteByUserId = (userId) => {
    return RefreshTocken.deleteOne({user: userId})
};

export {
    create,
    findByValue,
    deleteByUserId
}