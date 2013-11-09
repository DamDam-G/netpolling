(function()
{
    var index = angular.module('index', ['ui.bootstrap']).config(function($interpolateProvider)
                                                            {
                                                                $interpolateProvider.startSymbol("[[").endSymbol("]]");
                                                            });
    index.controller('ModalCtrl', function($scope, $modal)
                                    {
                                        $scope.open = function ()
                                        {
                                            var modalInstance = $modal.open({
                                                templateUrl: '/co/',
                                                controller: function ($scope, $modalInstance)
                                                            {
                                                                  $scope.ok = function ()
                                                                              {
                                                                                $modalInstance.close();
                                                                              };

                                                                  $scope.cancel = function ()
                                                                                  {
                                                                                    $modalInstance.dismiss('cancel');
                                                                                  };
                                                            },
                                                resolve: {}});
                                        };

                                    });
})();
