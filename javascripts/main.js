"use strict";

$(document).ready(function(){
	var mainJS = (function(){
		var categoryID = null;
		// event listeners
		console.log("I load");
		$(document).on("change", "#category",function(event){
			getCategory(event)
			.then(function(category){
				return applyTypes(category);
			});
		});
	//helper function for get category
		function resolveCategory(data){
			for (let i = 0; i < data.category.length; i++){
				var targetCategory = data.category[i];
				if ($("#category").value() === targetCategory.name){
					var categoryName = targetCategory.name;
					categoryID = targetCategory.id;
				}
			}
			return categoryID;
		}
	//gets the category
		var getCategory = function(event){
			return new Promise((resovle, reject) => {
				$.ajax({
	      	url: "../json/categories.json"
	    	}).done(function(data) {
	      	resovle(data);
	      	//console.log(data);
	    	}).fail(function(xhr, status, error) {
	      	reject(error);
				});
			});
		};

		var applyTypes = function(category) {
	  return new Promise((resolve, reject) => {
	    $.ajax({
	      url: "../json/types/types.json",
	      data: category
	    }).done(function(data) {
	      resolve(data);
	      console.log(category);
	    }).fail(function(xhr, status, error) {
	      reject(error);
	    });
		  }
		)};
	})();
});