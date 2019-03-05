// not a single condition evaluates to false
const andCondition = conditions => conditions.every(v => v === true);

export default andCondition;
