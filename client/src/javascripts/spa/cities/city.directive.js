/**
 * Created by prof.BOLA on 2/13/2017.
 */
(function () {

    'use strict';

    angular
        .module('spa.cities')
        .directive("sdCity", CitiesDirective);

    CitiesDirective.$inject = ['spa.APP_CONFIG'];

    function CitiesDirective(APP_CONFIG) {
        var ddo = {
            templateUrl : APP_CONFIG.cities_html,
            replace : true,
            bindToController : true,
            controller : 'spa.cities.CitiesController',
            controllerAs : 'citiesVM',
            restrict : 'E',
            scope : {},
            link : link
        };

        return ddo;

        function link(scope, element, attrs) {
            console.log("CitiesDirective ", scope);
        }
    }
})();