const helloWorld = () => "Hello, world!";

const helloWorldAsync = async () => "Hello, async world!";

export { helloWorld, helloWorldAsync };

export class MyClass {
  constructor(public type: string) {}
}
