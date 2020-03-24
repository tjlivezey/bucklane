/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
var App = /** @class */ (function () {
    function App() {
    }
    App.initialize = function () {
        var loader = new Loader();
        loader.load(['../public/data/data.json', '../public/data/glossary.json'], function () {
            App.loadGlossary(App['glossary'].glossary);
            document.querySelector('.sim-title').innerHTML = App['data']['title'];
            var sidebar = new SideBar(document.querySelector(".sidebar"), App['data']['lessons']);
            if (App.isLMS == true) {
                var sco = Helper.getQueryString('scoID', document.location.href);
                var menuItem = '';
                switch (sco) {
                    case 'IntroPowerSystemzzz':
                        menuItem = 'Introductionz to the Powerz Systemzzz';
                        break;
                    case 'FullUtilityIntro':
                        menuItem = 'Normal System Operation';
                        break;
                    case 'SingleUtililtyFailureIntro':
                        menuItem = '50/60 Hz Single Utility Failure';
                        break;
                    case 'DualUtilityFailureIntro':
                        menuItem = '50/60 Hz Dual Utility Failure';
                        break;
                    case 'IntroASideFailure':
                        menuItem = 'A Side 400 Hz Failure';
                        break;
                    case 'FailureChilledWaterPumpIntro':
                        menuItem = 'Failure of a Chilled Water Return Pump';
                        break;
					case 'WaterChillerIntro':
						menuItem = 'Chilled Water Normal Systems Operation';
						break;
					case 'SingleSystemFailureIntro':
						menuItem = 'Single System Failure of the Chilled Water System';
						break;
					case 'FailureChilledWaterPumpIntro':
						menuItem = 'Failure of a Chilled Water Return Pump';
						break;
					case 'SingleFailureHotWaterPumpIntro':
						menuItem = 'Single Failure of Hot Water Pump';
						break;
                }
                if (menuItem != '') {
                    App.$(":contains('" + menuItem + "')").click();
                }
            }
        }, App);
        var iframe = document.querySelector('#contentFrame');
        document.querySelector('.pause').addEventListener('click', function () {
            iframe['contentWindow'].Sim.pause();
        });
        document.querySelector('.back').addEventListener('click', function () {
            iframe['contentWindow'].Sim.previous();
        });
        document.querySelector('.restart').addEventListener('click', function () {
            iframe['contentWindow'].Sim.replay();
        });
        document.querySelector('.forward').addEventListener('click', function () {
            iframe['contentWindow'].Sim.next();
        });
        var references = document.getElementsByClassName('reference');
        for (var i = 0; i < references.length; i++) {
            references[i].addEventListener('click', function () {
                try {
                    iframe['contentWindow'].Sim.openReference(this);
                }
                catch (e) {
                    var doc = '/public/references/' + this.innerHTML + '.' + this.getAttribute('data-type');
                    if (this.className == "reference abb") {
                        doc = '/public/references/ABB 5060 Hertz Converter Operation and Maintenance Manual.pdf';
                    }
                    var win = window.open(doc, '_blank');
                    window.focus();
                }
            });
        }
    };

    App.loadGlossary = function (glossary) {
        var glossaryElem = document.querySelector("#glossary .modal-body");
        var div = null;
        var span = null;
        glossary.forEach(function (item) {
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
    };
    
    App.getSim = function getSim () {
        var iframe = document.querySelector('#contentFrame');
        return iframe['contentWindow'].Sim;
    };
    
    App.isLMS = false;
    App.$ = window['jQuery'];
    return App;
}());
//# sourceMappingURL=App.js.map