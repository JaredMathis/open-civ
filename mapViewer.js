angular.module('open-civ')
.directive('mapViewer', function() {
    return {
        scope: {
            rows: '&',
        },
        template: `
        <div ng-repeat="row in rows()"
            style="line-height: 0px;">
            <div ng-repeat="col in row track by $index"
                style="display:inline;"><img src="images/terrain/{{col}}1.png"
                    style="display: inline"/></div>
        </div>
        `
    }
});