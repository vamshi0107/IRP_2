"use strict";
function parseAmount(input) {
  // Step 1: for finding undefined and null values
  if (input === null || input === undefined) {
    throw new Error("Amount is required.");
  }
  if (typeof input !== "string" && typeof input !== "number") {
    throw new Error("Invalid type: amount must be a string or a number, got " + typeof input + ".");
  }
  let value = input;
  if (typeof value === "string") {
    value = value.trim();
    if (value === "") {
      throw new Error("Amount cannot be empty.");
    }
  }
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    throw new Error("Amount must be a valid number.");
  }
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }
  return amount;
}
const testInputs = ["500", " 250 ", "", "abc", null, undefined, "12.5.3"];

for (const testInput of testInputs) {
  try {
    const result = parseAmount(testInput);
    console.log("Input:", JSON.stringify(testInput), "-> Valid amount:", result);
  } catch (error) {
    console.log("Input:", String(testInput) === "undefined" ? "undefined" : JSON.stringify(testInput), "-> Error:", error.message);
  }
}
const BANK_NAME = "JS National Bank";
let transactionCounter = 0;

transactionCounter++; // one transaction recorded
console.log("\n" + BANK_NAME + " | Transactions so far: " + transactionCounter);
console.log("\n--- HOISTING DEMO ---");
console.log("var before declaration:", hoistedVar); // undefined
var hoistedVar = "I am a var";
try {
  console.log(hoistedLet);
  let hoistedLet = "I am a let";
} catch (error) {
  console.log("let before declaration:", error.name + ": " + error.message);
}
announce(); // works thanks to hoisting
function announce() {
  console.log("Function declaration: announce() called before its definition.");
}
try {
  notify(); // notify is undefined here, so calling it fails
  var notify = function () {
    console.log("This will never print before the definition.");
  };
} catch (error) {
  console.log("Function expression before definition:", error.name + ": " + error.message);
}
console.log("\n--- ASYNC LOOP BUG ---");
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("var loop:", i); // 3, 3, 3
  }, 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log("let loop:", j); // 0, 1, 2
  }, 0);
}
