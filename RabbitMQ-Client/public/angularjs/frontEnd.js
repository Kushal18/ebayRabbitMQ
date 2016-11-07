//module
var myApp = angular.module('myApp',['ngRoute','ngMaterial']);


//maincontroller
myApp.config(function($routeProvider){
    $routeProvider
    
    .when('/',{
          templateUrl : 'templates/homedata.html',
          controller  : 'mainBodyController'
          })
    .when('/signin',{
          templateUrl : 'templates/signin.html',
          controller  : 'signInController'
          })
    
    .when('/register',{
          templateUrl : 'templates/register.html',
          controller :	'registerController'
          })
    .when('/myAccount',{
        templateUrl : 'templates/Account.html'
        })
     .when('/search',{
        templateUrl : 'templates/search.html'
        	
        })
     .when('/buy',{
        templateUrl : 'templates/buyPage.html',
        controller : ''
        	
        })
    .when('/cardDetails',{
    	templateUrl : 'templates/cardValidate.html'
    })
      .when('/orderConfirmation',{
    	templateUrl : 'templates/orderConfirmation.html'
    })
    .when('/getMycollection',{
    	templateUrl : 'templates/myCollections.html'
    })
    .when('/myEbay',{
    	templateUrl : 'templates/myPurchases.html'
    })
    .when('/sell',{
        templateUrl : 'templates/sell.html'
        });
  
});

myApp.controller('myPurchases',['$scope','$http','userservice',function($scope,$http,userservice){
	$http({
		method: 'get',
		url: '/myEbay'
	}).success(function(data){
		 $scope.results = data;
		 
	});
	
	
}]);





myApp.controller('myCollection',['$scope','$http','userservice',function($scope,$http,userservice){
	$http({
		method: 'get',
		url: '/getMycollection'
	}).success(function(data){
		 $scope.results = data;
		 
	});
	
	
}]);



myApp.controller('confirmAndPay',['$scope','$http','userservice',function($scope,$http,userservice){
	$scope.price = 0;
	
	$http({
		method: 'get',
		url: '/getCartDetails'
	}).success(function(data){
		 $scope.results = data;
		 console.log("total number of items in the cart are "+$scope.results.length);
		// console.log($scope.results);
		 $scope.items = $scope.results.length; //your order total
		 console.log($scope.results);
		 console.log($scope.results[0].buyer);
		 $scope.buyer = $scope.results[0].buyer;
		 console.log(data);
		for(var i = 0 ; i < $scope.results.length ; i++){
			console.log($scope.results[i].price);
			if(typeof $scope.price === 0){
				$scope.price = parseInt($scope.results[i].price);
				console.log($scope.price);
			} else{
				$scope.price = parseInt($scope.price) + parseInt($scope.results[i].price);
				console.log($scope.price);
			}
			
		}
		 
	});
	
	
}]);




/*this controller navigates to the order confirmation page on confirm and pay*/
myApp.controller('checkOutController',['$scope','$http','userservice',function($scope,$http,userservice){
	$scope.price = 0;
	$scope.cardNumber ='';
	$scope.error ='';
	$scope.expiryDate ='';
	$scope.cvv ='';
	$scope.ItemId = '';
	$scope.quantity='';
	
	$scope.errorMessage = false;
	$http({
		method: 'GET',
		url: '/getCartDetails'
	}).success(function(data){
		 $scope.results = data;
		 console.log("total number of items in the cart are "+$scope.results.length);
		 console.log("item Id is"+$scope.results.ItemId);
		 $scope.items = $scope.results.length;
		 $scope.ItemId = $scope.results.ItemId;
		 console.log(data);
		for(var i = 0 ; i < $scope.results.length ; i++){
			console.log($scope.results[i].price);
			if(typeof $scope.price === 0){
				$scope.price = parseInt($scope.results[i].price);
				console.log($scope.price);
			} else{
				$scope.price = parseInt($scope.price) + parseInt($scope.results[i].price);
				console.log($scope.price);
			}
			
		}
		 
	});
	
	$scope.confirmAndPay = function(){
		console.log("validating card details");
		$http({
			method: "POST",
			url: '/orderConfirmation',
			data:{ "cardNumber" : $scope.cardNumber,
				    "expiryDate": $scope.expiryDate,
				    "cvv"       : $scope.cvv
			}
		}).success(function(data){
			console.log(data.error);
			if(data.statuscode === 400){
				console.log("statuscode is");
				$scope.errorMessage = true;
				$scope.error = data.error;
			} else if(data.statuscode === 200){
				
				window.location.assign("#/orderConfirmation");
			}
			 
		});
		
	};
	
	
	$scope.removeFromTheCart = function(id){
		console.log("this is the itemId"+id);
		$scope.itemId = id; 
		var itemToRemove = {"itemToRemove":id};
		$http({
			method: "POST",
			url: '/removeFromCart',
			data: itemToRemove
		}).success(function(data){
			
				 $scope.results = data;
				 console.log("total number of items in the cart are "+$scope.results.length);
				 $scope.items = $scope.results.length;
				 console.log(data);
				 if(typeof userservice.badge == "undefined" || userservice.badge == 0){
					 userservice.badge = 0;
				 } else {
					 userservice.badge = parseInt(userservice.badge) - 1;	 
				 }
				 	
				 $scope.price = 0;
				 for(var i = 0 ; i < $scope.results.length ; i++){
						console.log($scope.results[i].price);
						if(typeof $scope.price === 0){
							$scope.price = parseInt($scope.results[i].price);
							console.log($scope.price);
						} else{
							$scope.price = parseInt($scope.price) + parseInt($scope.results[i].price);
							console.log($scope.price);
						}
						
					}
					
				});
	};

}]);

