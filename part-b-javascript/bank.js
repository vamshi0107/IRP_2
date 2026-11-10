"use strict"; // Strict mode catches silent mistakes (e.g. undeclared variables).

// PART 1: Types & Coercion

// Why "5" + 2 gives "52": the + operator concatenates when either side is a string,
// so the number 2 is converted to "2" and joined to "5".
// Why "5" - 2 gives 3: the - operator only works on numbers, so "5" is converted to 5 first.
// Why typeof null === "object": a historical bug from JavaScript's first version
// that was never fixed to avoid breaking existing code. null is NOT an object.

function parseAmount(input) {
  // Step 1: null/undefined would otherwise coerce (Number(null) is 0), so block them first.
  if (input === null || input === undefined) {
    throw new Error("Amount is required.");
  }

  // Step 2: only strings and numbers are accepted.
  if (typeof input !== "string" && typeof input !== "number") {
    throw new Error("Invalid type: amount must be a string or a number, got " + typeof input + ".");
  }

  // Step 3: remove outer spaces so " 250 " becomes "250".
  let value = input;
  if (typeof value === "string") {
    value = value.trim();

    // Step 4: Number("") is 0, so an empty string must be rejected before conversion.
    if (value === "") {
      throw new Error("Amount cannot be empty.");
    }
  }

  // Step 5: explicit conversion; invalid text like "abc" or "12.5.3" becomes NaN.
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    throw new Error("Amount must be a valid number.");
  }

  // Step 6: a bank amount must be greater than zero.
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  // Step 7: verified number.
  return amount;
}

// Testing: parseAmount never logs; the caller handles the result or the error.
const testInputs = ["500", " 250 ", "", "abc", null, undefined, "12.5.3"];

for (const testInput of testInputs) {
  try {
    const result = parseAmount(testInput);
    console.log("Input:", JSON.stringify(testInput), "-> Valid amount:", result);
  } catch (error) {
    console.log("Input:", String(testInput) === "undefined" ? "undefined" : JSON.stringify(testInput), "-> Error:", error.message);
  }
}

// PART 2: Scoping & Hoisting

// Step 1: Main Declarations
// const for the bank name because it must never be reassigned (protects it from being overwritten).
const BANK_NAME = "JS National Bank";
// let for the counter because its value changes every time a transaction happens.
let transactionCounter = 0;

transactionCounter++; // one transaction recorded
console.log("\n" + BANK_NAME + " | Transactions so far: " + transactionCounter);

// Step 2: Hoisting Demo
// HOISTING DEMO

// Comment on execution context: JavaScript runs code in two phases.
// 1) Creation phase: declarations are registered in memory (var = undefined,
//    function declarations = fully stored, let/const = registered but uninitialized).
// 2) Execution phase: code runs line by line and assigns the real values.

// 1. var: hoisted and initialised with undefined, so no error before the declaration.
console.log("\n--- HOISTING DEMO ---");
console.log("var before declaration:", hoistedVar); // undefined
var hoistedVar = "I am a var";

// 2. let: hoisted but in the Temporal Dead Zone until its declaration line runs.
try {
  console.log(hoistedLet);
  let hoistedLet = "I am a let";
} catch (error) {
  console.log("let before declaration:", error.name + ": " + error.message);
}

// 3. Function declaration: fully hoisted (name + body), so calling it early works.
announce(); // works thanks to hoisting
function announce() {
  console.log("Function declaration: announce() called before its definition.");
}

// 4. Function expression: only the var name is hoisted (as undefined), not the function.
try {
  notify(); // notify is undefined here, so calling it fails
  var notify = function () {
    console.log("This will never print before the definition.");
  };
} catch (error) {
  console.log("Function expression before definition:", error.name + ": " + error.message);
}

// Step 3: The Asynchronous Loop Bug
console.log("\n--- ASYNC LOOP BUG ---");

// var is function/global scoped: all 3 callbacks share ONE variable i.
// By the time the timers run, the loop has finished and i is 3.
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("var loop:", i); // 3, 3, 3
  }, 0);
}

// let is block scoped: each iteration gets a fresh lexical binding of i,
// so every callback remembers its own value.
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log("let loop:", j); // 0, 1, 2
  }, 0);
}