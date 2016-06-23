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
		$(document).on("change", "#category", function(event){
			categoryName = $("#category").val();
		});

		$(document).on("change", "#dropdowns", function(event){
			getCategory(event)
			.then(function(category){
				return applyTypes(category);
			}).then(function(types){
				typeName = $("#type").val();
				printTypeDescription(categoryName, typeName, types);
	      return changeTypeSelectors(types, categoryName);
			}).then(function(products){
				$(document).on("change", "#product", function(event){
					productName = $("#product").val();
					printProductDescription(categoryName, productName, productsArray);
				});
				return loadProducts(products);
			});
		});

	//helper for printing description of the type
		function printTypeDescription(category, typeToCheck, types) {
			for (let keys in types["types"][category][typeToCheck]){
				$("#typeOutput").children().remove();
				$("#typeOutput").append("<h3>Type Description</h3>");
				if (keys === "description"){
					let typeToPrint = types["types"][category][typeToCheck]["description"];
					$("#typeOutput").append(`<p>${typeToPrint}</p>`);
				}
			}
		}
	//Printing product descriptions
		function printProductDescription(category, productToCheck, productsArray) {
			for (let keys in productsArray){
				$("#productOutput").children().remove();
				$("#productOutput").append("<h3>Product Description</h3>");
				if(keys === productToCheck){
					$("#productOutput").append(`<p>${productsArray[productToCheck]["description"]}</p>`);
				}
			}
		}
	//helper for the resolveCategory helper
		function changeTypeSelectors( JSONObject, categoryName) {

			var $typesZone = $("#type");
			var categoryType = JSONObject["types"][categoryName];
			//event listener for changing of the type
			$(document).on("change", "#type", function(event){
				var categoryType = JSONObject["types"][categoryName];
				var selectedType = $("#type").val();
				typeID = categoryType["category"];
			});
			
			if ($typesZone.children().length > 0){
				$typesZone.children().remove(); //remove old children
			}
			$typesZone.append(`<option id="none">-</option>`);

			for (let keys in categoryType){
				$typesZone.append(`<option id="${keys}">${keys}</option>`);
			}
		}

	//helper for adding to the product dropdown
		function changeProductSelectors(JSONTypeObject, type){
			var $productZone = $("#product");
			var typeProduct = JSONTypeObject["products"][`${type}`];
			productsArray = typeProduct;
			$productZone.children().remove(); //remove old children
			$productZone.append(`<option id="none">-</option>`);
				for (let keys in typeProduct){
					let optionToAdd = keys;
					$productZone.append(`<option id="${optionToAdd}">${optionToAdd}</option>`);
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
		    	changeProductSelectors(data, typeName);
		      resolve(data);
		    }).fail(function(xhr, status, error) {
		      reject(error);
		    });
			  }
		)};

	})();
});