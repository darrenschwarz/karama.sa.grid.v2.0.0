/**
 * Created by Alexander S. on 11/8/2014.
 */
/**
 * Extended by Darren S. on 13/02/2016.
 */
'use strict';

require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        angular: '../bower_components/angular/angular',
        underscore: '../bower_components/underscore/underscore',
        'jquery.event.drag': '../src/jquery.event.drag',
        'jquery.ui': '../bower_components/jquery-ui/jquery-ui',
        slickcore: '../bower_components/slickgrid/slick.core',
        slickgrid: '../src/karama.slick.grid',
        slickdataview: '../bower_components/slickgrid/slick.dataview',
        'sa.grid': '../dist/sa.grid',
        'slickcheckboxselectcolumn':'../src/karama.slick.checkboxselectcolumn',
        'slickrowselectionmodel':'../bower_components/slickgrid/plugins/slick.rowselectionmodel',
        'slickcolumnpicker':'../bower_components/slickgrid/controls/slick.columnpicker',
        'slickformatters':'../src/karama.slick.formatters',
        'slickpager':'../bower_components/slickgrid/controls/slick.pager'
    },
    shim: {
        'jquery': {exports: '$'},
        'angular': {exports: 'angular'},
        'jquery.event.drag': {deps: ['jquery']},
        'jquery.ui': {deps: ['jquery']},
        'slickcore': {deps: ['jquery']},
        'slickgrid': {deps: ['slickcore', 'jquery.event.drag', 'jquery.ui']},
        'slickdataview': {deps: ['slickgrid']},
        'slickcheckboxselectcolumn':{deps: ['slickgrid']},
        'slickrowselectionmodel':{deps: ['slickgrid']},
        'slickcolumnpicker': {deps: ['slickgrid']},
        'slickformatters': {deps: ['slickgrid']},
        'slickpager':  {deps: ['jquery']},
        'sa.grid': {deps: ['angular', 'jquery', 'underscore', 'slickcore', 'slickgrid', 'slickdataview', 'slickcheckboxselectcolumn', 'slickrowselectionmodel','slickcolumnpicker', 'slickformatters', 'slickpager']}
    },
    priority: [
        'angular'
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'angular',
    'app'
], function (angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    angular.element().ready(function () {
        angular.resumeBootstrap([app['name']]);
    });
});