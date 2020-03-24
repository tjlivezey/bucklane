/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
/// <reference path="./VideoAnimation.ts" />

class Sim {
    private static _loader: HTMLDivElement;
    private static _output: HTMLDivElement;
    private static _game: Phaser.Game;
    private static _currentScene: string = "";
    private static _currentIndex: number = 0;
    private static _isPaused: boolean = false;
    private static _isPlaying: boolean = false;
    private static _threshHold: any = {};
    private static $ = window["jQuery"];
    private static _completedKnowledgeChecks: string[] = [];
    private static _references: any = {};
    public static resources: any = {};
    public static incorrectCount = 0;
    public static promptIncorrect = 2;
    private static _currentFault: number = 0;

    /*
    static initialize() {
        let loader = new Loader();

        loader.load(['/public/data/data.json', '/public/data/glossary.json'], () => {
            Sim.loadGlossary(Sim['glossary'].glossary);

            parent.document.querySelector('.sim-title').innerHTML = Sim['data']['title'];
            
            let sidebar = new SideBar(parent.document.querySelector(".sidebar"), Sim['data']['lessons']);
            
            Sim.loader.style.visibility = 'hidden';
        }, Sim);
    }
    */
    static replay() {
        Sim.paused = false;
        VideoAnimation.ended = () => {};
        Sim.removeResources();
        
        Sim.game.scene.stop(Sim.currentScene);
        Sim.game.scene.start(Sim.currentScene);

        parent.document.querySelectorAll('.action')[1].className = 'action pause';
    }

    static pause() {
        if (Sim.currentScene == "") {
            return;
        }

        let pauseButton = parent.document.querySelectorAll('.action')[1];
        
        if (!Sim.paused) {
            Sim.game.scene.pause(Sim.currentScene);
            Sim.paused = true;
            pauseButton.className = 'action play';
            pauseButton.setAttribute('title', 'Play');
        }
        else {
            Sim.game.scene.resume(Sim.currentScene);
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
        }
    }

    static previous() {
        parent.document.querySelector('.forward').removeAttribute('disabled');
        if (Sim._currentScene == "") {
            return;
        }
        if (Sim._currentIndex > Sim.threshHold.start) {
            VideoAnimation.ended = () => {};
            parent.document.querySelector('.highlight')['style'].display = 'none';
            let _this = this;
            this.$('.action', parent.document).attr('disabled', 'disabled');
            let pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');

            Sim.removeResources();
            
            let currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex - 1;
            let nextScene = Sim.game.scene.getAt(Sim._currentIndex);
                
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;

            pauseButton.className = 'action pause';

            setTimeout(() => {
                Sim.enableNavigation(false);
            }, 1250);
        }
    }

    static enableNavigation(action: boolean) {
        let actions = parent.document.querySelectorAll('.action');

        if (action === true) {
            for(let i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = true;
            }
        }
        else {
            for(let i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = false;
            }
        }
    }

    static next() {
        if (Sim._currentScene == "") {
            return;
        }

        if (Sim._currentIndex < Sim.threshHold.end) {
            VideoAnimation.ended = () => {};
            parent.document.querySelector('.highlight')['style'].display = 'none';
            let _this = this;
            Sim.enableNavigation(true);
            let pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
            
            Sim.removeResources();

            let currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex + 1;
            let nextScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;

            pauseButton.className = 'action pause';

            setTimeout(() => {
                Sim.enableNavigation(false);
            }, 1250);
        }
        else if (Sim._currentIndex == Sim.threshHold.end) {
            return true;
        }
        else {
            Sim.removeResources();
            Sim.game.scene.stop(Sim.currentScene);
            Sim.currentScene = "";
        }
    }

    static show(scn: string) {
        Sim.game.scene.start(scn);
    }

    /*
    static loadGlossary(glossary: Array<string>) {
        let glossaryElem = parent.document.querySelector("#glossary .modal-body");
        let div = null;
        let span = null;

        glossary.forEach((item) => {
            div = document.createElement('div');

            span = document.createElement('span');
            span.className = 'acronym';
            span.innerHTML = item['acronym'];

            div.appendChild(span);

            span = document.createElement('span');
            span.className = 'term';
            span.innerHTML = item['term'];

            div.appendChild(span);

            glossaryElem.appendChild(div);
        });
    }
    */
    static removeResources() {
        AudioNarration.destroy();
        VideoAnimation.destroy();
        VideoAnimation.onplayended = null;
    }

