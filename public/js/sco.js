var lessonClosed = null;
var main = null;
var LMSInitialized = false;
var isICW = false;
var isLMS = !(document.location.href.indexOf('file') > -1);
var NEL_CHECK_INTERVAL = 1250;
var win_Location = window.top.location;
var isNEL = (win_Location.toString().indexOf("navy.mil") > -1 || win_Location.toString().indexOf("navy.smil.mil") > -1);

// Called when open lesson is clicked
function openLesson (sco) {
    var sco = sco || "";

    if (sco == "") {
        openWindow("?scoID="+scoID+"&mode="+mode);
    } else {
        isICW = true;
        openWindow(sco);
    }

    if (main) {
        // Listens for lesson to close
        var interval = setInterval(function() {
            if (lessonClosed == true) {
                lessonClosed = null;

                if (isLMS) {
                    if (LMSInitialized) {
                        var compStatus = doLMSGetValue("cmi.completion_status");
                        switch (compStatus) {
                            case "completed":
                                doLMSSetValue("cmi.exit", "logout");
                                break;
                            case "incomplete":
                                doLMSSetValue("cmi.exit", "suspend");
                                break;
                        }

                        doLMSCommit();
                        doLMSTerminate();
                    }
                }
                
                if (isNEL) {
                    window.top.GetControlWindow().Control.CloseSco();
                } else {
                    window.top.location.reload();
                }
                
                clearInterval(interval);
            }
        }, NEL_CHECK_INTERVAL);
    }
}

// Called from GuidedSim.html before unload (closed)
function closeLesson() {
    lessonClosed = true;
}

function openWindow(attachment) {
    var w=1080, 
        h=739, 
        x=0, 
        y=0,
        windowParams = "left=" + x + ",top=" + y + ",width=" + w + ",height=" + h;

    if (!LMSInitialized) // So we don't initialize twice.
        LMSInitialized = doLMSInitialize();

    //sets initial state to incomplete
    if (isLMS) {
        if (doLMSGetValue("cmi.completion_status") === "unknown") {
            doLMSSetValue("cmi.success_status","unknown");
            doLMSSetValue("cmi.completion_status","incomplete");
        }

        main = window.open("src/views/index.html" + attachment,"simopener", windowParams);
    } else {
        main = window.open("src/views/index.html" + attachment,"simopener", windowParams);
    }
}

function doExit () {
    if (main != null) {
        main.close();
    }

    if (!LMSInitialized) {
        return true;
    }

    // added to support test track
    if (isLMS) {
        if (LMSInitialized) {
            setScore();
            var compStatus = doLMSGetValue("cmi.completion_status");
            switch (compStatus) {
                case "completed":
                    doLMSSetValue("cmi.exit", "logout");
                    break;
                case "incomplete":
                    doLMSSetValue("cmi.exit", "suspend");
                    break;
            }

            doLMSCommit();
            doLMSTerminate();
        }
    }
}

// Controls the communication between Flash and the LMS. 
// Called from GuidedSim.mxml - onSimExit(event:GuidedSimEvent) or onSimUserExit(event:GuidedSimEvent)
function simClosed(status) {
    var currentStatus = "notAttempted";
    currentStatus = status;
    
    // If the lesson is already completed and passed don't set
    if (isLMS) {
        if (doLMSGetValue("cmi.completion_status") == "completed" 
            && doLMSGetValue("cmi.success_status") == "passed") {
            return true;
        }

        switch (status) {
            case "incomplete":
                doLMSSetValue("cmi.success_status","unknown");
                doLMSSetValue("cmi.completion_status","incomplete");
            break;
            case "failed":
                doLMSSetValue("cmi.success_status","failed");
                doLMSSetValue("cmi.completion_status","completed");
            break;
            case "complete":
                doLMSSetValue("cmi.success_status","passed");
                doLMSSetValue("cmi.completion_status","completed");
            break;
        }
    }
}

function setScore () {
    if (isLMS) {
        // If the lesson is already completed and passed don't set
        if (doLMSGetValue("cmi.completion_status") == "completed" 
            && doLMSGetValue("cmi.success_status") == "passed") {
                doLMSSetValue("cmi.score.min", 0);
                doLMSSetValue("cmi.score.max", 100);
                doLMSSetValue("cmi.score.raw", 100);
            return true;
        }
    }
}