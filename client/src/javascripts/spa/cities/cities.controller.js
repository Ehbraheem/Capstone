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
            citiesVM.edit = edit;
            citiesVM.update = update;
            citiesVM.remove = remove;
            citiesVM.create = create;
        }

        function errorHandler(response) {
            console.log(response);
        }
        function newCity() {
            citiesVM.city = new City();
        }
        
        function edit(object) {
            console.log("selected ", object);
            citiesVM.city = object;
        }
        
        function remove() {
            citiesVM.city.$remove()
                .then(function(response) {
                    console.log(response)
                })
                .then(errorHandler);
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
            citiesVM.city.$update()
                .then(function(response) {
                    console.log(response);

                    // remove from local array
                    removeElement(citiesVM.cities, citiesVM.city);

                    // query te server for updated element
                    // citiesVM.cities = City.query();

                    // replace edit area with prototype instance
                    newCity();
                })
                .catch(errorHandler);
        }

        function removeElement(elements, element ) {
            console.log(elements, element)
            elements.filter(function (obj) {
                obj.id === element.id ? elements.splice(elements.indexOf(element),1) : null
            });
        };

    }
})();