/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../AudioNarration.ts" />

class IntroPowerSystem extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "IntroPowerSystem"});
    }

    preload() {
        this.load.image("buildingLandscape", "../public/images/AA_landscape-wide.png");
        this.load.image("sky", "../public/images/sky-background.png");
        this.load.image("aaBuildingCloseup", "../public/images/AA_Building_Landscape-000.png");
        this.load.image("aaBuildingFinal", "../public/images/AA_Building_Landscape-100.png");
    }

    create() {
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
    }

    start() {
        Sim.loader.style.visibility = 'hidden';
        Sim.loader.style.visibility = 'hidden';
        Sim.output.innerHTML = `
                    <p>Blah blah blah</p>
            `;

        Sim.currentScene = "IntroPowerSystem";

        let sc = this;
        let cam = this.cameras.main;
        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;
        
        cam.setBounds(0, 0, width * 1.5, height * 1.77);

        VideoAnimation.initialize('aaBuildingLandscape');
        VideoAnimation.playbackRate = 0.8;
        VideoAnimation.volume = 0;
        VideoAnimation.currentTime = 0.2;

        let sky = this.add.image(0, 0, "sky");
        sky.alpha = .8;
        sky.setOrigin(0, 0);
        sky.setDisplaySize(width * 1.3, height);

        let buildingLandscape = this.add.image(0, 0, "buildingLandscape");
        buildingLandscape.setOrigin(0, 0);
        buildingLandscape.setDisplaySize(width * 1.35, height * 1.48);

        cam.setZoom(1);
        cam.fadeIn(2000);

        cam.zoomTo(1.55, 5500);
        cam.pan(width * 1.49, height * 2.14, 5500, 'Power2');
        
        this.time.delayedCall(5500, () => {
            cam.fadeOut(300);

            cam.once('camerafadeoutcomplete', function(cam) {
                sky.destroy();
                cam.setZoom(1);
                cam.setBounds(0, 0, width, height);
                buildingLandscape.destroy();
                cam.fadeIn(300);
                cam.setOrigin(0, 0);
                
                let aaBuildingCloseup = this.add.image(0, 0, "aaBuildingCloseup");
                aaBuildingCloseup.setOrigin(0, 0);
                aaBuildingCloseup.setDisplaySize(width, height);

                this.time.delayedCall(2000, () => {
                    let aaBuildingFinal = this.add.image(0, 0, "aaBuildingFinal");
                    aaBuildingFinal.setOrigin(0, 0);
                    aaBuildingFinal.setDisplaySize(width, height);
                    
                    VideoAnimation.ended = () => {
                        cam.zoomTo(1.5, 1000);
                        cam.pan(2000, 900, 1000);

                        cam.fadeOut(1100);

                        cam.once("camerafadeoutcomplete", () => {
                            cam.setZoom(1);
                            cam.setBounds(0, 0, width, height);
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            sc.scene.stop("IntroPowerSystem");
                            Sim.game.scene.start("BuildingFloorPlan");
                        });
                    };

                    VideoAnimation.play();
                }, [], this);
            }, this);
        }, [], this);
        
        AudioNarration.initialize('introAudio');
        AudioNarration.timeupdate = () => {
            if (AudioNarration.currentTime > 16) {
                AudioNarration.pause();
            } 
        };
        
        AudioNarration.currentTime = 2;
        AudioNarration.play();
    }
}