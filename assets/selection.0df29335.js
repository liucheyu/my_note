import{w as b,E as x,o as H,g as V,n as y,F as L,G as T,m as M,b as P,v as W,P as C}from"./index.55e9ac4f.js";const R={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},D=["beforeShow","show","beforeHide","hide"];function N({showing:e,canShow:t,hideOnRouteChange:l,handleShow:i,handleHide:d,processOnMount:E}){const f=V(),{props:n,emit:s,proxy:m}=f;let u;function S(o){e.value===!0?c(o):p(o)}function p(o){if(n.disable===!0||o!==void 0&&o.qAnchorHandled===!0||t!==void 0&&t(o)!==!0)return;const r=n["onUpdate:modelValue"]!==void 0;r===!0&&(s("update:modelValue",!0),u=o,y(()=>{u===o&&(u=void 0)})),(n.modelValue===null||r===!1)&&w(o)}function w(o){e.value!==!0&&(e.value=!0,s("beforeShow",o),i!==void 0?i(o):s("show",o))}function c(o){if(n.disable===!0)return;const r=n["onUpdate:modelValue"]!==void 0;r===!0&&(s("update:modelValue",!1),u=o,y(()=>{u===o&&(u=void 0)})),(n.modelValue===null||r===!1)&&v(o)}function v(o){e.value!==!1&&(e.value=!1,s("beforeHide",o),d!==void 0?d(o):s("hide",o))}function g(o){n.disable===!0&&o===!0?n["onUpdate:modelValue"]!==void 0&&s("update:modelValue",!1):o===!0!==e.value&&(o===!0?w:v)(u)}b(()=>n.modelValue,g),l!==void 0&&x(f)===!0&&b(()=>m.$route.fullPath,()=>{l.value===!0&&e.value===!0&&c()}),E===!0&&H(()=>{g(n.modelValue)});const h={show:p,hide:c,toggle:S};return Object.assign(m,h),h}const U=[null,document,document.body,document.scrollingElement,document.documentElement];function O(e,t){let l=L(t);if(l===void 0){if(e==null)return window;l=e.closest(".scroll,.scroll-y,.overflow-auto")}return U.includes(l)?window:l}function z(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function B(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let a;function F(){if(a!==void 0)return a;const e=document.createElement("p"),t=document.createElement("div");T(e,{width:"100%",height:"200px"}),T(t,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(e),document.body.appendChild(t);const l=e.offsetWidth;t.style.overflow="scroll";let i=e.offsetWidth;return l===i&&(i=t.clientWidth),t.remove(),a=l-i,a}function I(e,t=!0){return!e||e.nodeType!==Node.ELEMENT_NODE?!1:t?e.scrollHeight>e.clientHeight&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-y"])):e.scrollWidth>e.clientWidth&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-x"]))}function X(){let e=null;const t=V();function l(){e!==null&&(clearTimeout(e),e=null)}return M(l),P(l),{removeTimeout:l,registerTimeout(i,d){l(),W(t)===!1&&(e=setTimeout(i,d))}}}function Y(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),C.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}export{D as a,X as b,Y as c,N as d,O as e,B as f,F as g,z as h,I as i,R as u};
