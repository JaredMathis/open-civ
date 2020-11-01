angular.module('open-civ')
.directive('mapViewer', function(terrain) {
    console.log({terrain})
    return {
        scope: {
            rows: '&',
        },
        link: function (scope, element, attrs) {
            scope.getIndex = function () {
                return 1;
            }
        },
        template: `
        <div ng-repeat="row in rows()"
            style="line-height: 0px;">
            <div ng-repeat="col in row track by $index"
                style="display:inline;"><img src="images/terrain/{{col}}{{getIndex(col)}}.png"
                    style="display: inline"/></div>
        </div>
        `
    }
});