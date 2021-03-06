import { I_EventEmitter, I_EventEmitterConstructorConfig } from '@xaro/event-emitter';

/**
 * Steps
 */
export interface I_Steps {
  emitter:          I_EventEmitter;
  items:            I_Step[];
  itemsWrapperEl?:  HTMLElement;
  controls:         I_StepsControls;
  progress?:        I_Progress;
  
  current:          number;
  last:             number;

  el?:              HTMLElement;

  prev():     void;
  next():     void;
  destroy():  void;
}

export interface I_StepsConstructorConfig extends Object {
  on?:        I_EventEmitterConstructorConfig;
  items?:     I_StepSettings[];
  controls?:  string[] | { [key: string]: I_ControlSettings };
  progress?:  I_ProgressSettings;
  el?:        HTMLElement;
  selectors?: {
    progress?:      string;
    progressLine?:  string;
    steps?:         string;
    step?:          string;
    back?:          string;
    next?:          string;
  },
  classes?: {
    hidden?:  string,
    visible?: string,
  }
}

export interface I_StepsControls {
  [key: string]: I_Control;
}

/**
 * Step
 */
export interface I_Step {
  steps:    I_Steps;
  emitter:  I_EventEmitter;
  el?:      HTMLElement;
  isFinal:  boolean;

  hide(): void;
  show(): void;
}

export interface I_StepSettings {
  name?:    string;
  el?:      HTMLElement;
  isFinal?: boolean;
  on?: {
    init?:        (step: I_Step) => void;
    beforeHide?:  (step: I_Step) => void;
    afterHide?:   (step: I_Step) => void;
    beforeShow?:  (step: I_Step) => void;
    afterShow?:   (step: I_Step) => void;
  }
}

export interface I_StepConstructorConfig extends Object, I_StepSettings {
  steps: I_Steps;
}

export interface I_StepEvents {
  beforeShow?:    Function | Function[];
  afterShow?:     Function | Function[];

  beforeHide?:    Function | Function[];
  afterHide?:     Function | Function[];

  changeStatus?:  Function | Function[];
}


/**
 * Control
 */
export interface I_Control {
  steps:      I_Steps;
  emitter:    I_EventEmitter;

  key:        string;

  isLock:     boolean;
  isVisible:  boolean;

  el?:        HTMLElement;

  validators: I_ControlValidators;

  lock():   void;
  unlock(): void;
  hide():   void;
  show():   void;
}

export interface I_ControlValidators {
  visibleIf:  (steps: I_Steps) => boolean;
}

export interface I_ControlSettings {
  // name:     string;
  isLock?:    boolean;
  isVisible?: boolean;

  el?:        HTMLElement;

  visibleIf?: (steps: I_Steps) => boolean;

  on?: {
    init?:        (control: I_Control) => void;
    click?:       (control: I_Control) => void;
    lock?:        (control: I_Control) => void;
    unlock?:      (control: I_Control) => void;
    beforeHide?:  (control: I_Control) => void;
    afterHide?:   (control: I_Control) => void;
    beforeShow?:  (control: I_Control) => void;
    afterShow?:   (control: I_Control) => void;
  };
}

export interface I_ControlConstructorConfig extends Object, I_ControlSettings {
  steps:  I_Steps;
  key:    string;
}


/**
 * Progress
 */
export interface I_Progress {
  steps:    I_Steps;
  emitter:  I_EventEmitter;

  el?:      HTMLElement;
  lineEl?:  HTMLElement;

  width:    number;

  update(): void;
}

export interface I_ProgressSettings {
  el?: HTMLElement;
  on?: {
    init?:          (progress: I_Progress) => void;
    beforeChange?:  (progress: I_Progress) => void;
    afterChange?:   (progress: I_Progress) => void;
  }
}

export interface I_ProgressConstructorConfig extends Object, I_ProgressSettings {
  steps: I_Steps;
}