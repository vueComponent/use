import { Ref, ref } from 'vue';

export default function useFullScreen(
  target: Ref<HTMLElement | Document | Window>
) {
  const isFullScreen = ref(false) as Ref;

  /**
   * document.fullscreenEnabled        Standard
   * document.webkitfullscreenEnabled  Chrome、Safari、Opera
   * document.mozfullscreenEnabled     Firefox
   * document.msfullscreenEnabled      IE、Edge
   */
  const fullscreenEnabled = (document as any).fullscreenEnabled ||
    (document as any).webkitfullscreenEnabled ||
    (document as any).mozfullscreenEnabled ||
    (document as any).msfullscreenEnabled;

  function toggleFullScreen() {
    if (!fullscreenEnabled) {
      alert('浏览器当前不能全屏');
      return
    }

    /**
     * document.exitFullscreen          Standard
     * document.webkitCancelFullScreen  Chrome、Safari、Opera
     * document.mozCancelFullScreen     Firefox
     * document.msExitFullscreen        IE、Edge
     */

    // close the full screen
    if (isFullScreen.value) {
      if ((document as any).exitFullscreen) {
        (document as any).exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }

      isFullScreen.value = !isFullScreen.value
      return
    }

    /**
     * document.requestFullscreen        Standard
     * document.webkitRequestFullScreen  Chrome、Safari、Opera
     * document.mozRequestFullScreen     Firefox
     * document.msRequestFullscreen      IE、Edge
     */

    // open the full screen
    const doc = target.value;
    if ((doc as any).requestFullscreen) {
      (doc as any).requestFullscreen();
    } else if ((doc as any).webkitRequestFullScreen) {
      (doc as any).webkitRequestFullScreen();
    } else if ((doc as any).mozRequestFullScreen) {
      (doc as any).mozRequestFullScreen();
    } else if ((doc as any).msRequestFullscreen) {
      (doc as any).msRequestFullscreen();
    }
    isFullScreen.value = !isFullScreen.value
  }

  return [isFullScreen, toggleFullScreen]
}
