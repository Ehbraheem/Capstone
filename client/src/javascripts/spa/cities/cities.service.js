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
            {
                update : { method : 'PUT' ,
                    transformRequest : buildNextedBody},
                save : { method : 'POST' ,
                    transformRequest : buildNextedBody}
            }
        )
    };

    // nests the default payload below a "city" element
    // as required by Rails API by default
    function buildNextedBody (data) {
        return angular.toJson({city: data});
    };
})();