class Helper {
    
    public static initialize(container, width, height) {
        var startTime, endTime;

        Object.prototype['isEmpty'] = function() {
            for(var key in this) {
                if(this.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        let point1 = {};
        let point2 = {};

        container.on('pointerup', function (gameObject) {
            if (point1['isEmpty']()) {
                point1['x'] = gameObject.x;
                point1['y'] = gameObject.y;
                start();
            }
            else {
                point2['x'] = gameObject.x;
                point2['y'] = gameObject.y;

                console.log(point1);
                console.log(point2);
                console.log('Width: ' + (point2['x'] - point1['x']));
                console.log('Height: ' + (point2['y'] - point1['y']));
                console.log('Elapsed: ' + end());
                point1 = {};
                point2 = {};
            }
        });

        function start() {
        startTime = new Date();
        };

        function end() {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;

        // get seconds 
        var seconds = Math.round(timeDiff);
        console.log(seconds + " seconds");
        }
    }

    public static getQueryString ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    }
}