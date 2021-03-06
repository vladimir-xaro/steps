import EventEmitter, { I_EventEmitter } from '@xaro/event-emitter';
import { I_Control, I_ControlConstructorConfig, I_ControlSettings, I_ControlValidators, I_Steps, I_StepsControls } from "./types";
import { CONTROLS, DEFAULT_CONTROLS } from "./settings";

export default class Control implements I_Control {
  steps:      I_Steps;
  emitter:    I_EventEmitter;

  key:        string;

  isLock:     boolean;
  isVisible:  boolean;

  el?:        HTMLElement;

  validators: I_ControlValidators

  constructor(config: I_ControlConstructorConfig) {
    this.steps      = config.steps;
    this.emitter    = new EventEmitter(config.on);

    this.key        = config.key;

    this.isLock     = config.hasOwnProperty('isLock')     ? config.isLock!    : false;
    this.isVisible  = config.hasOwnProperty('isVisible')  ? config.isVisible! : true;

    this.validators = {
      visibleIf: config.visibleIf || CONTROLS[this.key].visibleIf
    };

    if (config.el) {
      this.el = config.el;

      this.el.addEventListener('click', this.click.bind(this));
    }

    this.emitter.emit('init', this);
  }

  click(): void {
    if (this.isLock) {
      return;
    }

    this.emitter.emit('click', this);
  }

  hide(): void {
    if (!this.isVisible || !(this.el instanceof HTMLElement)) {
      return;
    }

    this.emitter.emit('beforeHide', this);

    this.isVisible = false;

    this.el.classList.add('hidden');

    this.emitter.emit('afterHide', this);
  }

  show(): void {
    if (this.isVisible || !(this.el instanceof HTMLElement)) {
      return;
    }

    this.emitter.emit('beforeShow', this);

    this.isVisible = true;

    this.el.classList.remove('hidden');

    this.emitter.emit('afterShow', this);
  }

  lock(): void {
    if (this.isLock) {
      return;
    }

    this.emitter.emit('beforeLock', this);

    this.isLock = true;

    this.emitter.emit('afterLock', this);
  }
  
  unlock(): void {
    if (! this.isLock) {
      return;
    }

    this.emitter.emit('beforeUnlock', this);

    this.isLock = false;

    this.emitter.emit('afterUnlock', this);
  }
}