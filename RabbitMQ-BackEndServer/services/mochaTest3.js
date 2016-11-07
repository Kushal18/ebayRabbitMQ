/**
 * New node file
 */


var should = require('should');//done
var request = require('request');//
var expect = require('chai').expect;
var baseURL = 'http://localhost:3000';
var util = require('util');

describe('return all search details', function(){
	it('it returns all search details',function(done){
		request.get({url:baseURL + '/buyPage'},				
		function(error, response, body){
			expect(response.statusCode).to.equal(200);
			console.log(body);
			done();
		});
	});
});