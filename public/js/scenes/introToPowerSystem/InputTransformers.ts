/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class InputTransformers extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "InputTransformers"});
    }

    preload() {
        this.load.image("uccTransformerFinalFrame", "../public/images/ucc_final_frame_input_transformers.png");
        this.load.image("inputTransformer", "../public/images/input_transformer.png");
        this.load.image("cnv", "../public/images/cnv.png");
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
            <p>blah8</p>
        `;

        Sim.currentScene = "InputTransformers";
        let sc = this;
        
        let cam = this.cameras.main;
        cam.alpha = 1;
        cam.visible = true;
        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;
        
        let uccTransformerFinalFrame = this.add.image(0, 0, "uccTransformerFinalFrame");
        uccTransformerFinalFrame.setOrigin(0, 0);
        uccTransformerFinalFrame.setDisplaySize(width, height);
        uccTransformerFinalFrame.alpha = 1;
        uccTransformerFinalFrame.visible = true;
        
        let inputTransformerA = this.add.image(155, 35, "inputTransformer");
        inputTransformerA.setOrigin(0, 0);
        inputTransformerA.setDisplaySize(30, 34);
        inputTransformerA.alpha = 0;

        let inputTransformerB = this.add.image(155, 409, "inputTransformer");
        inputTransformerB.setOrigin(0, 0);
        inputTransformerB.setDisplaySize(30, 34);
        inputTransformerB.alpha = 0;

        this.add.tween({
            targets: [inputTransformerA, inputTransformerB],
            ease: 'Sine.easeInOut',
            duration: 750,
            delay: 1500,
            yoyo: true,
            loop: 3,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                inputTransformerA.alpha = 1;
                inputTransformerB.alpha = 1;
                
                let cnvA = this.add.image(184.4, 48.6, "cnv");
                cnvA.setOrigin(0, 0);
                cnvA.setDisplaySize(62.9, 8);
                cnvA.alpha = 0;

                let cnvB = this.add.image(184.4, 422.7, "cnv");
                cnvB.setOrigin(0, 0);
                cnvB.setDisplaySize(62.9, 8);
                cnvB.alpha = 0;

                this.add.tween({
                    targets: [cnvA, cnvB],
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    delay: 0,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1
                    },
                    onComplete: () => {
                        this.time.delayedCall(1000, () => {
                            Sim.removeResources();
                            Sim.output.innerHTML = "";
                            Sim.game.scene.start("StaticFrequencyConverters");
                            sc.time.delayedCall(1000, () => {
                                sc.scene.stop("InputTransformers");
                            }, [], sc);
                        }, [], this);
                    }
                });
            }
        });
        
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 47;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (Math.floor(AudioNarration.currentTime) > 55) {
                    AudioNarration.destroy();
                } 
            };

            AudioNarration.play();
        }, [], this);
    }
}