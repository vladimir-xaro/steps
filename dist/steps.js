var Steps = (function () {
    'use strict';

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    class EventEmitter {
        constructor(on = {}) {
            this.events = {};
            for (let key in on) {
                if (on[key]) {
                    this.subscribe(key, on[key]);
                }
            }
        }
        subscribe(key, cb) {
            if (!this.has(key)) {
                this.events[key] = [];
            }
            let removes = [];
            if (Array.isArray(cb)) {
                for (const _cb of cb) {
                    removes.push(...this.subscribe(key, _cb));
                }
            }
            else {
                this.events[key].push(cb);
                removes.push(() => this.removeListener(key, cb));
            }
            return removes;
        }
        unsubscribe(...keys) {
            for (const key of keys) {
                if (this.events[key]) {
                    delete this.events[key];
                }
            }
        }
        removeListener(key, cb) {
            if (Array.isArray(this.events[key])) {
                const idx = this.events[key].indexOf(cb);
                if (idx > -1) {
                    this.events[key].splice(idx, 1);
                }
            }
        }
        once(key, cb) {
            const remove = this.subscribe(key, () => {
                remove[0]();
                Array.isArray(cb) ? cb.forEach(_cb => _cb()) : cb();
            });
        }
        has(key) {
            return !!this.events[key];
        }
        listenerCount(key) {
            if (!this.events.hasOwnProperty(key)) {
                return false;
            }
            return this.events[key].length;
        }
        emit(key, ...args) {
            const event = this.events[key];
            if (event) {
                for (let cb of event) {
                    cb(...args);
                }
            }
        }
        validateEmit(key, ...args) {
            const event = this.events[key];
            if (!event) {
                return false;
            }
            for (const cb of event) {
                if (!cb(...args)) {
                    return false;
                }
            }
            return true;
        }
        seriesEmit(key, ...args) {
            const event = this.events[key];
            if (!event) {
                return;
            }
            let params;
            for (let i = 0; i < event.length; i++) {
                if (i === 0) {
                    params = event[i](...args);
                }
                else {
                    params = event[i](params);
                }
            }
            return params;
        }
    }

    var CONTROLS = {
        prev: {
            visibleIf: function (steps) {
                return steps.current > 0;
            },
            on: {
                click: function (control) {
                },
                lock: function (control) {
                },
                unlock: function (control) {
                }
            }
        },
        next: {
            visibleIf: function (steps) {
                return steps.current < steps.last - 1;
            },
            on: {
                click: function (control) {
                },
                lock: function (control) {
                },
                unlock: function (control) {
                }
            }
        }
    };

    var Control = /** @class */ (function () {
        function Control(config) {
            this.steps = config.steps;
            this.emitter = new EventEmitter(config.on);
            this.key = config.key;
            this.isLock = config.hasOwnProperty('isLock') ? config.isLock : false;
            this.isVisible = config.hasOwnProperty('isVisible') ? config.isVisible : true;
            this.validators = {
                visibleIf: config.visibleIf || CONTROLS[this.key].visibleIf
            };
            if (config.el) {
                this.el = config.el;
                this.el.addEventListener('click', this.click.bind(this));
            }
            this.emitter.emit('init', this);
        }
        Control.prototype.click = function () {
            if (this.isLock) {
                return;
            }
            this.emitter.emit('click', this);
        };
        Control.prototype.hide = function () {
            if (!this.isVisible || !(this.el instanceof HTMLElement)) {
                return;
            }
            this.emitter.emit('beforeHide', this);
            this.isVisible = false;
            this.el.classList.add('hidden');
            this.emitter.emit('afterHide', this);
        };
        Control.prototype.show = function () {
            if (this.isVisible || !(this.el instanceof HTMLElement)) {
                return;
            }
            this.emitter.emit('beforeShow', this);
            this.isVisible = true;
            this.el.classList.remove('hidden');
            this.emitter.emit('afterShow', this);
        };
        Control.prototype.lock = function () {
            if (this.isLock) {
                return;
            }
            this.emitter.emit('beforeLock', this);
            this.isLock = true;
            this.emitter.emit('afterLock', this);
        };
        Control.prototype.unlock = function () {
            if (!this.isLock) {
                return;
            }
            this.emitter.emit('beforeUnlock', this);
            this.isLock = false;
            this.emitter.emit('afterUnlock', this);
        };
        return Control;
    }());

    var Progress = /** @class */ (function () {
        function Progress(config) {
            this.steps = config.steps;
            this.emitter = new EventEmitter(config.on);
            if (config.el) {
                this.el = config.el;
                this.lineEl = this.el.querySelector('.progress-line');
            }
            this.emitter.emit('init', this);
        }
        Object.defineProperty(Progress.prototype, "width", {
            get: function () {
                return this.steps.current / this.steps.last * 100;
            },
            enumerable: false,
            configurable: true
        });
        Progress.prototype.update = function () {
            if (this.lineEl) {
                console.log('progress');
                this.lineEl.style.width = this.width + '%';
            }
        };
        return Progress;
    }());

    /**
     * Events::Step
     * before
     */
    var Step = /** @class */ (function () {
        function Step(config) {
            this.steps = config.steps;
            this.emitter = new EventEmitter(config.on);
            this.isVisible = false;
            this.isFinal = config.hasOwnProperty('isFinal') ? config.isFinal : false;
            if (config.el) {
                this.el = config.el;
            }
            this.emitter.emit('init', this);
        }
        Object.defineProperty(Step.prototype, "visible", {
            get: function () {
                return this.isVisible;
            },
            set: function (value) {
                if (this.el) {
                    this.el.classList[value ? 'add' : 'remove']('visible');
                }
                this.isVisible = value;
            },
            enumerable: false,
            configurable: true
        });
        Step.prototype.hide = function () {
            this.emitter.emit('beforeHide', this);
            this.visible = false;
            this.emitter.emit('afterHide', this);
        };
        Step.prototype.show = function () {
            this.emitter.emit('beforeShow', this);
            this.visible = true;
            this.emitter.emit('afterShow', this);
        };
        return Step;
    }());

    var Steps = /** @class */ (function () {
        function Steps(config) {
            this.items = [];
            this.controls = {};
            this.current = 0;
            if (!config) {
                throw new Error('Config is not exists');
            }
            this.emitter = new EventEmitter(config.on);
            if (config.el) {
                this.el = config.el;
            }
            /** create steps */
            if (config.items && config.items instanceof Object) {
                for (var _i = 0, _a = config.items; _i < _a.length; _i++) {
                    var stepSetting = _a[_i];
                    var step = new Step(__assign({ steps: this }, stepSetting));
                    this.items.push(step);
                }
            }
            this.current = 0; // current step index
            /** create controls */
            if (config.controls) {
                if (Array.isArray(config.controls)) ;
                else if (config.controls instanceof Object) {
                    for (var key in config.controls) {
                        if (CONTROLS.hasOwnProperty(key)) {
                            // // ===
                            // console.log({
                            //   on: {
                            //     click: this[key]
                            //   },
                            //   ...config.controls[key]
                            // });
                            // // ===
                            var control = new Control(__assign({ steps: this, key: key }, config.controls[key]));
                            control.emitter.subscribe('click', this[key].bind(this));
                            this.controls[key] = control;
                        }
                    }
                    this.fixVisibility();
                }
            }
            // this.controls = Control.createDefaultControls({
            //   emitter:  this.emitter,
            //   controls: config.controls
            // });
            /** create progress */
            if (config.progress) {
                this.progress = new Progress(__assign({ steps: this }, config.progress));
                this.progress.update();
            }
            this.emitter.emit('init', this);
        }
        Object.defineProperty(Steps.prototype, "last", {
            /**
             * Get last index of stepItems
             */
            get: function () {
                return this.items.length - 1;
            },
            enumerable: false,
            configurable: true
        });
        Steps.prototype.prev = function () {
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
        };
        Steps.prototype.next = function () {
            if (this.current >= this.last) {
                console.log('Steps::next() ======>');
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
        };
        Steps.prototype.fixVisibility = function () {
            if (!this.controls) {
                return;
            }
            for (var key in this.controls) {
                var control = this.controls[key];
                // if (control.isAllowVisible()) {
                if (control.validators.visibleIf(this)) {
                    !control.isVisible && control.show();
                }
                else {
                    control.isVisible && control.hide();
                }
            }
        };
        Steps.prototype.destroy = function () {
        };
        return Steps;
    }());

    return Steps;

}());
//# sourceMappingURL=steps.js.map
