/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class StaticFrequencyConverters extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "StaticFrequencyConverters"});
    }

    preload() {
        this.load.image("uccStaticConverterFinalFrame", "../public/images/ucc_static_converter_final_frame.png");
        this.load.image("cnv60", "../public/images/cnv_60.png");
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
            blah14
        `;

        Sim.currentScene = "StaticFrequencyConverters";
        let sc = this;

        let cam = this.cameras.main;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;

        let uccStaticConverterFinalFrame = this.add.image(0, 0, "uccStaticConverterFinalFrame");
        uccStaticConverterFinalFrame.setOrigin(0, 0);
        uccStaticConverterFinalFrame.setDisplaySize(width, height);

        let cnv60A = this.add.image(246.5, 35, "cnv60");
        cnv60A.setOrigin(0, 0);
        cnv60A.setDisplaySize(32, 34);
        cnv60A.alpha = 0;

        let cnv60B = this.add.image(246, 409, "cnv60");
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
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                cnv60A.alpha = 1;
                cnv60B.alpha = 1;

                this.time.delayedCall(9000, () => {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("OutputTransformers");
                    sc.time.delayedCall(1000, () => {
                        sc.scene.stop("StaticFrequencyConverters");
                    }, [], sc); 
                }, [], this);
            }
        });
        
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 56;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (Math.floor(AudioNarration.currentTime) > 75) {
                    AudioNarration.pause();
                } 
            };

            AudioNarration.play();
        }, [], this);
    }
}