/**
 * Created by prof.BOLA on 2/13/2017.
 */

(function () {

    'use strict';

    angular
        .module('spa')
        .config(RouterFunction);

    RouterFunction.$inject = [
        '$stateProvider',
        '$urlRouterProvider',
        'spa.APP_CONFIG'
    ];

    function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
        $stateProvider
            .state('home', {
                url : '/',
                templateUrl : APP_CONFIG.main_page_html,

            })

        $urlRouterProvider.otherwise('/');
    }

})();