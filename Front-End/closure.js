//A closure in JavaScript is a function that has access to the variables and parameters of its outer function,
//even after the outer function has finished executing

let a = 10;

function outerFunction(name) {
    const outerVariable = "out";
    function innerFunction() {
        console.log(`Outer variable: ${outerVariable}`);
        console.log(`Hello, ${name}`);
    }
    return innerFunction;
}

const greetFaizal = outerFunction("faizal");
// greetFaizal();

const greetJoe = outerFunction("joe");
// greetJoe();

greetFaizal();
greetJoe();



