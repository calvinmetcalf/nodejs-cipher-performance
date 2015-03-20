'use strict';
/**
 * @file nodejs-cipher-performance main
 * @module nodejs-cipher-performance
 * @subpackage main
 * @version 0.0.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var cryptonative = require('browserify-aes');
var cryptojs = require('browserify-aes/browser');
var chachaNative = require('chacha');
var chachajs = require('chacha/browser');

/*
 * functions
 */
/**
 * main
 *
 * @exports ciphers
 * @function ciphers
 * @param {String|Buffer} raw - Check README.md
 * @param {String} cipher - Check README.md
 * @param {String|Buffer} password - Check README.md
 * @param {String} encoding - Check README.md
 * @return {Object}
 */
var emptyBuffer = new Buffer('');
var key128 = new Buffer(16);
var key192 = new Buffer(24);
var key256 = new Buffer(32);
var iv16 = new Buffer(16);
var iv12 = new Buffer(12);
var iv8 = new Buffer(8);
key128.fill(0);
key192.fill(0);
key256.fill(0);
iv16.fill(0);
iv12.fill(0);
iv8.fill(0);
function ciphers(raw, cipher, js) {
  var auth = (cipher.indexOf('gcm') > -1);
  if (cipher === 'chacha20/poly1305' || cipher === 'chacha20') {
    auth = true;
  }
  var key;
  if (cipher.indexOf('128') > -1) {
    key = key128;
  } else if (cipher.indexOf('192') > -1) {
    key = key192;
  } else {
    key = key256;
  }
  var iv;
  if (cipher.indexOf('ecb') > -1) {
    iv = emptyBuffer;
  } else if (auth) {
    iv = iv12;
  } else if (cipher === 'chacha') {
    iv = iv8;
  } else {
    iv = iv16;
  }
  var crypto;
  if (js) {
    if (cipher === 'chacha20') {
      crypto = chachajs.chacha20;
    } else if (cipher === 'chacha20/poly1305') {
      crypto = chachajs.aead;
    } else {
      crypto = cryptojs.createCipheriv;
    }
  } else {
    if (cipher === 'chacha20') {
      crypto = chachaNative.chacha20;
    } else if (cipher === 'chacha20/poly1305') {
      crypto = chachaNative.aead;
    } else {
      crypto = cryptonative.createCipheriv;
    }
  }
  var out;
  if (cipher === 'chacha20' || cipher === 'chacha20/poly1305') {
    out = new crypto(key, iv);
  } else {
    out = crypto(cipher, key, iv);
  }
  return out.update(raw);
}
module.exports = ciphers;
