/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    window: false,
    Backbone: false,
    Controllers: false,
    Slog: false,
    $: false,
*/
$.log   = (Slog ? Slog.log : function () {});
$.warn  = (Slog ? Slog.warn : function () {});
$.error = (Slog ? Slog.error : function () {});
$.info  = (Slog ? Slog.info : function () {});
$.debug = (Slog ? Slog.debug : function () {});

$(document).ready(function InistialiseAvalanche() {
    $.info('Initialising Avalanche');
    window.avalanche = new Controllers.Application();
    Backbone.history.start();
});