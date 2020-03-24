/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="./Config.ts" />
/// <reference path="./Loader.ts" />
/// <reference path="./SideBar.ts" />
/// <reference path="./Sim.ts" />
/// <reference path="./scenes/introToPowerSystem/IntroPowerSystem.ts" />
/// <reference path="./scenes/introToPowerSystem/BuildingFloorPlan.ts" />
/// <reference path="./scenes/introToPowerSystem/InputModuleAB.ts" />
/// <reference path="./scenes/introToPowerSystem/InputTransformers.ts" />
/// <reference path="./scenes/introToPowerSystem/StaticFrequencyConverters.ts" />
/// <reference path="./scenes/introToPowerSystem/OutputTransformers.ts" />
/// <reference path="./scenes/introToPowerSystem/Deckhouse.ts" />
/// <reference path="./scenes/introToPowerSystem/RDH.ts" />
/// <reference path="./scenes/normalSystemOperation/FullUtilityIntro.ts" />
/// <reference path="./scenes/normalSystemOperation/CriticalSystemSupport.ts" />
/// <reference path="./scenes/normalSystemOperation/SpyRadar.ts" />
/// <reference path="./scenes/normalSystemOperation/VerticalLaunchingSystem.ts" />
/// <reference path="./scenes/normalSystemOperation/VLSIntercept.ts" />
/// <reference path="./scenes/normalSystemOperation/MVS.ts" />
/// <reference path="./scenes/normalSystemOperation/MVSChallenge.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBus.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBusChallengeA.ts" />
/// <reference path="./scenes/normalSystemOperation/MainBusChallengeB.ts" />
/// <reference path="./scenes/normalSystemOperation/PrimaryBusBreakers.ts" />
/// <reference path="./scenes/normalSystemOperation/GenTieBreakerChallenge.ts" />
/// <reference path="./scenes/normalSystemOperation/DieselGenerators.ts" />
/// <reference path="./scenes/normalSystemOperation/FullUtilityEnd.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/SingleUtililtyFailureIntro.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/UtilityADetail.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/FiftySixtyConverter.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/CSOOW.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/UCCMainFaulted.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/KnowledgeQuestion1.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/M11T21Verify.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/LocateManual.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/Deenergized5060Converter.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/StartSFCDetail.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/ASideRestarted.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/TransferSourceConclusion.ts" />
/// <reference path="./scenes/50_60HzSingleUtilityFailure/TransferSourceConclusion.ts" />
/// <reference path="./scenes/aSide400HzFailure/IntroASideFailure.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredDetailScreen.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredFaultDetected.ts" />
/// <reference path="./scenes/aSide400HzFailure/NotifyCSOOW.ts" />
/// <reference path="./scenes/aSide400HzFailure/LocateHobartManual.ts" />
/// <reference path="./scenes/aSide400HzFailure/SequencingKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/SFCKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/HobartFaultReadOut.ts" />
/// <reference path="./scenes/aSide400HzFailure/HobartFaultKnowledgeQuestion.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredFaultCleared.ts" />
/// <reference path="./scenes/aSide400HzFailure/FourHundredConclusion.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityFailureIntro.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/FiftySixtyConvertersFail.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityNotifyCSOOW.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityKnowledgeQuestion1.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/OpenBreakerVerification.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/AutomaticRunRequest.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/GeneratorBreakersClose.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/BreakerF11F21Closes.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/BreakerF12F22Closes.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/LocateABBManual.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/InitiateTransferToFullPower.ts" />
/// <reference path="./scenes/50_60HzDualUtilityFailure/DualUtilityFailureConclusion.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super.call(this, { key: "Controller" }) || this;
    }
    Controller.prototype.create = function () {
        Sim.loader.style.visibility = 'visible';
        //Sim.initialize();
    };
    return Controller;
}(Phaser.Scene));
// Kick-off Sim initialization
window.addEventListener("DOMContentLoaded", function () {
    var elem = document.querySelector(".content");
    var lesson = Helper.getQueryString('lesson', document.location.href) || "";
    var scenes = [];
    var resources = [];
    switch (lesson) {
        case "":
            scenes = [Controller];
            break;
        case "IntroPowerSystem":
            scenes = [
                Controller,
                IntroPowerSystem,
                BuildingFloorPlan,
                InputModuleAB,
                InputTransformers,
                StaticFrequencyConverters,
                OutputTransformers,
                Deckhouse,
                RDH
            ];
            resources = [
                '../public/video/aaBuildingLandscape.mp4',
                '../public/audio/introAudio.mp3',
                '../public/video/uccConsoleZoom.mp4'
            ];
            Sim.threshHold = {
                start: 1,
                end: 8
            };
            break;
        case "FullUtilityIntro":
            scenes = [
                Controller,
                FullUtilityIntro,
                CriticalSystemSupport,
                SpyRadar,
                VerticalLaunchingSystem,
                VLSIntercept,
                MVS,
                MVSChallenge,
                MainBus,
                MainBusChallengeA,
                MainBusChallengeB,
                PrimaryBusBreakers,
                GenTieBreakerChallenge,
                DieselGenerators,
                FullUtilityEnd
            ];
            resources = [
                '../public/video/UCC_Console_Zoom_Start.mp4',
                '../public/audio/fullUtilityAudio.mp3',
                '../public/video/satSystems.mp4',
                '../public/video/vlsIntercept.mp4'
            ];
            Sim.threshHold = {
                start: 1,
                end: 14
            };
            break;
        case "SingleUtililtyFailureIntro":
            scenes = [
                Controller,
                SingleUtililtyFailureIntro,
                UtilityADetail,
                FiftySixtyConverter,
                CSOOW,
                UCCMainFaulted,
                KnowledgeQuestion1,
                M11T21Verify,
                Deenergized5060Converter,
                LocateManual,
                StartSFCDetail,
                ASideRestarted,
                TransferSourceConclusion
            ];
            resources = [
                '../public/audio/fullUtilityAudio.mp3',
                '../public/video/UCC_Monitor_Pan_Left_to_Center_60Hz_Critical_Condition.mp4',
                '../public/audio/singleUtilityFiftySixtyAudio.mp3',
                '../public/video/UCC_Monitor_Pan_Left_to_Center_60Hz_Unacknowledged.mp4',
                '../public/audio/Challenge_Questions_02.mp3',
                '../public/video/UCC_Monitor_Pan_Center_to_Left_60Hz_Unacknowledged.mp4',
                '../public/audio/Challenge_Questions_ALT_LINE_01.mp3',
                '../public/video/UCC_Console_Zoom_T21_Open.mp4',
                '../public/audio/Four_Hundred_Hz_Challenge_Questions.mp3',
                '../public/video/UCC_Monitor_Pan_Center_to_Left_T21_Open.mp4'
            ];
            Sim.threshHold = {
                start: 1,
                end: 12
            };
            break;
        case "DualUtilityFailureIntro":
            scenes = [
                Controller,
                DualUtilityFailureIntro,
                FiftySixtyConvertersFail,
                DualUtilityNotifyCSOOW,
                DualUtilityKnowledgeQuestion1,
                OpenBreakerVerification,
                AutomaticRunRequest,
                GeneratorBreakersClose,
                BreakerF11F21Closes,
                BreakerF12F22Closes,
                LocateABBManual,
                InitiateTransferToFullPower,
                DualUtilityFailureConclusion
            ];
            resources = [
                '../public/audio/fullUtilityAudio.mp3',
                '../public/audio/singleUtilityFiftySixtyAudio.mp3',
                '../public/audio/Challenge_Questions_ALT_LINE_01.mp3',
                '../public/video/UCC_Console_Zoom_T21_Open.mp4',
                '../public/video/UCC_Console_Zoom_Power_Loss_F11_open.mp4',
                '../public/audio/Full_Loss_of_Utility_Power.mp3',
                '../public/audio/Full_Loss_of_Utility_Power_Challenge Questions.mp3',
                '../public/audio/dieselEngine.mp3'
            ];
            Sim.threshHold = {
                start: 1,
                end: 12
            };
            break;
        case "IntroASideFailure":
            scenes = [
                Controller,
                IntroASideFailure,
                //SequencingKnowledgeQuestion,
                FourHundredDetailScreen,
                FourHundredFaultDetected,
                NotifyCSOOW,
                LocateHobartManual,
                SFCKnowledgeQuestion,
                HobartFaultReadOut,
                HobartFaultKnowledgeQuestion,
                FourHundredFaultCleared,
                FourHundredConclusion
            ];
            resources = [
                '../public/audio/fullUtilityAudio.mp3',
                '../public/video/UCC_Console_Zoom_T21_Open.mp4',
                '../public/audio/Four_Hundred_Hz_Challenge_Questions.mp3',
                '../public/video/UCC_Monitor_Pan_400Hz_Left_to_Center_T21_Open.mp4',
                '../public/audio/Complete_Loss_of_400Hz_SFC_A_or_B_Side_Bus.mp3',
                '../public/video/UCC_Monitor_Pan_400Hz_Center_to_Left_T21_Open.mp4',
                '../public/audio/Four_Hundred_Hz_Sir_we_have_a_failure_take2.mp3',
                '../public/audio/Full_Loss_of_Utility_Power_Challenge Questions.mp3'
            ];
            Sim.threshHold = {
                start: 1,
                end: 10
            };
            break;
    }
    // Set Phaser configuration properties based on content div element
    var config = {
        type: Phaser.CANVAS,
        width: elem.offsetWidth,
        height: elem.offsetHeight,
        parent: elem,
        scene: scenes
    };
    Sim.loader = document.querySelector(".loading");
    Sim.output = parent.document.querySelector('.output');
    if (resources.length > 0) {
        var loader = new Loader();
        loader.load(resources, function () {
            Sim.game = new Phaser.Game(config);
            Sim.game.scene.start(lesson);
        }, this);
    }
    else {
        Sim.game = new Phaser.Game(config);
    }
});
//# sourceMappingURL=Controller.js.map