    static openReference(elem: HTMLSpanElement) {
        let doc = '../public/references/' + elem.innerHTML + '.' + elem.getAttribute('data-type');

        if (elem.className == "reference abb") {
            doc = '../public/references/ABB 5060 Hertz Converter Operation and Maintenance Manual.pdf';
            
            if (Sim._currentScene == 'LocateManual') {
                Sim._references[Sim._currentScene] = true;
            } else if (Sim._currentScene == 'LocateABBManual') {
                Sim._references[Sim._currentScene] = true;
            }
        } else if (elem.className == "reference hobart") {
            if (Sim._currentScene == 'LocateHobartManual') {
                Sim._references[Sim._currentScene] = true;
            }
        }

        let win = window.open(doc, '_blank');
        window.focus();
    }

    static get output(): HTMLDivElement {
        return Sim._output;
    }

    static set output(newElem: HTMLDivElement) {
        Sim._output = newElem;
    }

    static get loader(): HTMLDivElement {
        return Sim._loader;
    }

    static set loader(newElem: HTMLDivElement) {
        Sim._loader = newElem;
    }

    static get game(): Phaser.Game {
        return Sim._game;
    }

    static set game(newGame: Phaser.Game) {
        Sim._game = newGame;
    }

    static get currentScene(): string {
        return Sim._currentScene;
    }

    static set currentScene(newScene: string) {
        Sim.setBookMark(newScene);
        Sim._currentIndex = Sim.game.scene.getIndex(newScene);
        Sim._currentScene = newScene;
    }

    static get currentFault():number {
        return Sim._currentFault;
    }

    static set currentFault(faultNum:number) {
        Sim._currentFault = faultNum;
    }

    static get paused(): boolean {
        return Sim._isPaused;
    }

    static set paused(newBool: boolean) {
        Sim._isPaused = newBool;
    }

    static get playing(): boolean {
        return Sim._isPlaying;
    }

    static set playing(newBool: boolean) {
        Sim._isPlaying = newBool;
    }

    static get referenceDisplayed() {
        return Sim._references[Sim.currentScene] || false;
    }

    static get threshHold(): any {
        return Sim._threshHold;
    }

    static set threshHold(obj: any) {
        Sim._threshHold = obj;
    }

    static get completedKnowledgeChecks(): string[] {
        return Sim._completedKnowledgeChecks;
    }

    static showFeedBack(correct: boolean, obj: any) {
        let x = (obj.downX + document.querySelector('.content')['offsetLeft']) + 'px';
        let y = (obj.downY) + 'px';
        let $div = this.$('<div>');

        $div.css('width', '40px')
            .css('height', '40px')
            .css('position', 'absolute')
            .css('top', y)
            .css('left', x)
            .css('background-size', 'contain');
        
        $div.css('background-image', (correct ? "url('../public/images/green_check.png')" : "url('../public/images/red_x.png')"));
        this.$('body').append($div);

        $div.fadeOut(2000, () => {
            $div.remove();
        }); 
    }

    static hasCompleted(knowledgeCheck: string): boolean {
        let completed: boolean = false;

        for (let i = 0; i < Sim.completedKnowledgeChecks.length; i++) {
            if (Sim.completedKnowledgeChecks[i] == knowledgeCheck) {
                completed = true;
                break
            }
        }

        return completed;
    }

    static setBookMark(lesson: string) {
        parent.parent["doLMSSetValue"]("cmi.location", lesson);
    }

    static setComplete() {
        if (parent['App'].isLMS == true) {
            parent.parent['doLMSSetValue']("cmi.success_status","passed");
            parent.parent['doLMSSetValue']("cmi.completion_status","completed");
            parent.parent['doLMSSetValue']("cmi.location","");
            
            parent.parent['doLMSSetValue']("cmi.score.min", 0);
            parent.parent['doLMSSetValue']("cmi.score.max", 100);
            parent.parent['doLMSSetValue']("cmi.score.raw", 100);

            parent.window['$']('#exit', parent.document).modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        
        parent.window['$']('#exit', parent.document).modal("show");
        Sim.removeResources();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.title = document.title;
});
