export type Foo = {
  a: number;
  b: number;
};

export function fooReducer(
  state: Foo,
  action: { type: string; payload?: any },
) {
  switch (action.type) {
    case "add":
      if (action.payload === "a") {
        return { a: state.a + 1, b: state.b };
      }
      if (action.payload === "b") {
        return { a: state.a, b: state.b + 1 };
      }
      return state;
      break;
    case "subtract":
      return { a: state.a - 1, b: state.b - 1 };
      break;
    default:
      return state;
      break;
  }
}
