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
var Deckhouse = /** @class */ (function (_super) {
    __extends(Deckhouse, _super);
    function Deckhouse() {
        var _this = _super.call(this, { key: "Deckhouse" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    Deckhouse.prototype.preload = function () {
        this.load.image("uccFinalFrameDeckhouseFeed", "../public/images/ucc_final_frame_deckhouse_feed.png");
        this.load.image("switchGearsCenter", "../public/images/switch_gears_center.png");
        this.load.image("switchGearsLeft", "../public/images/switch_gears_left.png");
        this.load.image("f13f14", "../public/images/f13_f14.png");
        this.load.image("f21f23", "../public/images/f21_f23.png");
        this.load.image("dhsb_a", "../public/images/dhsb_a.png");
        this.load.image("dhsb_b", "../public/images/dhsb_b.png");
        this.load.image("dhsb_module", "../public/images/dhsb_a_module.png");
        this.load.image("dhsb_low_volt", "../public/images/dhsb_low_volt.png");
        this.load.image("rdh", "../public/images/rdh.png");
    };
    Deckhouse.prototype.create = function () {
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
    Deckhouse.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "\n            <p>blah4 \n            redundant 60 Hertz, 4160-volt power to the Deckhouse \n            Support Building.</p>\n        ";
        Sim.currentScene = "Deckhouse";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1068, 448);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccFinalFrameDeckhouseFeed = this.add.image(0, 0, "uccFinalFrameDeckhouseFeed");
        uccFinalFrameDeckhouseFeed.setOrigin(0, 0);
        uccFinalFrameDeckhouseFeed.setDisplaySize(width, height);
        var switchGearsCenter = this.add.image(307.7, 45.5, "switchGearsCenter");
        switchGearsCenter.setOrigin(0, 0);
        switchGearsCenter.setDisplaySize(177, 402.5);
        switchGearsCenter.alpha = 0;
        var switchGearsLeft = this.add.image(224, 145, "switchGearsLeft");
        switchGearsLeft.setOrigin(0, 0);
        switchGearsLeft.setDisplaySize(84, 252);
        switchGearsLeft.alpha = 0;
        var f13f14 = this.add.image(483, 114, "f13f14");
        f13f14.setOrigin(0, 0);
        f13f14.setDisplaySize(110.1, 52);
        f13f14.alpha = 0;
        var f21f23 = this.add.image(483, 332.5, "f21f23");
        f21f23.setOrigin(0, 0);
        f21f23.setDisplaySize(109.5, 52);
        f21f23.alpha = 0;
        this.add.tween({
            targets: [switchGearsLeft, f13f14, f21f23, switchGearsCenter],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 2000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                f13f14.alpha = 1;
                f21f23.alpha = 1;
                switchGearsCenter.alpha = 1;
                switchGearsLeft.alpha = 1;
                var dhsbA = _this.add.image(484.5, 83, "dhsb_a");
                dhsbA.setOrigin(0, 0);
                dhsbA.setDisplaySize(193.5, 26.5);
                dhsbA.alpha = 0;
                var dhsbB = _this.add.image(484.5, 380, "dhsb_b");
                dhsbB.setOrigin(0, 0);
                dhsbB.setDisplaySize(193.5, 25);
                dhsbB.alpha = 0;
                var dhsbAModule = _this.add.image(657, 109.5, "dhsb_module");
                dhsbAModule.setOrigin(0, 0);
                dhsbAModule.setDisplaySize(39, 27);
                dhsbAModule.alpha = 0;
                var dhsbBModule = _this.add.image(657.4, 353, "dhsb_module");
                dhsbBModule.setOrigin(0, 0);
                dhsbBModule.setDisplaySize(39, 27);
                dhsbBModule.alpha = 0;
                var dhsbLowVolt = _this.add.image(667.6, 136, "dhsb_low_volt");
                dhsbLowVolt.setOrigin(0, 0);
                dhsbLowVolt.setDisplaySize(23, 217);
                dhsbLowVolt.alpha = 0;
                _this.add.tween({
                    targets: [dhsbA, dhsbB, dhsbAModule, dhsbBModule, dhsbLowVolt],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 6000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        dhsbA.alpha = 1;
                        dhsbB.alpha = 1;
                        dhsbAModule.alpha = 1;
                        dhsbBModule.alpha = 1;
                        dhsbLowVolt.alpha = 1;
                        _this.time.delayedCall(1500, function () {
                            AudioNarration.pause();
                            Sim.output.innerHTML = "";
                            Sim.removeResources();
                            Sim.game.scene.start("RDH");
                            _this.time.delayedCall(1000, function () {
                                _this.scene.stop("Deckhouse");
                            }, [], _this);
                        }, [], _this);
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 89;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 99) {
                    AudioNarration.pause();
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return Deckhouse;
}(Phaser.Scene));
//# sourceMappingURL=Deckhouse.js.map