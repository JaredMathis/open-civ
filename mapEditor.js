angular.module('open-civ')
.directive('mapEditor', function(randomIntFromInterval) {
    return {
        scope: {
        },
        link: function(scope, element, attrs) {
            let rowCount = 50;
            let colCount = 100;

            scope.map = [];
            for (let i = 0; i < rowCount; i++) {
                scope.map.push([]);
                for (let j = 0; j < colCount; j++) {
                    scope.map[i].push('ocean');
                }
            }

            let mid = Math.floor(rowCount / 2);

            scope.iterate1 = function () {
                Math.seedrandom(new Date().toString());
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        if (scope.map[i][j] === 'ocean') {
                            if (randomIntFromInterval(0, distanceFromEquator(mid, i) / 8) === 0) {
                                scope.map[i][j] = 'coast';
                            }
                        }
                    }
                }
            }

            scope.iterate2 = function () {
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        if (scope.map[i][j] === 'coast') {
                            let n = neighbors(scope.map, i, j, 4);
                            // 50% neighbors ocean
                            if (n.filter(o => o === 'ocean').length/n.length > .8) {
                                scope.map[i][j] = 'ocean';
                            }
                        }
                    }
                }
            }

            // scope.iterate2 = function () {
            //     Math.seedrandom(new Date().toString());
            //     for (let i = 0; i < rowCount; i++) {
            //         for (let j = 0; j < colCount; j++) {
            //             if (scope.map[i][j] === 'ocean') {
            //                 let n = neighbors(scope.map, i, j);
            //                 console.log(n);
            //                 if (n.filter(o => o === 'coast').length === 4) {
            //                     scope.map[i][j] = 'coast'
            //                 }
            //             }
            //         }
            //     }
            // }
            scope.iterate1();
            
            scope.iterate2();
            scope.iterate2();
            scope.iterate2();
            scope.iterate2();
        },
        template: `
        <button ng-click="iterate1()">Iterate1</button>
        <button ng-click="iterate2()">Iterate2</button>
        <map-viewer rows="map"></map-viewer>
        `
    }
});

function distanceFromEquator(mid, row) {
    if (row > mid) {
        return row - mid;
    }
    return mid - row;
}

function neighbors(map, row, col, maxDistance) {
    let rowCount = map.length;
    let colCount = map[0].length;

    let result = [];

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let d = distance(i, j, row, col, colCount);
            if (d === 0) {
                continue;
            }
            if (d > maxDistance) {
                continue;
            }
            result.push(map[i][j]);
        }
    }

    return result;
}

function distance(row1, col1, row2, col2, colCount) {
    let xDistance = Math.min(Math.abs(col2 - col1), colCount - Math.abs(col2 - col1));
    let yDistance = Math.abs(row2 - row1);
    return xDistance + yDistance;
}