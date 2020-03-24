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
var InputTransformers = /** @class */ (function (_super) {
    __extends(InputTransformers, _super);
    function InputTransformers() {
        var _this = _super.call(this, { key: "InputTransformers" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    InputTransformers.prototype.preload = function () {
        this.load.image("uccTransformerFinalFrame", "../public/images/ucc_final_frame_input_transformers.png");
        this.load.image("inputTransformer", "../public/images/input_transformer.png");
        this.load.image("cnv", "../public/images/cnv.png");
    };
    InputTransformers.prototype.create = function () {
        this.events.on('pause', function () {
            if (AudioNarration.playing) {
                AudioNarration.pause();
            }
        }, this);
        this.events.on('resume', function () {
            if (AudioNarration.paused) {
                AudioNarration.play();
            }
        }, this);
        this.start();
    };
    InputTransformers.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "\n            <p>blah8voltage from 10 kilovolts to 1728 volts.</p>\n        ";
        Sim.currentScene = "InputTransformers";
        var sc = this;
        var cam = this.cameras.main;
        cam.alpha = 1;
        cam.visible = true;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccTransformerFinalFrame = this.add.image(0, 0, "uccTransformerFinalFrame");
        uccTransformerFinalFrame.setOrigin(0, 0);
        uccTransformerFinalFrame.setDisplaySize(width, height);
        uccTransformerFinalFrame.alpha = 1;
        uccTransformerFinalFrame.visible = true;
        var inputTransformerA = this.add.image(155, 35, "inputTransformer");
        inputTransformerA.setOrigin(0, 0);
        inputTransformerA.setDisplaySize(30, 34);
        inputTransformerA.alpha = 0;
        var inputTransformerB = this.add.image(155, 409, "inputTransformer");
        inputTransformerB.setOrigin(0, 0);
        inputTransformerB.setDisplaySize(30, 34);
        inputTransformerB.alpha = 0;
        this.add.tween({
            targets: [inputTransformerA, inputTransformerB],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 1500,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                inputTransformerA.alpha = 1;
                inputTransformerB.alpha = 1;
                var cnvA = _this.add.image(184.4, 48.6, "cnv");
                cnvA.setOrigin(0, 0);
                cnvA.setDisplaySize(62.9, 8);
                cnvA.alpha = 0;
                var cnvB = _this.add.image(184.4, 422.7, "cnv");
                cnvB.setOrigin(0, 0);
                cnvB.setDisplaySize(62.9, 8);
                cnvB.alpha = 0;
                _this.add.tween({
                    targets: [cnvA, cnvB],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 0,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        _this.time.delayedCall(1000, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("StaticFrequencyConverters");
                            sc.time.delayedCall(1000, function () {
                                sc.scene.stop("InputTransformers");
                            }, [], sc);
                        }, [], _this);
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 47;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 55) {
                    AudioNarration.destroy();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return InputTransformers;
}(Phaser.Scene));
//# sourceMappingURL=InputTransformers.js.map