// any condition returns true
const orCondition = (...params) => params.some(v => v() === true);

export default orCondition;
