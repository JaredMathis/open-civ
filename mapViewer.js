angular.module('open-civ')
.directive('mapViewer', function(terrain, randomIntFromInterval) {
    return {
        scope: {
            rows: '&',
        },
        link: function (scope, element, attrs) {
            scope.getIndex = function (t, rowIndex, colIndex) {
                Math.seedrandom(`${rowIndex} ${colIndex}`);
                return randomIntFromInterval(1, terrain[t]);
            }
        },
        template: `
        <div ng-repeat="row in rows() track by $index"
            style="line-height: 0px;">
            <div ng-init="rowIndex = $index"></div>
            <div ng-repeat="col in row track by $index"
                ng-init="colIndex = $index"
                style="display:inline;"><img src="images/terrain/{{col}}{{getIndex(col, rowIndex, colIndex)}}.png"
                    style="display: inline"/></div>
        </div>
        `
    }
});