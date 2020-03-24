/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class Deckhouse extends Phaser.Scene {   
    private $ = window["jQuery"];

    constructor() {
        super({ key: "Deckhouse"});
    }
    
    preload() {
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
            <p>blah5</p>
        `;

        Sim.currentScene = "Deckhouse";
        let sc = this;
        let cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 1068, 448);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;

        let uccFinalFrameDeckhouseFeed = this.add.image(0, 0, "uccFinalFrameDeckhouseFeed");
        uccFinalFrameDeckhouseFeed.setOrigin(0, 0);
        uccFinalFrameDeckhouseFeed.setDisplaySize(width, height);

        let switchGearsCenter = this.add.image(307.7, 45.5, "switchGearsCenter");
        switchGearsCenter.setOrigin(0, 0);
        switchGearsCenter.setDisplaySize(177, 402.5);
        switchGearsCenter.alpha = 0;

        let switchGearsLeft = this.add.image(224, 145, "switchGearsLeft");
        switchGearsLeft.setOrigin(0, 0);
        switchGearsLeft.setDisplaySize(84, 252);
        switchGearsLeft.alpha = 0;

        let f13f14 = this.add.image(483, 114, "f13f14");
        f13f14.setOrigin(0, 0);
        f13f14.setDisplaySize(110.1, 52);
        f13f14.alpha = 0;

        let f21f23 = this.add.image(483, 332.5, "f21f23");
        f21f23.setOrigin(0, 0);
        f21f23.setDisplaySize(109.5, 52);
        f21f23.alpha = 0;

        this.add.tween({
            targets: [switchGearsLeft, f13f14, f21f23, switchGearsCenter],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 2000,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                f13f14.alpha = 1;
                f21f23.alpha = 1;
                switchGearsCenter.alpha = 1;
                switchGearsLeft.alpha = 1;
                
                let dhsbA = this.add.image(484.5, 83, "dhsb_a");
                dhsbA.setOrigin(0, 0);
                dhsbA.setDisplaySize(193.5, 26.5);
                dhsbA.alpha = 0;

                let dhsbB = this.add.image(484.5, 380, "dhsb_b");
                dhsbB.setOrigin(0, 0);
                dhsbB.setDisplaySize(193.5, 25);
                dhsbB.alpha = 0;

                let dhsbAModule = this.add.image(657, 109.5, "dhsb_module");
                dhsbAModule.setOrigin(0, 0);
                dhsbAModule.setDisplaySize(39, 27);
                dhsbAModule.alpha = 0;

                let dhsbBModule = this.add.image(657.4, 353, "dhsb_module");
                dhsbBModule.setOrigin(0, 0);
                dhsbBModule.setDisplaySize(39, 27);
                dhsbBModule.alpha = 0;

                let dhsbLowVolt = this.add.image(667.6, 136, "dhsb_low_volt");
                dhsbLowVolt.setOrigin(0, 0);
                dhsbLowVolt.setDisplaySize(23, 217);
                dhsbLowVolt.alpha = 0;

                this.add.tween({
                    targets: [dhsbA, dhsbB, dhsbAModule, dhsbBModule, dhsbLowVolt],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 6000,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1
                    },
                    onComplete: () => {
                        dhsbA.alpha = 1;
                        dhsbB.alpha = 1;
                        dhsbAModule.alpha = 1;
                        dhsbBModule.alpha = 1;
                        dhsbLowVolt.alpha = 1;
                        
                        this.time.delayedCall(1500, () => {
                            AudioNarration.pause();
                            Sim.output.innerHTML = "";
                            Sim.removeResources();
                            
                            Sim.game.scene.start("RDH");
                            this.time.delayedCall(1000, () => {
                                this.scene.stop("Deckhouse");
                            }, [], this);
                        }, [], this);
                    }
                });
            }
        });
        
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 89;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (Math.floor(AudioNarration.currentTime) > 99) {
                    AudioNarration.pause();
                }
            };

            AudioNarration.play();
        }, [], this);
    }
}