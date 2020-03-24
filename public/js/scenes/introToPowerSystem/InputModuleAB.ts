/// <reference path="../../../../typings/phaser.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Loader.ts" />
/// <reference path="../../VideoAnimation.ts" />

class InputModuleAB extends Phaser.Scene {
    private $ = window["jQuery"];

    constructor() {
        super({ key: "InputModuleAB"});
    }

    preload() {
        this.load.image("uccFinalFrameStart", "../public/images/ucc_final_frame_start.png");
        this.load.image("inputA", "../public/images/input_a.png");
        this.load.image("inputB", "../public/images/input_b.png");
        this.load.image("inputAHighlighted", "../public/images/input_a_highlighted.png");
        this.load.image("inputBHighlighted", "../public/images/input_b_highlighted.png");
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
        Sim.output.innerHTML = `
                <p>blah7</p>
            `;

        Sim.currentScene = "InputModuleAB";

        let sc = this;
        let cam = this.cameras.main;

        cam.setBounds(0, 0, 2000, 2000);

        let width = <number>this.sys.game.config.width;
        let height = <number>this.sys.game.config.height;

        VideoAnimation.initialize('uccConsoleZoom');
        VideoAnimation.fadeOut = true;
        VideoAnimation.currentTime = 0;
        
        let uccFinalFrameStart = this.add.image(0, 0, "uccFinalFrameStart");

        VideoAnimation.ended = () => {};

        var timeline = sc.tweens.createTimeline({
            ease: 'Sine.easeInOut',
            duration: 0
        });

        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 7000,
            alpha: {
                getStart: () => 1,
                getEnd: () => .4
            }
        });

        let inputA = this.add.image(4.5, 27, "inputA");
        inputA.setOrigin(0, 0);
        inputA.setDisplaySize(188, 60);
        inputA.alpha = 0;

        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 1000,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            }
        });

        let inputB = this.add.image(3.46, 402.5, "inputB");
        inputB.setOrigin(0, 0);
        inputB.setDisplaySize(189, 58.5);
        inputB.alpha = 0;

        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 200,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            }
        });

        timeline.add({
            targets: inputA,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            }
        });

        timeline.add({
            targets: inputB,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            }
        });

        timeline.add({
            targets: uccFinalFrameStart,
            ease: 'Power2',
            duration: 500,
            delay: 500,
            alpha: {
                getStart: () => .4,
                getEnd: () => 1
            },
            onComplete: () => {
                timeline.destroy();
                
                let inputA_highlighted = this.add.image(4.5, 27, "inputAHighlighted");
                inputA_highlighted.setOrigin(0, 0);
                inputA_highlighted.setDisplaySize(188, 60);
                inputA_highlighted.alpha = 0;
                
                let inputB_highlighted = this.add.image(3.46, 402.5, "inputBHighlighted");
                inputB_highlighted.setOrigin(0, 0);
                inputB_highlighted.setDisplaySize(189, 58.5);
                inputB_highlighted.alpha = 0;

                this.add.tween({
                    targets: [inputA_highlighted, inputB_highlighted],
                    ease: 'Sine.easeInOut',
                    duration: 500,
                    delay: 500,
                    alpha: {
                      getStart: () => 0,
                      getEnd: () => 1
                    }
                });

                this.time.delayedCall(2000, () => {
                    Sim.removeResources();
                    Sim.output.innerHTML = "";
                    Sim.game.scene.start("InputTransformers");
                    sc.time.delayedCall(1000, () => {
                        sc.scene.stop("InputModuleAB");
                    }, [], sc);        
                }, [], this);
            }
        });

        timeline.play();

        VideoAnimation.play();
        
        uccFinalFrameStart.setOrigin(0, 0);
        uccFinalFrameStart.setDisplaySize(width, height);

        AudioNarration.initialize('introAudio');
        AudioNarration.currentTime = 34;

        this.time.delayedCall(500, () => {
            AudioNarration.timeupdate = () => {
                if (AudioNarration.currentTime > 46.8) {
                    AudioNarration.destroy();
                } 
            };

            AudioNarration.play();
        }, [], sc);
    }
}