/* this controller is for buyPage.html for buyitnow and addtocart functionality */
myApp.controller('buyPageController',['$scope','$http','userservice',function($scope,$http,userservice){
	
	$scope.description = true;
	$scope.showCartMessage = false;
	$scope.itemId ='';
	$scope.amount = {};
	$scope.amount.newbidamount='';
	$scope.currentBiddingAmount='';
	var valueItemId;
	
	$http({
		method: 'GET',
		url: '/getBuyPage'
	}).success(function(data){
		  console.log("sucess");
		  console.log(data[0].itemToSell);
		  $scope.summary = data[0].summary;
		  $scope.quantity = data[0].quantity;
		  $scope.address = data[0].address;
		  $scope.price = data[0].price;
		  $scope.itemId = data[0].itemId;
		  
		  console.log("item id in get is" +$scope.itemId);
	});
	
	$scope.$watch(function(){
		return userservice.itemId;
	}, function (newValue) {
		console.log("newValue in buyPageController is " +newValue);
		valueItemId = {"valueItemId" : newValue };
		$scope.itemId = valueItemId.valueItemId;
		console.log("scope item id is "+$scope.itemId);
		$http({
			method:"POST",
			url: '/buyPage',
			data: valueItemId
		}).success(function(data){
		  console.log("sucess");
		  console.log(data[0].itemToSell);
		  $scope.summary = data[0].summary;
		  $scope.quantity = data[0].quantity;
		  $scope.address = data[0].address;
		  $scope.price = data[0].price;
		  $scope.itemId = data[0].itemId;
		  var bidding = data[0].bidding;
		  $scope.owner = data[0].email;
		  console.log("bidding is"+bidding);
		 if(bidding === 1){
			 $scope.currentBiddingAmount = data[0].currentBiddingAmount;
			  $scope.bidding = true;
		  } else{
			  $scope.bidding = false;
		  }
		 console.log("item value id is"+valueItemId.valueItemId);
		 console.log("item id after post is"+$scope.itemId);
		});
	},true);
	
	$scope.descriptionButton  = function(){
		console.log("description");
		$scope.description = true;
	};
	$scope.shippingAndPayment  = function(){
		console.log("shippingAndPayment");
		$scope.description = false;
		
	};
	//adds to the cart and checks if previously been added
	$scope.AddtoCart = function(){
		
		console.log("add to cart is");
		
		$http({
			method:"POST",
			url: '/addToCart',
			data:
			{  		"summary" :  $scope.summary,
				  	"quantity":  $scope.quantity,
				  	"address" :  $scope.address,
				  	"price"   :  $scope.price,
				  	"ItemId"  :  valueItemId
			}
		}).success(function(data){
		 if(data.statusCode == 200){
			 userservice.badge = parseInt(userservice.badge) + 1;
			 console.log("badge now is");
			 console.log(userservice.badge);
			 $scope.showCartMessage = true;
		} 
		});
		
	};
	
	/* should include the current itemId and if any previous cart details present  */
	$scope.buyItNow = function(){
		console.log("item Id of this page is" +valueItemId.valueItemId);
		$http({
			method:"POST",
			url: '/buyItNow',
			data:
			{  		"summary" :  $scope.summary,
				  	"quantity":  $scope.quantity,
				  	"address" :  $scope.address,
				  	"price"   :  $scope.price,
				  	"ItemId"  :  valueItemId
			}
		}).success(function(data){
			console.log("after buyItNow");
			if(data.statusCode === 200){
				window.location.assign("#/cardDetails");
			}
		 
		});
		
	};
	$scope.bidAmount = function(){
		 console.log($scope.amount.newbidamount);
		$http({
			method:"POST",
			url: '/bidAmount',
			data: {
				"newAmount" : $scope.amount.newbidamount,
				"valueitemId" : valueItemId,
				"owner":$scope.owner
				  }
		}).success(function(data){
			console.log(data.currentBiddingAmount);
			$scope.currentBiddingAmount = $scope.amount.newbidamount;
		});
	};

}]);

