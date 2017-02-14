/**
 * Created by prof.BOLA on 2/13/2017.
 */
(function () {

    'use strict';

    angular
        .module('spa.cities')
        .factory("spa.cities.City", CityFactory);

    CityFactory.$inject = ['$resource', 'spa.APP_CONFIG'];

    function CityFactory($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + '/api/cities/:id',
                            { id : "@id"},
                            { update : { method : 'PUT' } })
    }
})();