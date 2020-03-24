/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Loader.ts" />

class BuildingFloorPlan extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "BuildingFloorPlan"});
    }

    preload() {
        this.load.image("aaFacilityFloorPlan", "../public/images/AA_Facility_Romania_floorplan.png");
        this.load.image("aaFacilityElectricalCallout", "../public/images/AA_Facility_Romania_Floorplan_Electrical_Rooms.png");
    }

    create() {
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
    }

    start() {
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = `
                <p>blah3</p>
            `;

        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 18.5;
        AudioNarration.play();

        Sim.currentScene = "BuildingFloorPlan";

        let sc = this;

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;
        let cam = this.cameras.main;

        AudioNarration.timeupdate = () => {
            if (Math.floor(AudioNarration.currentTime) > 32) {
                AudioNarration.pause();
            } 
        };

        let aaFacilityFloorPlan = this.add.image(0, 0, "aaFacilityFloorPlan");
        aaFacilityFloorPlan.setOrigin(0, 0);
        aaFacilityFloorPlan.setDisplaySize(width, height);

        let aaFacilityElectricalCallout = this.add.image(0, 0, "aaFacilityElectricalCallout");
        aaFacilityElectricalCallout.setOrigin(0, 0);
        aaFacilityElectricalCallout.setDisplaySize(width, height);

        this.time.delayedCall(9000, () => {
            cam.zoomTo(1.2, 1500);
            
            this.add.tween({
                targets: aaFacilityFloorPlan,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 500,
                alpha: {
                  getStart: () => 1,
                  getEnd: () => .5
                },
                onComplete: () => {
                    this.time.delayedCall(3500, () => {
                        AudioNarration.pause();

                        this.time.delayedCall(900, () => {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            sc.scene.stop("BuildingFloorPlan");
                            Sim.game.scene.start("InputModuleAB");
                        }, [], this);
                    }, [], this);
                }
            });
        }, [], this);
    }
}