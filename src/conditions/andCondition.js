// not a single condition evaluates to false
const andCondition = (...params) => !params.some(v => v() === false);

export default andCondition;
