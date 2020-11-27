import { Component, ref } from 'vue';
import useFullScreen from '../index';

export default {
  setup() {
    const divRef = ref(null);
    const [isDivFullScreen, itoggleDivFullScreen] = useFullScreen(divRef);

    const imgRef = ref(null);
    const [, toggleImgFullScreen] = useFullScreen(imgRef);

    const videoRef = ref(null);
    const [, toggleVideoFullScreen] = useFullScreen(videoRef);

    return {
      isDivFullScreen,
      itoggleDivFullScreen,
      divRef,
      toggleImgFullScreen,
      imgRef,
      toggleVideoFullScreen,
      videoRef
    };
  },

  render(_ctx) {
    return (
      <>
        <p>div</p>
        <div ref="divRef" style={{ color: '#613400', background: '#fff1b8' }}>
          <p>{_ctx.isDivFullScreen ? '全屏' : '非全屏'}</p>
          <button onClick={_ctx.itoggleDivFullScreen}>切换</button>
        </div>

        <p>img</p>
        <div>
          <img ref="imgRef" style={{ width: 200 }} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606454660661&di=de25e03df6c307d3fe7769ca99463ba3&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F30%2F29%2F01300000201438121627296084016.jpg" />
          <button onClick={_ctx.toggleImgFullScreen}>切换</button>
        </div>

        <p>video</p>
        <div>
          <video ref="videoRef" src="blob:https://baike.baidu.com/6a259dd0-aa95-42a2-b547-eecac222fcc1" />
          <button onClick={_ctx.toggleVideoFullScreen}>切换</button>
        </div>
      </>
    );
  },
} as Component;
