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
var RDH = /** @class */ (function (_super) {
    __extends(RDH, _super);
    function RDH() {
        var _this = _super.call(this, { key: "RDH" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    RDH.prototype.preload = function () {
        this.load.image("uccFinalFrameRDH", "../public/images/ucc_final_rdh_frame.png");
        this.load.image("rdh", "../public/images/rdh.png");
        this.load.image("lsue", "../public/images/lsue.png");
        this.load.image("launcher_module_enclosure", "../public/images/launcher_module_enclosure.png");
        this.load.image("lsue_line_fix", "../public/images/lsue_line_fix.png");
    };
    RDH.prototype.create = function () {
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
    RDH.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "blah11";
        Sim.currentScene = "RDH";
        var sc = this;
        var cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1071, 451.5);
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var uccFinalFrameRDH = this.add.image(0, -1.75, "uccFinalFrameRDH");
        uccFinalFrameRDH.setOrigin(0, 0);
        uccFinalFrameRDH.setDisplaySize(width + 2, height + 4);
        var rdh = this.add.image(725, 177, "rdh");
        rdh.setOrigin(0, 0);
        rdh.setDisplaySize(37, 133);
        rdh.alpha = 0;
        this.add.tween({
            targets: [rdh],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 5000,
            alpha: {
                getStart: function () { return 0; },
                getEnd: function () { return 1; }
            },
            onComplete: function () {
                rdh.alpha = 1;
                var lsue = _this.add.image(484, 52, "lsue");
                lsue.setOrigin(0, 0);
                lsue.setDisplaySize(405, 385.4);
                lsue.alpha = 0;
                var lineFix = _this.add.image(580, 421.5, "lsue_line_fix");
                lineFix.setOrigin(0, 0);
                lineFix.setDisplaySize(14, 20);
                lineFix.alpha = 0;
                _this.add.tween({
                    targets: [lsue, lineFix],
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    delay: 1000,
                    alpha: {
                        getStart: function () { return 0; },
                        getEnd: function () { return 1; }
                    },
                    onComplete: function () {
                        lsue.alpha = 1;
                        lineFix.alpha = 1;
                        var launcherModuleEnclosure = _this.add.image(859, 154, "launcher_module_enclosure");
                        launcherModuleEnclosure.setOrigin(0, 0);
                        launcherModuleEnclosure.setDisplaySize(205, 189);
                        launcherModuleEnclosure.alpha = 0;
                        _this.add.tween({
                            targets: [launcherModuleEnclosure],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 3500,
                            alpha: {
                                getStart: function () { return 0; },
                                getEnd: function () { return 1; }
                            },
                            onComplete: function () {
                                _this.time.delayedCall(28000, function () {
                                    Sim.output.innerHTML = '';
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    cam.fadeOut(500);
                                    _this.time.delayedCall(600, function () {
                                        Sim.currentScene = "";
                                        _this.scene.stop("RDH");
                                        Sim.output.innerHTML = "";
                                        Sim.setComplete();
                                    }, [], _this);
                                }, [], _this);
                            }
                        });
                    }
                });
            }
        });
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 100;
        this.time.delayedCall(500, function () {
            AudioNarration.timeupdate = function () {
                if (Math.floor(AudioNarration.currentTime) > 118) {
                    Sim.output.innerHTML = "\n                        <p>Power from the Deckhouse Support Building is distributed \n                        throughout the Building Automated System which controls \n                        subsystems like the Chilled Water, Hot Water, Compressed Air, \n                        Heating Ventilation Air Conditioning, and Makeup Air Units, among \n                        other systems that support the Aegis Combat System.</p>\n                    ";
                }
            };
            AudioNarration.play();
        }, [], this);
    };
    return RDH;
}(Phaser.Scene));
//# sourceMappingURL=RDH.js.map