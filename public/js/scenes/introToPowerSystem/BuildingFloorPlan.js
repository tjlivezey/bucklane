/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Loader.ts" />
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
var BuildingFloorPlan = /** @class */ (function (_super) {
    __extends(BuildingFloorPlan, _super);
    function BuildingFloorPlan() {
        var _this = _super.call(this, { key: "BuildingFloorPlan" }) || this;
        _this.$ = window["jQuery"];
        return _this;
    }
    BuildingFloorPlan.prototype.preload = function () {
        this.load.image("aaFacilityFloorPlan", "../public/images/AA_Facility_Romania_floorplan.png");
        this.load.image("aaFacilityElectricalCallout", "../public/images/AA_Facility_Romania_Floorplan_Electrical_Rooms.png");
    };
    BuildingFloorPlan.prototype.create = function () {
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
    BuildingFloorPlan.prototype.start = function () {
        var _this = this;
        Sim.output.innerHTML = "\n                <p>blah2 \n                    sophisticated, automated, high performance and highly \n                    redundant building support ecosystem that is required to \n                    meet the strict tolerances of the \n                    Aegis Combat System.</p>\n            ";
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 18.5;
        AudioNarration.play();
        Sim.currentScene = "BuildingFloorPlan";
        var sc = this;
        var width = this.sys.game.config.width;
        var height = this.sys.game.config.height;
        var cam = this.cameras.main;
        AudioNarration.timeupdate = function () {
            if (Math.floor(AudioNarration.currentTime) > 32) {
                AudioNarration.pause();
            }
        };
        var aaFacilityFloorPlan = this.add.image(0, 0, "aaFacilityFloorPlan");
        aaFacilityFloorPlan.setOrigin(0, 0);
        aaFacilityFloorPlan.setDisplaySize(width, height);
        var aaFacilityElectricalCallout = this.add.image(0, 0, "aaFacilityElectricalCallout");
        aaFacilityElectricalCallout.setOrigin(0, 0);
        aaFacilityElectricalCallout.setDisplaySize(width, height);
        this.time.delayedCall(9000, function () {
            cam.zoomTo(1.2, 1500);
            _this.add.tween({
                targets: aaFacilityFloorPlan,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 500,
                alpha: {
                    getStart: function () { return 1; },
                    getEnd: function () { return .5; }
                },
                onComplete: function () {
                    _this.time.delayedCall(3500, function () {
                        AudioNarration.pause();
                        _this.time.delayedCall(900, function () {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            sc.scene.stop("BuildingFloorPlan");
                            Sim.game.scene.start("InputModuleAB");
                        }, [], _this);
                    }, [], _this);
                }
            });
        }, [], this);
    };
    return BuildingFloorPlan;
}(Phaser.Scene));
//# sourceMappingURL=BuildingFloorPlan.js.map