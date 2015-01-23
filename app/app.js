

var jgModule = angular.module("jgModule", ["ngRoute"]);

jgModule.config(function($routeProvider){
    $routeProvider
        .when("/todo/:title",{ templateUrl:"details.html", controller:"detailcontroller"})
        .when("/",{ templateUrl:"main.html", controller:"maincontroller"})
        .otherwise({redirectTo:"/"});
}); 

jgModule.controller("detailcontroller", function($scope, $http, $routeParams, $location){
    $scope.todo = {};
    $http.get("todo?title=" + $routeParams.title).success(function(data){
        $scope.todo = data[0];
    });
    
    $scope.returnToList = function() {
        $location.path("/"); 
    } ;
    
    $scope.saveTodo = function(){
        $http.post("todo?title=" + $scope.todo.title, $scope.todo).success(function(){
            $scope.returnToList();
        });
    }
});

jgModule.controller("mastercontroller", function ($scope){
    $scope.isAdmin = false;
    $scope.showDone = false;
});

jgModule.controller("maincontroller", function($scope, $http){
    $scope.categories = [];
    $scope.todos = [];
    $scope.newT = {};

    $scope.selectedCat= "-";
    $scope.selectedCatId= "0";
    
    $scope.$watchCollection('categories',
                  function(){
                    console.log("array changed!")},
                  true
           );
    
    $scope.setSelection = function(category){
        $scope.selectedCat = category.name;
        $scope.selectedCatId = category.id;
        $http.get("/todos?catid=" + $scope.selectedCatId, { cache:false }).success(function(data) {
            $scope.todos = data;
        });
    };
        
    $scope.newC = {};
    
    $http.get("/categories", { cache:false }).success(function(data) {
        $scope.categories = data;
    });
    
    $scope.findCategory = function(id){
        for (c in $scope.categories){
            if ($scope.categories[c].id == id) return $scope.categories[c];
        }
        return undefined;
    };
    
     $scope.saveTodo = function(){
        var newTd = angular.copy($scope.newT); 
        $http.post("todos", newTd).success(function(){
            $scope.setSelection($scope.findCategory($scope.newT.categoryId));
            $scope.newT = {};
        });
    }
    $scope.saveCategory =  function($timeout){
        var newCat = angular.copy($scope.newC); 
        $http.post("categories", newCat).success(function(){
                $http.get("/categories", { cache:false }).success(function(data) {
                      $scope.categories = data;
                });
                $scope.newC = {};
        });
    }
});
