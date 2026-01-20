let arr = ['apple', 'banana', 'grape', 'grape', 'grape', 'banana', 'apple', 'apple']

const ans = arr.reduce((acc, words) => {
    acc[words] = (acc[words] || 0) + 1;
    return acc;
}, {})

console.log(ans)