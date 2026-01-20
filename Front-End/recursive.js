function recursive(num) {
    if (num === 1) return 1
    return num + recursive(num - 1);
}
console.log(recursive(3))

