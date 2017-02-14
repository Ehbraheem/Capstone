/**
 * Created by prof.BOLA on 2/13/2017.
 */
(function () {

    'use strict';

    angular
        .module('spa.cities')
        .controller('spa.cities.CitiesController', CitiesController);

    CitiesController.$inject = ['spa.cities.City'];

    function CitiesController (City) {
        var citiesVM = this;
        citiesVM.city;
        citiesVM.cities;

        activate();
        return;

        /////////////////////////////
        
        function  activate() {
            newCity();
            citiesVM.cities = City.query();
        }

        function errorHandler(response) {

        }
        function newCity() {
            citiesVM.city = new City();
        }
        
        function edit() {
            
        }
        
        function remove() {
            
        }
        
        function create() {
            citiesVM.city.$save
                .then(function (response) {
                    console.log(response);
                    citiesVM.cities.push(citiesVM.city);
                    newCity();
                })
                .catch(errorHandler());
        }
        
        function update() {
            
        }

    }
})();