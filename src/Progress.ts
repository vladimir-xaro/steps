import EventEmitter, { I_EventEmitter } from "@xaro/event-emitter";
import { I_Progress, I_ProgressConstructorConfig, I_Steps } from "./types";

export default class Progress implements I_Progress {
  steps:    I_Steps;
  emitter:  I_EventEmitter;

  el?:      HTMLElement;
  lineEl?:  HTMLElement;

  constructor(config: I_ProgressConstructorConfig) {
    this.steps    = config.steps;
    this.emitter  = new EventEmitter(config.on);

    if (config.el) {
      this.el     = config.el;
      this.lineEl = this.el.querySelector('.progress-line') as HTMLElement;
    }

    this.emitter.emit('init', this);
  }

  get width(): number {
    return this.steps.current / this.steps.last * 100;
  }

  update() {
    if (this.lineEl) {
      console.log('progress')
      this.lineEl.style.width = this.width + '%';
    }
  }
}