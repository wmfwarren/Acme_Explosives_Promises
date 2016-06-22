"use strict";
var mainJS = (function(){
	$(document).ready(function(){
		// event listeners
		$("#category").on("change", "#fireworks", getCategory);

		var getCategory = function(){
			return new Promise((resovle, reject) => {
				$.ajax({
	      	url: "../json/categories.json"
	    	}).done(function(data) {
	      	resolve(data);
	    	}).fail(function(xhr, status, error) {
	      	reject(error);
			});
		};
	});
});