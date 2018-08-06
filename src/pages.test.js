import { makeLink } from "./pages";

describe("makeLink", () => {
  it("generates a link from a path and params", () => {
    const link = makeLink("/foo/:bar", { bar: "baz" });

    expect(link).toEqual("/foo/baz");
  });

  it("handles multiple params", () => {
    const link = makeLink("/foo/:bar/baz/:qux", { bar: "hello", qux: "world" });

    expect(link).toEqual("/foo/hello/baz/world");
  });
});
