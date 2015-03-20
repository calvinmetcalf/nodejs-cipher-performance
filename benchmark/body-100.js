/**
 * Module dependencies.
 */

var benchmark = require('benchmark')
var benchmarks = require('beautify-benchmark')
var seedrandom = require('seedrandom')

/**
 * Globals for benchmark.js
 */

global.buffer = getbuffer(100);
global.cipher = require('..')

var suite = new benchmark.Suite

var encoding = [true, false];
var ciphers = ['aes-128-ctr'];
ciphers.push('chacha20');
ciphers.push('chacha');
//ciphers.push('chacha20/poly1305')
for (var i = 0, ii = ciphers.length; i < ii; i++) {
    var j = 2;
    // for (var j = 0, jj = encoding.length; j < jj; j++) {
    // suite.add({
    // name: ' string-' + encoding[j] + '-' + ciphers[i],
    // minSamples: 50,
    // fn: 'var val = cipher(string, "' + ciphers[i] + '", "' + encoding[j]
    // + '")'
    // });
    // suite.add({
    //     name: ' js-' + ciphers[i],
    //     minSamples: 100,
    //     fn: 'var val = cipher(buffer, "' + ciphers[i] +'",true)'
    // });
    suite.add({
        name: ciphers[i],
        minSamples: 1000,
        fn: 'var val = cipher(buffer, "' + ciphers[i] +'",false)'
    });
    // }
}

suite.on('start', function onCycle(event) {

    process.stdout.write('  100 byte body\n\n')
})

suite.on('cycle', function onCycle(event) {

    benchmarks.add(event.target);
})

suite.on('complete', function onComplete() {

    benchmarks.log();
    console.log('Fastest is:' + this.filter('fastest').pluck('name') + '\n');
})

suite.run({
    async: false
})

function getbuffer(size) {

    var buffer = new Buffer(size)
    var rng = seedrandom('body ' + size)

    for (var i = 0; i < buffer.length; i++) {
        buffer[i] = (rng() * 94 + 32) | 0
    }

    return buffer
}
