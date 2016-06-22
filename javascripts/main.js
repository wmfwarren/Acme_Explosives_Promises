"use strict";

$(document).ready(function(){
	var mainJS = (function(){
		var categoryName = null;
		var typeName = null;
		var categoryID = null;
		var typeID = null;
		// event listener
		$(document).on("change", "#category", function(event){
			getCategory(event)
			.then(function(category){
				return applyTypes(category);
			}).then(function(types){
	      return changeTypeSelectors(types);
			});
		});

		$(document).on("change", "#type", function(event){
			loadProducts(event)
			.then(function(types){
				return resolveType(types);
			});
		});	
	//helper function for get category
		function resolveCategory(data){
			for (let i = 0; i < data.categories.length; i++){
				var targetCategory = data.categories[i];
				if ($("#category").val() === targetCategory.name){
					categoryName = targetCategory.name;
					categoryID = targetCategory.id;
				}
			}
			categoryName = categoryName;
			categoryID = categoryID;
		}
	//helper
		function resolveType(data) {
			for (let i = 0; i < data.types.length; i++){
				var targetType = data.types[i];
				if ($("#type").val() === targetType.name){
					typeName = targetType.name;
					typeID = targetType.id;
				}
			}
			typeName = typeName;
			typeID = typeID;
		}
	//helper for the resolveCategory helper
		function changeTypeSelectors( JSONObject){
			var $typesZone = $("#type");
			var categoryType = JSONObject.types[categoryID];
			
			$typesZone.children().remove(); //remove old children

			$typesZone.append(`<option id="none">-</option>`);

			for (let i = 0; i < categoryType.length; i++){
				$typesZone.append(`<option id="${categoryType[i].name}">${categoryType[i].name}</option>`);
			}
			
		}
	//helper
		// function setTypeID(typeToMatch){
		// 	for (let i = 0; i < typeToMatch.length; i++){
		// 		if ($("#type").val() === categoryToMatch.name){
		// 			typeID = categoryToMatch[i].id;
		// 		}
		// 	}
		// }
	//helper for adding to the product dropdown
		function changeProductSelectors(JSONTypeObject){
			var $productZone = $("#product");
			var typeProduct = JSONTypeObject.products[typeID];

			$productZone.children().remove(); //remove old children

			$productZone.append(`<option id="none">-</option>`);
			for (let keys in typeProduct){
					$productZone.append(`<option id="${typeProduct[keys]}">${typeProduct[keys]}</option>`);
			}


		}
	//gets the category
		var getCategory = function(event){
			return new Promise((resovle, reject) => {
				$.ajax({
	      	url: "../json/categories.json"
	    	}).done(function(data) {
	      	 resolveCategory(data);
	      	resovle(data );
	    	}).fail(function(xhr, status, error) {
	      	reject(error);
				});
			});
		};

		var applyTypes = function(category, categoryID) {
	  return new Promise((resolve, reject) => {
	    $.ajax({
	      url: "../json/types/types.json",
	      // data: category
	    }).done(function(data) {
	      resolve(data);
	    }).fail(function(xhr, status, error) {
	      reject(error);
	    });
		  }
		)};

	  var loadProducts = function (){
			return new Promise((resolve, reject) => {
		    $.ajax({
		      url: `../json/types/${categoryName}Products.json`,
		      // data: category
		    }).done(function(data) {
		    	changeProductSelectors(data);
		      resolve(data);
		      console.log(data);
		    }).fail(function(xhr, status, error) {
		      reject(error);
		    });
			  }
		)};

	})();
});