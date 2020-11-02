angular.module('open-civ')
.directive('mapEditor', function(generateMap) {
    return {
        scope: {
        },
        link: function(scope, element, attrs) {
            scope.map = generateMap(100, 200);
        },
        template: `
        <map-viewer rows="map"></map-viewer>
        `
    }
});