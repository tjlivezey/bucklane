/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InputModuleAB = /** @class */ (function (_super) {
    __extends(InputModuleAB, _super);
    function InputModuleAB() {
        var _this = _super.call(this, { key: "InputModuleAB" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    InputModuleAB.prototype.preload = function () {
        this.load.image("uccFinalFrameStart", "../public/images/ucc_final_frame_start.png");
        this.load.image("inputA", "../public/images/input_a.png");
        this.load.image("inputB", "../public/images/input_b.png");
        this.load.image("inputAHighlighted", "../public/images/input_a_highlighted.png");
        this.load.image("inputBHighlighted", "../public/images/input_b_highlighted.png");
    };
    InputModuleAB.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
            if (VideoAnimation.playing) {
                VideoAnimation.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
            if (VideoAnimation.paused) {
                VideoAnimation.resume();
            }
        }, this);
        this.start();
    };
    InputModuleAB.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "\n                <p>blah6\n                    from the USG Commercial Power Substation to Input \n                    Modules A and B in the Mission Critical Power \n                    Enclosure.</p>\n            ";
        Sim.currentScene = "InputModuleAB";
        var sc = this;
        var cam = this.cameras.main;
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        VideoAnimation.initialize('uccConsoleZoom');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        var uccFinalFrameStart = this.add.image(0, 0, "uccFinalFrameStart");
        VideoAnimation.ended = function () { };
        var timeline = sc.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });
        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 7000,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return .4; }
            }
        });
        var inputA = this.add.image(4.5, 27, "inputA");
        inputA.setOrigin(0, 0);
        inputA.setDisplaySize(188, 60);
        inputA.alpha = 0;
        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 1000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        var inputB = this.add.image(3.46, 402.5, "inputB");
        inputB.setOrigin(0, 0);
        inputB.setDisplaySize(189, 58.5);
        inputB.alpha = 0;
        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 200,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            }
        });
        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            }
        });
        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return 1; },
                getEnd: function () { return 0; }
            }
        });
        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Power2',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: function () { return .4; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                timeline.destroy();
                var inputA_highlighted = _this.add.image(4.5, 27, "inputAHighlighted");
                inputA_highlighted.setOrigin(0, 0);
                inputA_highlighted.setDisplaySize(188, 60);
                inputA_highlighted.alpha = 0;
                var inputB_highlighted = _this.add.image(3.46, 402.5, "inputBHighlighted");
                inputB_highlighted.setOrigin(0, 0);
                inputB_highlighted.setDisplaySize(189, 58.5);
                inputB_highlighted.alpha = 0;
                _this.add.tween({
                    targets: [inputA_highlighted, inputB_highlighted],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 500,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    }
                });
                _this.time.delayedCall(2000, function () {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("InputTransformers");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("InputModuleAB");
                    }, [], sc);
                }, [], _this);
            }
        });
        timeline.play();
        VideoAnimation.play();
        uccFinalFrameStart.setOrigin(0, 0);
        uccFinalFrameStart.setDisplaySize(width, height);
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 34;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (AudioNarration.currentTime > 46.8) {
                    AudioNarration.destroy();
                }
            };
            AudioNarration.play();
        }, [], sc);
    };
    return InputModuleAB;
}(Phaser.Scene));
//# sourceMappingURL=InputModuleAB.js.map