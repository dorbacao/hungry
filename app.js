var todo = angular.module('todo',[]).config(function($routeProvider){

	$routeProvider.when('/login',{
		templateUrl:'login.html',
		controller:'LoginController'
	});

	$routeProvider.when('/home',{
		templateUrl:'home.html',
		controller:'HomeController'
	});

	$routeProvider.when('/versao/lista',{
		templateUrl:'ListaVersao.html',
		controller:'VersaoController'
	});

	$routeProvider.when('/versao/nova',{
		templateUrl:'NovaVersao.html',
		controller:'VersaoController'
	});
	
	$routeProvider.when('/versao/nova/sucesso',{
		templateUrl:'Sucesso.html',
		controller:'VersaoController'
	});

	$routeProvider.otherwise({redirectTo:'/login'});

});

todo.factory('socket', function ($rootScope) {
	var socket = io.connect('http://localhost:8080');
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});


todo.controller('VersaoController', function($scope, $location, socket){

	$scope.listaVersao = [];

	socket.on('refreshVersao', function(data){
		$scope.refresh(data);
	})

	$scope.versao = {id:null,labelBotao:'Promover',upTo:true,  titulo:'', descricao:'teste', banco:'',scriptToUp:'',scriptToDown:''};
	
	$scope.refresh = function(listaNova){
		$scope.listaVersao  = listaNova;
	}

	$scope.salvar = function()
	{
		socket.emit('addVersao',$scope.versao);
		$location.path('/versao/nova/sucesso');
	}
	$scope.promover = function(itemVersao)
	{

	}

});

todo.controller('LoginController', function($scope, $location, socket){
	
	$scope.credencial = {login:'', senha:''};

	socket.on('autenticado', function(data){
		
		if(data.sucesso)
		{
			toastr.success(data.mensagem);
			$location.path('/versao/lista');
			//window.location = "http://localhost/index.html#/versao/lista";
		}
		else
			toastr.error(data.mensagem);
		

	});
	
	$scope.logar = function ()
	{
		socket.emit('autenticar', $scope.credencial);
	};
});

todo.controller('HomeController', function($scope, $location){

	$scope.tarefa = {nome:'', data:''};
	$scope.tarefas = [];

	$scope.adicionar = function (){
		var valNome = $scope.tarefa.nome;
		var valData = $scope.tarefa.data;

		$scope.tarefas.push({nome:valNome, data:valData});
	};

	$scope.excluir = function ($index){
		
		$scope.tarefas.splice($index, 1 );
	};
});





