import Hljs from "highlightjs/highlight.pack.min";
import "./code-theme.css";

let hljs = {};
hljs.install = (Vue) => {
  Vue.directive('hljs', {
    bind: el => {
      let block = el.querySelector("pre code");
      if (block) {
        return Hljs.highlightBlock(block)
      }
    }
  });
};

export default hljs;