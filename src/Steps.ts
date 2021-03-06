import EventEmitter, { I_EventEmitter } from '@xaro/event-emitter';
import Control from './Control';
import { generateEventName } from './helpers';
import Progress from './Progress';
import { CONTROLS } from './settings';
import Step from './Step';
import { I_Steps, I_StepsConstructorConfig, I_Step, I_StepConstructorConfig, I_StepsControls, I_Progress, I_Control } from './types';

export default class Steps implements I_Steps {
  emitter:          I_EventEmitter;
  
  items:            I_Step[]        = [];
  itemsWrapperEl?:  HTMLElement;

  controls:         I_StepsControls = {};

  progress?:        I_Progress;

  current:          number          = 0;

  el?:              HTMLElement;

  constructor(config?: I_StepsConstructorConfig) {
    if (! config) {
      throw new Error('Config is not exists');
    }

    this.emitter = new EventEmitter(config.on);

    if (config.el) {
      this.el = config.el;
    }

    /** create steps */
    if (config.items && config.items instanceof Object) {
      for (const stepSetting of config.items) {
        const step = new Step({
          steps: this,
          ...stepSetting
        });

        this.items.push(step);
      }
    }

    this.current = 0; // current step index

    /** create controls */
    if (config.controls) {

      if (Array.isArray(config.controls)) {

      } else if (config.controls instanceof Object) {
        for (const key in config.controls) {
          if (CONTROLS.hasOwnProperty(key)) {
            // // ===
            // console.log({
            //   on: {
            //     click: this[key]
            //   },
            //   ...config.controls[key]
            // });
            // // ===

            const control: I_Control = new Control({
              steps: this,
              key,
              ...config.controls[key]
            })

            control.emitter.subscribe('click', this[key].bind(this));

            this.controls[key] = control;
          }
        }

        this.fixVisibility();
      }

    } else {
    }
    // this.controls = Control.createDefaultControls({
    //   emitter:  this.emitter,
    //   controls: config.controls
    // });


    /** create progress */
    if (config.progress) {
      this.progress = new Progress({
        steps: this,
        ...config.progress
      });
      
      this.progress.update();
    }

    this.emitter.emit('init', this);
  }

  /**
   * Get last index of stepItems
   */
  get last() {
    return this.items.length - 1;
  }

  prev(): void {
    if (this.current < 1) {
      return;
    }

    // if (this.controls.prev) {
    //   this.controls.prev[this.current === 1 ? 'hide' : 'show']()
    // }
    this.items[this.current].hide();

    this.current--;

    this.fixVisibility();

    if (this.progress) {
      this.progress.update();
    }

    this.items[this.current].show();

    console.log('Steps::prev(), current index = ' + this.current);
  }

  next(): void {
    if (this.current >= this.last) {
      console.log('Steps::next() ======>')
      return;
    }

    // if (this.controls.next) {
    //   this.controls.next[this.current === this.last - 1 ? 'hide' : 'show']()
    // }

    this.items[this.current].hide();

    this.current++;

    this.fixVisibility();

    if (this.progress) {
      this.progress.update();
    }
 
    this.items[this.current].show();

    console.log('Steps::next(), current index = ' + this.current);
  }

  fixVisibility(): void {
    if (! this.controls) {
      return;
    }

    for (const key in this.controls) {
      const control = this.controls[key];

      // if (control.isAllowVisible()) {
      if (control.validators.visibleIf(this)) {
        !control.isVisible && control.show();
      } else {
        control.isVisible && control.hide();
      }
    }
  }

  destroy() {

  }
}