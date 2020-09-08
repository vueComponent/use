import useInViewport from "../index";

describe("useInViewport", () => {
  it("should be defined", () => {
    expect(useInViewport).toBeDefined();
  });
  // it('with argument', async () => {
  //   const eleRef = ref(null)
  //   let inViewPort!: Ref<boolean> | Ref<null>
  //   const wrapper = shallowMount({
  //     setup() {
  //       inViewPort = useInViewport(eleRef);
  //       return { eleRef };
  //     },
  //     render(_ctx) {
  //       return (
  //         <h1 ref='eleRef' >
  //         </h1>
  //       )
  //     }
  //   });
  //   await wrapper.vm.$nextTick()
  //   expect(inViewPort.value).toBe(true)
  // });
});
