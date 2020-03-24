/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class RDH extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "RDH"});
    }

    preload() {
        this.load.image("uccFinalFrameRDH", "../public/images/ucc_final_rdh_frame.png");
        this.load.image("rdh", "../public/images/rdh.png");
        this.load.image("lsue", "../public/images/lsue.png");
        this.load.image("launcher_module_enclosure", "../public/images/launcher_module_enclosure.png");
        this.load.image("lsue_line_fix", "../public/images/lsue_line_fix.png");
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
            <p>blah13</p>
        `;

        Sim.currentScene = "RDH";
        let sc = this;
        let cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1071, 451.5);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;

        let uccFinalFrameRDH = this.add.image(0, -1.75, "uccFinalFrameRDH");
        uccFinalFrameRDH.setOrigin(0, 0);
        uccFinalFrameRDH.setDisplaySize(width + 2, height + 4);

        let rdh = this.add.image(725, 177, "rdh");
        rdh.setOrigin(0, 0);
        rdh.setDisplaySize(37, 133);
        rdh.alpha = 0;

        this.add.tween({
            targets: [rdh],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 5000,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                rdh.alpha = 1;
                
                let lsue = this.add.image(484, 52, "lsue");
                lsue.setOrigin(0, 0);
                lsue.setDisplaySize(405, 385.4);
                lsue.alpha = 0;

                let lineFix = this.add.image(580, 421.5, "lsue_line_fix");
                lineFix.setOrigin(0, 0);
                lineFix.setDisplaySize(14, 20);
                lineFix.alpha = 0;

                this.add.tween({
                    targets: [lsue, lineFix],
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    delay: 1000,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1
                    },
                    onComplete: () => {
                        lsue.alpha = 1;
                        lineFix.alpha = 1;
                        
                        let launcherModuleEnclosure = this.add.image(859, 154, "launcher_module_enclosure");
                        launcherModuleEnclosure.setOrigin(0, 0);
                        launcherModuleEnclosure.setDisplaySize(205, 189);
                        launcherModuleEnclosure.alpha = 0;
                        
                        this.add.tween({
                            targets: [launcherModuleEnclosure],
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            delay: 3500,
                            alpha: {
                                getStart: () => 0,
                                getEnd: () => 1
                            },
                            onComplete: () => {
                                this.time.delayedCall(28000, () => {
                                    Sim.output.innerHTML = '';
                                    Sim.removeResources();
                                    Sim.output.innerHTML = "";
                                    cam.fadeOut(500);
                                    this.time.delayedCall(600, () => {
                                        Sim.currentScene = "";
                                        this.scene.stop("RDH");
                                        Sim.output.innerHTML = "";
                                        Sim.setComplete();
                                    }, [], this);
                                }, [], this);
                            }
                        });
                    }
                });
            }
        });
        
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 100;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (Math.floor(AudioNarration.currentTime) > 118) {
                    Sim.output.innerHTML = `
                        <p>Power from the Deckhouse Support Building is distributed 
                        throughout the Building Automated System which controls 
                        subsystems like the Chilled Water, Hot Water, Compressed Air, 
                        Heating Ventilation Air Conditioning, and Makeup Air Units, among 
                        other systems that support the Aegis Combat System.</p>
                    `;
                } 
            };

            AudioNarration.play();
        }, [], this);
    }
}