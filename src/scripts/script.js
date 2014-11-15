// Get random int from (inclusive) min to (inclusive) max
function getRandInt(min, max) {
    var roundedMin = Math.round(min);
    var roundedMax = Math.round(max);

    var range = roundedMax - roundedMin;

    var rand = Math.floor(Math.random() * (range + 1)) + roundedMin;

    return rand;
}

function Gradient(x1, y1, r1, x2, y2, r2, colorStops) {
    return {
        x1: x1,
        y1: y1,
        r1: r1,

        x2: x2,
        y2: y2,
        r2: r2,

        colorStops: colorStops
    };
}

// Returns string of random rgb color
function getRandColor() {
    var color = 'rgb(';

    var limit = 3;
    for (var j = 0; j < limit; j++) {
        color += '' + getRandInt(0, 255);
        if (j < limit - 1) {
            color += ', ';
        }
    }

    color += ')';

    return color;
}

// http://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
