angular.module('open-civ')
.directive('mapEditor', function() {
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

function generateMap() {
    let map;

    let rowCount = 50;
    let colCount = 2*rowCount;

    let mid = Math.floor(rowCount / 2);

    let seed = function () {
        Math.seedrandom(new Date().toString());

        map = [];
        for (let i = 0; i < rowCount; i++) {
            map.push([]);
            for (let j = 0; j < colCount; j++) {
                map[i].push('ocean');
            }
        }

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (Math.random() < .485) {
                    map[i][j] = 'mountains';
                }
                if (Math.random() < .05) {
                    map[i][j] = 'volcano';
                }
            }
        }
    }

    let water = ['ocean', 'coast'];
    
    let iterate = function () {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                let n1 = neighbors(map, i, j, 1);
                let n2 = neighbors(map, i, j, 2);
                let n3 = neighbors(map, i, j, 3);
                if (map[i][j] === 'ocean') {
                    // If we have a non-water neighbor, make us coast
                    if (n1.filter(n => !water.includes(n)).length > 0) {
                        map[i][j] = 'coast';
                    }
                    if (n1.filter(n => n !== 'mountains').length === 0) {
                        map[i][j] = 'mountains';
                    }
                } else if (map[i][j] === 'coast') {
                    // All neighbors within distance 2 are water
                    if (n2.filter(n => water.includes(n)).length === n2.length) {
                        map[i][j] = 'ocean';
                    }

                    // No ocean, all land or coast
                    if (n2.filter(n => n === 'ocean').length === 0) {
                        map[i][j] = 'grass';
                    }
                } else if (map[i][j] === 'mountains') {
                    if (n2.filter(n => n === 'grass').length / n2.length > .35) {
                        map[i][j] = 'grass';
                    }
                    // Over half neighbors water makes mountain coast.
                    if (n1.filter(n => water.includes(n)).length / n1.length > .5) {
                        map[i][j] = 'coast';
                    }
                } else if (map[i][j] === 'volcano') {
                    // Volcano next to water becomes mountains
                    if (n1.filter(n => water.includes(n)).length > 0) {
                        map[i][j] = 'mountains';
                    }
                } else if (map[i][j] === 'grass') {
                    if (n3.filter(n => water.includes(n)).length / n3.length < .005) {
                        map[i][j] = 'plains';
                    }
                }
            }
        }
    }

    let addIce = function () {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (['grass', 'plains'].includes(map[i][j])) {
                    let d = distanceFromEquator(mid, i) / mid;
                    if (d > .7) {
                        if (Math.random() > .7) {
                            map[i][j] = 'ice';
                        }
                    }
                    if (d > .8) {
                        if (Math.random() > .3) {
                            map[i][j] = 'ice';
                        }
                    }
                    if (d > .9) {
                        if (Math.random() > .05) {
                            map[i][j] = 'ice';
                        }
                    }
                }
            }
        }
    };

    let addPlains = function () {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (['grass'].includes(map[i][j])) {
                    let d = distanceFromEquator(mid, i) / mid;
                    if (d < .35) {
                        if (Math.random() > .5) {
                            map[i][j] = 'plains';
                        }
                    }
                    if (d < .2) {
                        if (Math.random() > .1) {
                            map[i][j] = 'plains';
                        }
                    }
                }
            }
        }
    };

    let addDesert = function () {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (['plains'].includes(map[i][j])) {
                    let d = distanceFromEquator(mid, i) / mid;
                    if (d < .25) {
                        if (Math.random() > .8) {
                            map[i][j] = 'desert';
                        }
                    }
                    if (d < .1) {
                        if (Math.random() > .2) {
                            map[i][j] = 'desert';
                        }
                    }
                }
            }
        }
    };

    let addJungle = function () {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (['grass'].includes(map[i][j])) {
                    let d = distanceFromEquator(mid, i) / mid;
                    let n3 = neighbors(map, i, j, 3);
                    if (n3.filter(n => water.includes(n)).length / n3.length > .15) {
                        if (Math.random() > .5) {
                            if (d < .3) {
                                map[i][j] = 'jungle';
                            } else {
                                map[i][j] = 'forest';
                            }
                        }
                    }
                }
            }
        }
    };

    seed();

    iterate();
    iterate();
    iterate();

    addIce();

    addPlains();

    addDesert();

    addJungle();

    return map;
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