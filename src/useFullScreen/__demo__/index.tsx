import { Component, ref } from 'vue';
import useFullScreen from '../index';

export default {
  setup() {
    const divRef = ref(null);
    const [isFull, { setFull, exitFull, toggleFull }] = useFullScreen(divRef);

    const imgRef = ref(null);
    const [, { toggleFull: toggleImgFullScreen }] = useFullScreen(imgRef);

    const videoRef = ref(null);
    const [, { toggleFull: toggleVideoFullScreen }] = useFullScreen(videoRef);

    const onFull = () => {
      console.log('进入全屏')
      setFull()
    }

    return {
      isFull,
      onFull,
      exitFull,
      toggleFull,
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
          <p>{_ctx.isFull ? '全屏' : '非全屏'}</p>
          <button onClick={_ctx.toggleFull}>切换</button>
          <button onClick={_ctx.onFull}>显示全屏</button>
          <button onClick={_ctx.exitFull}>退出全屏</button>
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
