import { helloWorld, helloWorldAsync, MyClass } from ".";

console.log(helloWorld());

helloWorldAsync().then(console.log);

const myclass = new MyClass("test");
console.log(
  myclass.type === "test"
    ? "Classes are working *with* properties in constructors"
    : "Classes are NOT working *with* properties in constructors",
);
