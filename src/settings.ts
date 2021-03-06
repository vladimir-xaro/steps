import { I_Control, I_Steps } from "./types";

export const CONTROLS: Object = {
  prev: {
    visibleIf(steps: I_Steps): boolean {
      return steps.current > 0;
    },
    on: {
      click:  (control: I_Control) => {

      },
      lock:   (control: I_Control) => {

      },
      unlock: (control: I_Control) => {

      }
    }
  },
  next: {
    visibleIf(steps: I_Steps): boolean {
      return steps.current < steps.last - 1;
    },
    on: {
      click:  (control: I_Control) => {

      },
      lock:   (control: I_Control) => {

      },
      unlock: (control: I_Control) => {

      }
    }
  }
};

export const STEPS: Object = {
  
}

export const DEFAULT_CONTROLS: string[] = [
  'prev', 'next'
];