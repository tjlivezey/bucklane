/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class OutputTransformers extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "OutputTransformers"});
    }

    preload() {
        this.load.image("uccOutputTransformerFinalFrame", "../public/images/ucc_final_frame_output_transformer.png");
        this.load.image("output_transformer", "../public/images/output_transformer.png");
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
            <p>blah10 
        `;

        Sim.currentScene = "OutputTransformers";
        
        let sc = this;
        let cam = this.cameras.main;

        cam.setOrigin(0, 0);
        cam.setBounds(0, 0, 2000, 2000);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;

        let uccOutputTransformerFinalFrame = this.add.image(0, 0, "uccOutputTransformerFinalFrame");
        uccOutputTransformerFinalFrame.setOrigin(0, 0);
        uccOutputTransformerFinalFrame.setDisplaySize(width, height);

        let output_transformerA = this.add.image(277, 36, "output_transformer");
        output_transformerA.setOrigin(0, 0);
        output_transformerA.setDisplaySize(32, 34);
        output_transformerA.alpha = 0;

        let output_transformerB = this.add.image(277, 409, "output_transformer");
        output_transformerB.setOrigin(0, 0);
        output_transformerB.setDisplaySize(32, 34);
        output_transformerB.alpha = 0;

        
        this.add.tween({
            targets: [output_transformerA, output_transformerB],
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
                output_transformerA.alpha = 1;
                output_transformerB.alpha = 1;

                this.time.delayedCall(2000, () => {
                    AudioNarration.pause();
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("Deckhouse");
                    this.time.delayedCall(1000, () => {
                        this.scene.stop("OutputTransformers");
                    }, [], this); 
                }, [], this);
            }
        });
        
        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 76;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (Math.floor(AudioNarration.currentTime) > 88) {
                    AudioNarration.pause();
                } 
            };

            AudioNarration.play();
        }, [], this);
    }
}