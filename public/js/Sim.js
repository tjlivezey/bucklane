/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
/// <reference path="./VideoAnimation.ts" />
var Sim = /** @class */ (function () {
    function Sim() {
    }
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
    Sim.replay = function () {
        Sim.paused = false;
        VideoAnimation.ended = function () { };
        Sim.removeResources();
        Sim.game.scene.stop(Sim.currentScene);
        Sim.game.scene.start(Sim.currentScene);
        parent.document.querySelectorAll('.action')[1].className = 'action pause';
    };
    Sim.pause = function () {
        if (Sim.currentScene == "") {
            return;
        }
        var pauseButton = parent.document.querySelectorAll('.action')[1];
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
    };
    Sim.previous = function () {
        parent.document.querySelector('.forward').removeAttribute('disabled');
        if (Sim._currentScene == "") {
            return;
        }
        if (Sim._currentIndex > Sim.threshHold.start) {
            VideoAnimation.ended = function () { };
            parent.document.querySelector('.highlight')['style'].display = 'none';
            var _this = this;
            this.$('.action', parent.document).attr('disabled', 'disabled');
            var pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
            Sim.removeResources();
            var currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex - 1;
            var nextScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;
            pauseButton.className = 'action pause';
            setTimeout(function () {
                Sim.enableNavigation(false);
            }, 1250);
        }
    };
    Sim.enableNavigation = function (action) {
        var actions = parent.document.querySelectorAll('.action');
        if (action === true) {
            for (var i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = true;
            }
        }
        else {
            for (var i = 0; i < actions.length; i++) {
                actions[i]['disabled'] = false;
            }
        }
    };
    Sim.next = function () {
        if (Sim._currentScene == "") {
            return;
        }
        if (Sim._currentIndex < Sim.threshHold.end) {
            VideoAnimation.ended = function () { };
            parent.document.querySelector('.highlight')['style'].display = 'none';
            var _this = this;
            Sim.enableNavigation(true);
            var pauseButton = parent.document.querySelectorAll('.action')[1];
            Sim.paused = false;
            pauseButton.className = 'action pause';
            pauseButton.setAttribute('title', 'Pause');
            Sim.removeResources();
            var currentScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim._currentIndex = Sim._currentIndex + 1;
            var nextScene = Sim.game.scene.getAt(Sim._currentIndex);
            Sim.game.scene.stop(Sim.currentScene);
            Sim.game.scene.start(nextScene.scene.key);
            Sim.currentScene = nextScene.scene.key;
            pauseButton.className = 'action pause';
            setTimeout(function () {
                Sim.enableNavigation(false);
            }, 1250);
        }
        else {
            Sim.removeResources();
            Sim.game.scene.stop(Sim.currentScene);
            Sim.currentScene = "";
        }
    };
    Sim.show = function (scn) {
        Sim.game.scene.start(scn);
    };
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
    Sim.removeResources = function () {
        AudioNarration.destroy();
        VideoAnimation.destroy();
        VideoAnimation.onplayended = null;
    };
    Sim.openReference = function (elem) {
        var doc = '/public/references/' + elem.innerHTML + '.' + elem.getAttribute('data-type');
        if (elem.className == "reference abb") {
            doc = '/public/references/ABB 5060 Hertz Converter Operation and Maintenance Manual.pdf';
            if (Sim._currentScene == 'LocateManual') {
                Sim._references[Sim._currentScene] = true;
            }
            else if (Sim._currentScene == 'LocateABBManual') {
                Sim._references[Sim._currentScene] = true;
            }
        }
        else if (elem.className == "reference hobart") {
            if (Sim._currentScene == 'LocateHobartManual') {
                Sim._references[Sim._currentScene] = true;
            }
        }
        var win = window.open(doc, '_blank');
        window.focus();
    };
    Object.defineProperty(Sim, "output", {
        get: function () {
            return Sim._output;
        },
        set: function (newElem) {
            Sim._output = newElem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "loader", {
        get: function () {
            return Sim._loader;
        },
        set: function (newElem) {
            Sim._loader = newElem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "game", {
        get: function () {
            return Sim._game;
        },
        set: function (newGame) {
            Sim._game = newGame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "currentScene", {
        get: function () {
            return Sim._currentScene;
        },
        set: function (newScene) {
            Sim._currentIndex = Sim.game.scene.getIndex(newScene);
            Sim._currentScene = newScene;
        },
        enumerable: true,
        configurable: true
    });
	Object.defineProperty(Sim, "currentFault", {
        get: function () {
            return Sim._currentFault;
        },
        set: function (faultNum) {
            Sim._currentFault = faultNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "paused", {
        get: function () {
            return Sim._isPaused;
        },
        set: function (newBool) {
            Sim._isPaused = newBool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "playing", {
        get: function () {
            return Sim._isPlaying;
        },
        set: function (newBool) {
            Sim._isPlaying = newBool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "referenceDisplayed", {
        get: function () {
            return Sim._references[Sim.currentScene] || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "threshHold", {
        get: function () {
            return Sim._threshHold;
        },
        set: function (obj) {
            Sim._threshHold = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sim, "completedKnowledgeChecks", {
        get: function () {
            return Sim._completedKnowledgeChecks;
        },
        enumerable: true,
        configurable: true
    });
    Sim.showFeedBack = function (correct, obj) {
        var x = (obj.downX + document.querySelector('.content')['offsetLeft'] + 210) + 'px';
        var y = (obj.downY + 38) + 'px';
        var $div = this.$('<div>');
        $div.css('width', '40px')
            .css('height', '40px')
            .css('position', 'absolute')
            .css('top', y)
            .css('left', x)
            .css('background-size', 'contain');
        if (correct === true) {
            $div.css('background-image', "url('/public/images/green_check.png')");
        }
        else {
            $div.css('background-image', "url('/public/images/red_x.png')");
        }
        this.$('body').append($div);
        $div.fadeOut(2000, function () {
            $div.remove();
        });
    };
    Sim.hasCompleted = function (knowledgeCheck) {
        var completed = false;
        for (var i = 0; i < Sim.completedKnowledgeChecks.length; i++) {
            if (Sim.completedKnowledgeChecks[i] == knowledgeCheck) {
                completed = true;
                break;
            }
        }
        return completed;
    };
    Sim.setComplete = function () {
        parent.parent['doLMSSetValue']("cmi.success_status", "passed");
        parent.parent['doLMSSetValue']("cmi.completion_status", "completed");
    };
    Sim._currentScene = "";
    Sim._currentIndex = 0;
    Sim._isPaused = false;
    Sim._isPlaying = false;
    Sim._threshHold = {};
    Sim.$ = window["jQuery"];
    Sim._completedKnowledgeChecks = [];
    Sim._references = {};
    Sim.resources = {};
    return Sim;
}());
window.addEventListener('DOMContentLoaded', function () {
    document.title = document.title;
});
//# sourceMappingURL=Sim.js.map