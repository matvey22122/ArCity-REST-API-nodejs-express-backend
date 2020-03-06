const sortFn = (prop) => {
    return (a, b) => {
        return b[prop] - a[prop];
    }
};

export {
    sortFn
}