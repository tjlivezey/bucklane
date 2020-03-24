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
var OutputTransformers = /** @class */ (function (_super) {
    __extends(OutputTransformers, _super);
    function OutputTransformers() {
        var _this = _super.call(this, { key: "OutputTransformers" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    OutputTransformers.prototype.preload = function () {
        this.load.image("uccOutputTransformerFinalFrame", "../public/images/ucc_final_frame_output_transformer.png");
        this.load.image("output_transformer", "../public/images/output_transformer.png");
    };
    OutputTransformers.prototype.create = function () {
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
    OutputTransformers.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "\n            <p>blah9";
        Sim.currentScene = "OutputTransformers";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccOutputTransformerFinalFrame = this.add.image(0, 0, "uccOutputTransformerFinalFrame");
        uccOutputTransformerFinalFrame.setOrigin(0, 0);
        uccOutputTransformerFinalFrame.setDisplaySize(width, height);
        var output_transformerA = this.add.image(277, 36, "output_transformer");
        output_transformerA.setOrigin(0, 0);
        output_transformerA.setDisplaySize(32, 34);
        output_transformerA.alpha = 0;
        var output_transformerB = this.add.image(277, 409, "output_transformer");
        output_transformerB.setOrigin(0, 0);
        output_transformerB.setDisplaySize(32, 34);
        output_transformerB.alpha = 0;
        this.add.tween({
            targets: [output_transformerA, output_transformerB],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 5000,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                output_transformerA.alpha = 1;
                output_transformerB.alpha = 1;
                _this.time.delayedCall(2000, function () {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("Deckhouse");
                    _this.time.delayedCall(1000, function () {
                        _this.scene.stop("OutputTransformers");
                    }, [], _this);
                }, [], _this);
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 76;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 88) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return OutputTransformers;
}(Phaser.Scene));
//# sourceMappingURL=OutputTransformers.js.map