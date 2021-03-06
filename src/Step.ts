import EventEmitter, { I_EventEmitter } from "@xaro/event-emitter";
import { subscribeEvents } from "./helpers";
import { I_Step, I_StepConstructorConfig, I_Steps } from "./types";

/**
 * Events::Step
 * before
 */

export default class Step implements I_Step {
  steps:      I_Steps;

  emitter:    I_EventEmitter;

  el?:        HTMLElement;

  isVisible:  boolean;

  isFinal:    boolean;

  constructor(config: I_StepConstructorConfig) {
    this.steps      = config.steps;
    this.emitter    = new EventEmitter(config.on);
    this.isVisible  = false;
    this.isFinal    = config.hasOwnProperty('isFinal') ? config.isFinal! : false;

    if (config.el) {
      this.el = config.el;
    }

    this.emitter.emit('init', this);
  }

  get visible() {
    return this.isVisible;
  }
  set visible(value: boolean) {
    if (this.el) {
      this.el.classList[value ? 'add' : 'remove']('visible');
    }

    this.isVisible = value;
  }

  hide() {
    this.emitter.emit('beforeHide', this);

    this.visible = false;

    this.emitter.emit('afterHide', this);
  }

  show() {
    this.emitter.emit('beforeShow', this);

    this.visible = true;

    this.emitter.emit('afterShow', this);
  }
}