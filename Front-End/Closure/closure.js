
/**
 * Lexical scope means that a variable’s accessibility is determined by where 
 * it is written in the code (its position in the source).

In simple terms:
👉 Inner functions can access variables from their outer (parent) functions.
👉 Outer functions cannot access variables inside inner functions.
 */

// function outer() {
//   let a = 10;

//   function inner() {
//     console.log(a); // accessible due to lexical scope
//   }

//   inner();
// }


/**
* Closure is when a function remembers and can access variables from its
* lexical scope even after the outer function has finished executing.

* 👉 In short: function + remembered outer variables = closure
*/

function counter() {
  let count = 0;

  return function () {

    count = count + 1;
    console.log(count);
  };
}

const increment = counter();

increment(); // 1
increment(); // 2
increment(); // 3
increment(); // 4
increment(); // 5

console.log("--------------------------------------------------------------")

function bankAccount(){

  let balance = 0;

  return {
    deposit: function(amount){
      balance = balance + amount;
    },
    withdraw: function(amount){
      balance = balance - amount;
    },
    getBalance: function(){
      return balance;
    }
  }
}

const account = bankAccount();

account.deposit(100);
account.deposit(50);
account.withdraw(30);

console.log(account.getBalance()); // 120
