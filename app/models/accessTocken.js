import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const expirationTime = 3600 * 1000;
const getExpirationTime = () => {
    return Date.now() + expirationTime
};

const accessTocken = new Schema({
    value: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        //expires: expirationTime / 1000,
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

const AccessTocken = mongoose.model("AccessTocken", accessTocken);

const create = (tocken, userToAttach) => {
    const newAccessTocken = new AccessTocken({
        value: tocken,
        user: userToAttach._id
    });
    return newAccessTocken.save()
};
const findByValue = (value) => {
    return AccessTocken.findOne({value: value})
};
const deleteByUserId = (userId) => {
    return AccessTocken.deleteOne({user: userId})
};

export {
    create,
    findByValue,
    deleteByUserId
}