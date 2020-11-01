angular.module('open-civ')
.directive('mapEditor', function() {
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
        },
        template: `
        <button ng-click="">Iterate</button>
        <map-viewer rows="map"></map-viewer>
        `
    }
});