myApp.controller('searchController',['$scope','$http','userservice',function($scope,$http,userservice){
	
	$scope.$watch(function(){
		return userservice.searchValue;
	}, function (newValue) {
		console.log("newValue is " +newValue);
		var valueToSearch = {"valuetosearch" : newValue };
		console.log("valueToSearch is " +valueToSearch.valuetosearch);
		$http({
			method:"POST",
			url: '/searchController',
			data: valueToSearch
		}).success(function(data){
		  console.log(data);
		  $scope.results = data;
		 
		});
		
		
	},true);
	
	$scope.gotopage = function(id){
		userservice.itemId = id;
		console.log("item id is"+id);
		window.location.assign("#/buy");
		};
		
		
		
	
	
	
	
}]);






myApp.controller('sellController',['$scope','$http','userservice',function($scope,$http,userservice){
	$scope.login=false; //by default
	$scope.itemToSell="";
	$scope.price="";
	$scope.sellerName="";
	$scope.quantity="";
	$scope.summary="";
	$scope.feature1="";
	$scope.feature2="";
	$scope.feature3="";
	$scope.feature4="";
	$scope.address="";
	$scope.auction="";
	$scope.saveMyDetails = function(){
		$http({
 	   		method : "POST",
			url : '/sell',
			data : {
				"itemToSell" :$scope.itemToSell,
				"price" :$scope.price,
				"sellerName":$scope.sellerName,
				"quantity":$scope.quantity,
				"summary":$scope.summary,
				"feature1":$scope.feature1,
				"feature2":$scope.feature2,
				"feature3":$scope.feature3,
				"feature4":$scope.feature4,
				"address":$scope.address,
				"auction":$scope.auction
			}
			
 		}).success(function(data) {
 			console.log("seller details successfull posted onto the db");
 			if(data.statusCode == "200"){
 				window.location.assign("signin#/signin");
 			}
 			
 		});
		
	};
	
	
	
}]);
myApp.controller('accountController',['$scope','$http',function($scope,$http){
	
	$http({
		method: 'GET',
		url: '/accountDetals'
	}).success(function(data){
		console.log("here after getting");
		$scope.firstName = data.firstName;
		$scope.lastName = data.lastName;
		$scope.password = data.password;
		$scope.phoneNumber = data.phone;
		console.log(data.phone);
		$scope.ebayHandle = data.ebayhandle;
		console.log(data.ebayhandle);
		$scope.dob = data.DateOfBirth;
		$scope.cardNumber = data.cardNumber;
		$scope.expiryDate = data.expiryDate;
		$scope.cvv = data.cvv;
		$scope.phoneNumber = data.phoneNumber;
	});
	
	
	
	
	
	$scope.firstName = "";
	$scope.lastName = "";
	$scope.password ="";
	$scope.ebayHandle="";
	$scope.dob="";
	$scope.cardNumber="";
	$scope.expiryDate="";
	$scope.cvv="";
	$scope.phoneNumber="";
	$scope.saveMyDetails = function(){
		$http({
 	   		method : "POST",
			url : '/myAccount',
			data : {
				"firstName" :$scope.firstName,
				"lastName" :$scope.lastName,
				"password":$scope.password,
				"phoneNumber":$scope.phoneNumber,
				"ebayHandle":$scope.ebayHandle,
				"dob":$scope.dob,
				"cardNumber":$scope.cardNumber,
				"expiryDate":$scope.expiryDate,
				"cvv":$scope.cvv
			}
			
 		}).success(function(data) {
 			
 		});
		
	};
}]);
myApp.controller('mainBodyController',['$scope','userservice',function($scope,userservice){

}]);

