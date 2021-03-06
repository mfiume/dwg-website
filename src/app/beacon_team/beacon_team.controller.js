'use strict';

angular.module('ga4gh').controller('BeaconTeamCtrl', function ($scope, Tabletop, $q, $http) {
    $scope.active_menu = 'teams';
	$scope.team_name = 'Beacon Project';
    $scope.team_desc_text = 'The Beacon project is a project to test the willingness of international sites to share genetic data in the simplest of all technical contexts.';

	$scope.github = {
		uri: 'https://github.com/ga4gh/schemas',
		text: 'githb.com/ga4gh/schemas'
	};

	Tabletop.then(function (ttdata) {
		var data = ttdata[0].beacon.elements;
		$scope.members = split(data, 3);
	});

	function split(a, n) {
		var len = a.length,
			out = [],
			i = 0;
		while (i < len) {
			var size = Math.ceil((len - i) / n--);
			out.push(a.slice(i, i += size));
		}
		return out;
	}

	$scope.error = undefined;

	// constants
	var timeout = 30000;
	var restUrl = "http://dnastack.com/bob-api/rest/";
	var beaconsUrl = restUrl + "beacons";
	var responsesUrl = restUrl + "responses?";


	/*
	 * helper method for printBeaconsList
	 * groups response based on organization
	 * returns  { organization-name: [ {'name' : beacon-name, 'aggregator' : value} ] }
	 */
	function groupResponseByOrganization(response) {

		var groupedResponse = {};

		//console.log(response);

		for (var i = 0; i < response.length; i++) {
			var current = response[i];
			if (groupedResponse[current.organization] === undefined) {
				var object = [{"name": current.name, "aggregator": current.aggregator, "id":current.id}];
				groupedResponse[current.organization] = object;
			}
			else {
				groupedResponse[current.organization].push({"name": current.name, "aggregator": current.aggregator, "id":current.id});
			}
		}
		return groupedResponse;
	}

	function getBeaconsList($q, $http) {

		var deferred = $q.defer();

		$http.get(beaconsUrl).success(function(data){

			var response = groupResponseByOrganization(data);
			deferred.resolve(response);

		}).error(function(){
			deferred.reject(null);
		});

		return deferred.promise;
	}

	getBeaconsList($q, $http).then(function(data) {
		$scope.organizations = data;
	}, function(error) {
		console.log('Failed: ' + error);
		$scope.error = error;
		console.log($scope.error);
	}, function(update) {
		console.log('Got notification: ' + update);
	});

});

