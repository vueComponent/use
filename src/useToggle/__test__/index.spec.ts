import useToggle from "../index";

describe("useToggle", () => {
  test("default", async () => {
    const [state, { toggle, setLeft, setRight }] = useToggle();
    expect(state.value).toBe(false);
    toggle();
    expect(state.value).toBe(true);
    setLeft();
    expect(state.value).toBe(false);
    setRight();
    expect(state.value).toBe(true);
  });
});