myApp.controller('homeController',['$scope','$http','userservice',function($scope,$http,userservice){
	console.log("in this homeController");
	$scope.signInHide = true;
	$scope.showUserName = false;
	$scope.search="";
	console.log(userservice);
	$scope.logOut = function(){
		$http({
			method: 'GET',
			url: '/logout'
		}).success(function(data){
			console.log("status code is"+data.statusCode);
			if(data.statusCode == 200)
			{
				window.location.assign("signin#/signin");	
			}
		});
		
	};
	$scope.$watch(function(){
		return userservice.username;
	}, function (newValue) {
		$scope.username = newValue;
		console.log("user service username is "+userservice.username);
		console.log($scope.username);
		console.log("setting the signinhide to true");
		if(typeof $scope.username == "undefined" ){
			$scope.signInHide = true;
		} else if($scope.username == ""){
			$scope.signInHide = true;
		} else{
			$scope.signInHide = false;
			$scope.showUserName = true;
		}
		
		
	},true);
	
	
	$scope.$watch(function(){
		return userservice.lastLogin;
	}, function (newValue) {
		$scope.lastLogin = newValue;
		console.log($scope.lastLogin);
		console.log("setting the lastLogin");
		if(typeof $scope.lastLogin == "undefined" ){
			$scope.lastLogin = "Logged in first time";
		} else if($scope.lastLogin == ""){
			$scope.lastLogin = "Logged in first time";
		} 
		
		
	},true);
	
	$scope.searchButton = function(){
		userservice.searchValue = $scope.search;
	};
	
	$scope.$watch(function(){
		return parseInt(userservice.badge);
	},function(newValue){
		console.log("newvalue in homecontroller");
		console.log(parseInt(newValue));
		if(!isNaN(newValue)){
			console.log("newvalue in homecontroller");
			console.log(parseInt(newValue));
			$scope.badge = parseInt(newValue);	
		}
		console.log("outside if of homecontroller");
		
	},true);
	
	
}]);
myApp.controller('signInController',['$scope','$http','userservice',function($scope,$http,userservice){

	console.log("in this signInController");
	$scope.email = '';
	$scope.password= '';
	$scope.signin = function(){
	console.log("signin button clicked");
	$http({
		method : "POST",
		url : '/signinRegister',
		data : {
			"email" :$scope.email,
			"password":$scope.password
		}
		}).success(function(data) {
			console.log("passing the data to the service");
			console.log("last login is");
			console.log(data.login);
			//console.log(data.lastLogin);
			//userservice.username = data.login;
			//console.log("userservice name is "+userservice.username);
			window.location.assign("/home#/");
		});
	
};

  
}]);
myApp.controller('registerController',['$scope','$http',function($scope,$http){
	//phone number validation 
	// data from the screen will be in these scope variables
	console.log("inside registerController");
	$scope.email = '';
	$scope.reenter_email = '';
	$scope.password = '';
	$scope.firstName = '';
	$scope.lastName = '';
	$scope.mobilePhone = '';
	// data from the screen will be in these scope variables
	$scope.emailValidation = function(){
		var format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(format.test($scope.email)){
			$scope.emailError = false;
		    }
		    else{
		    	$scope.emailError = true;
		    }
		
	};
	$scope.reenterValidation = function(){
		console.log("email is"+$scope.email);
		console.log("reenter email is"+$scope.reenter_email);
		if($scope.email !== $scope.reenter_email){
			console.log("setting it to false");
			$scope.reenterEmail = true;
		} else {
			$scope.reenterEmail = false;
		}
		
	};
	$scope.phoneValidate = function(){
		var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if(!$scope.mobilePhone.match(phoneno)){
			console.log("this phone number is not valid");
			$scope.phone = true;
	}else{
		$scope.phone = false;
		
	}
	};
	$scope.password = function(){
            $scope.alert = true;    
    };
    $scope.afterPassword = function(){
            $scope.alert = false;
    };
    
    $scope.register = function(){
    	console.log("register button clicked");
    	$http({
 	   		method : "POST",
			url : '/register',
			data : {
				"email" :$scope.email,
				"password":$scope.password,
				"firstName":$scope.firstName
			}
			
 		}).success(function(data) {
 			$scope.registerSuccess = true;
 		});
    	
    };
    	
    $scope.test = function(){
    	console.log("register button clicked");
    	$http({
 	   		method : "POST",
			url : '/test',
			
			
 		}).success(function(data) {
 			
 		});
    	
    	
    };
    	
}]);


myApp.service('userservice',['$http',function($http){
	
	
	this.searchValue = "";
	this.username = "";
	this.itemId = "";
	this.lastLogin="";
	var curr = this;
	this.badge = 0;
	$http.get('/confirm-login')
    .success(function (user) {
    	curr.username = user.id;
    	curr.lastLogin = user.lastLogin;
    });
	
}]);	