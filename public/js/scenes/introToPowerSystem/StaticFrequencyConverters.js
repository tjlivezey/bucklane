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
var StaticFrequencyConverters = /** @class */ (function (_super) {
    __extends(StaticFrequencyConverters, _super);
    function StaticFrequencyConverters() {
        var _this = _super.call(this, { key: "StaticFrequencyConverters" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    StaticFrequencyConverters.prototype.preload = function () {
        this.load.image("uccStaticConverterFinalFrame", "../public/images/ucc_static_converter_final_frame.png");
        this.load.image("cnv60", "../public/images/cnv_60.png");
    };
    StaticFrequencyConverters.prototype.create = function () {
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
    StaticFrequencyConverters.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "blah14";
        Sim.currentScene = "StaticFrequencyConverters";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccStaticConverterFinalFrame = this.add.image(0, 0, "uccStaticConverterFinalFrame");
        uccStaticConverterFinalFrame.setOrigin(0, 0);
        uccStaticConverterFinalFrame.setDisplaySize(width, height);
        var cnv60A = this.add.image(246.5, 35, "cnv60");
        cnv60A.setOrigin(0, 0);
        cnv60A.setDisplaySize(32, 34);
        cnv60A.alpha = 0;
        var cnv60B = this.add.image(246, 409, "cnv60");
        cnv60B.setOrigin(0, 0);
        cnv60B.setDisplaySize(32, 34);
        cnv60B.alpha = 0;
        this.add.tween({
            targets: [cnv60A, cnv60B],
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
                cnv60A.alpha = 1;
                cnv60B.alpha = 1;
                _this.time.delayedCall(9000, function () {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("OutputTransformers");
                    sc.time.delayedCall(1000, function () {
                        sc.scene.stop("StaticFrequencyConverters");
                    }, [], sc);
                }, [], _this);
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 56;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 75) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return StaticFrequencyConverters;
}(Phaser.Scene));
//# sourceMappingURL=StaticFrequencyConverters.js.map