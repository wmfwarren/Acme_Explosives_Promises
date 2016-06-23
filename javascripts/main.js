"use strict";

$(document).ready(function(){
	var mainJS = (function(){
		var categoryName = null;
		var typeName = null;
		var categoryID = null;
		var typeID = null;
		var descriptionText = null;
		var productsArray = null; 
		var productName = null;
		// event listener
		$(document).on("change", "#dropdowns", function(event){
			getCategory(event)
			.then(function(category){
				return applyTypes(category);
			}).then(function(types){
				$(document).on("change", "#type", function(event){
					var typeName = $("#type").val();
					printTypeDescription(typeName, types);
				});
	      return changeTypeSelectors(types);
			}).then(function(products){
				$(document).on("change", "#product", function(event){
					productName = $("#product").val();

				});
				return loadProducts(products);
			});
		});

	//helper for printing description of the type
		function printTypeDescription (nameToCheck, types) {
			for(let i = 0; i < types.length; i++){
				for(let keys in types){
					if (types[keys] === nameToCheck){
						$("#typeOutput").append(`<p class="typeDescription">${types[i][name]}</p>`);
					}
				}
			}
		}
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

	//helper for the resolveCategory helper
		function changeTypeSelectors( JSONObject){

			var $typesZone = $("#type");
			var categoryType = JSONObject.types[categoryID];
			$typesZone.children().remove(); //remove old children

			$typesZone.append(`<option id="none">-</option>`);

			for (let i = 0; i < categoryType.length; i++){
				$typesZone.append(`<option id="${categoryType[i].name}">${categoryType[i].name}</option>`);
			}
			for (let i = 0; i < JSONObject.types.length; i++){
				let targetType = JSONObject.types[i];
				for (let j = 0; j < targetType.length; j++){
					if ($("#type").val() === targetType[j].name){
						typeName = targetType[j].name;
						typeID = targetType[j].id;
					}
				}
			}
		}

	//helper for adding to the product dropdown
		function changeProductSelectors(JSONTypeObject){
			var $productZone = $("#product");
			var typeProduct = JSONTypeObject.products[typeID];
			productsArray = typeProduct;
			$productZone.children().remove(); //remove old children

			$productZone.append(`<option id="none">-</option>`);
			for (let keys in typeProduct){
				$productZone.append(`<option id="${typeProduct[keys]["name"]}">${typeProduct[keys]["name"]}</option>`);
			}

		}
	//helper function to print to Dom

		///////////promises\\\\\\\\\\\
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
	      data: category
	    }).done(function(data) {
	      resolve(data);
	    }).fail(function(xhr, status, error) {
	      reject(error);
	    });
		  }
		)};

	  var loadProducts = function (types){
			return new Promise((resolve, reject) => {
		    $.ajax({
		      url: `../json/types/${categoryName}Products.json`,
		      // data: category
		    }).done(function(data) {
		    	changeProductSelectors(data);
		      resolve(data);
		    }).fail(function(xhr, status, error) {
		      reject(error);
		    });
			  }
		)};

	})();
});