angular.module('open-civ')
.directive('mapEditor', function(randomIntFromInterval) {
    return {
        scope: {
        },
        link: function(scope, element, attrs) {
            let rowCount = 10;
            let colCount = 15;
            scope.map = [];
            for (let i = 0; i < rowCount; i++) {
                scope.map.push([]);
                for (let j = 0; j < colCount; j++) {
                    scope.map[i].push('ocean');
                }
            }

            scope.iterate = function () {

            }
        },
        template: `
        <button ng-click="iterate()">Iterate</button>
        <map-viewer rows="map"></map-viewer>
        `
    }
});