angular.module('open-civ')
.directive('mapEditor', function(randomIntFromInterval) {
    return {
        scope: {
        },
        link: function(scope, element, attrs) {
            let rowCount = 60;
            let colCount = 2*rowCount;

            let mid = Math.floor(rowCount / 2);

            let continentCount = 7;

            scope.seed = function () {
                scope.map = [];
                for (let i = 0; i < rowCount; i++) {
                    scope.map.push([]);
                    for (let j = 0; j < colCount; j++) {
                        scope.map[i].push('ocean');
                    }
                }

                Math.seedrandom(new Date().toString());
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        if (Math.random() < .5) {
                            scope.map[i][j] = 'mountains';
                        }
                        if (Math.random() < .05) {
                            scope.map[i][j] = 'volcano';
                        }
                    }
                }
            }

            let water = ['ocean', 'coast'];
            
            scope.iterate = function () {
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        let n1 = neighbors(scope.map, i, j, 1);
                        let n2 = neighbors(scope.map, i, j, 2);
                        if (scope.map[i][j] === 'ocean') {
                            // If we have a non-water neighbor, make us coast
                            if (n1.filter(n => !water.includes(n)).length > 0) {
                                scope.map[i][j] = 'coast';
                            }
                            if (n1.filter(n => n !== 'mountains').length === 0) {
                                scope.map[i][j] = 'mountains';
                            }
                        } else if (scope.map[i][j] === 'coast') {
                            // All neighbors within distance 2 are water
                            if (n2.filter(n => water.includes(n)).length === n2.length) {
                                scope.map[i][j] = 'ocean';
                                console.log('here')
                            }

                            // No ocean, all land or coast
                            if (n2.filter(n => n === 'ocean').length === 0) {
                                scope.map[i][j] = randomLand(i, mid);
                            }
                        } else if (scope.map[i][j] === 'mountains') {
                            // If we have a neighbor other than 
                            if (n1.filter(n => water.includes(n)).length > 2) {
                                scope.map[i][j] = 'coast';
                            }
                        } else if (scope.map[i][j] === 'volcano') {
                            if (n1.filter(n => water.includes(n)).length > 0) {
                                scope.map[i][j] = 'mountains';
                            }
                        }
                    }
                }
            }

            scope.seed();
            scope.iterate();
            scope.iterate();
        },
        template: `
        <button ng-click="seed()">seed</button>
        <button ng-click="iterate()">iterate</button>
        <map-viewer rows="map"></map-viewer>
        `
    }
});

function randomLand(row, mid) {
    // TODO:
    return 'grass';
}

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