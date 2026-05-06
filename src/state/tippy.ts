import { delegate, type DelegateInstance, type Props } from 'tippy.js';

let tippyInst: DelegateInstance<Props>;

export function initializeTippy() {
  if (tippyInst) {
    tippyInst.destroy();
  }

  tippyInst = delegate(document.body, {
    target: '[data-tippy-content]',
    allowHTML: true
  });
}