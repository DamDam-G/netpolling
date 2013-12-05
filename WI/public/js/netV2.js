(function()
{
    var netpolling = angular.module('netpolling', ['ui.bootstrap', 'monospaced.mousewheel']).config(function($interpolateProvider)
                                                                        {
                                                                            $interpolateProvider.startSymbol("[[").endSymbol("]]");
                                                                        });

    netpolling.factory("Share", function(Cookies)
                                {
                                    return {
                                        "csrf":Cookies.GetCookie("csrftoken"),
                                        //"Network":null,
                                        "Network":{"gw": "10.8.97.1", "route": ["10.8.97.1"], "device":"router", "children": [{"ip": "10.8.96.254", "hostname": "", "percent": null, "mac": "00:01:02:f0:da:8b", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.97.1", "hostname": "", "percent": null, "mac": "00:08:02:3f:f2:82", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.96.237", "hostname": "Martin-Portable", "percent": 0.029999999999999999, "mac": "ac:72:89:09:49:b2", "bw": 0.62, "device": "computer", "os": null}, {"ip": "10.8.98.30", "hostname": "Juju", "percent": 3.5299999999999998, "mac": "70:f3:95:e2:c8:13", "bw": 67.790000000000006, "device": "computer", "os": null}, {"ip": "10.8.99.235", "hostname": "Nicolas-PC", "percent": 0.050000000000000003, "mac": "78:92:9c:84:28:6c", "bw": 0.85999999999999999, "device": "computer", "os": null}, {"ip": "10.8.100.143", "hostname": "camille-PC", "percent": 0.02, "mac": "74:2f:68:3c:fc:90", "bw": 0.32000000000000001, "device": "computer", "os": null}, {"ip": "10.8.100.234", "hostname": "android-8555f470746dfa07", "percent": 0.0, "mac": "78:d6:f0:0b:ed:27", "bw": 0.01, "device": "phone", "os": null}, {"ip": "10.8.101.127", "hostname": "iPhone-de-kevin", "percent": 0.0, "mac": "d8:9e:3f:18:db:d0", "bw": 0.01, "device": "apple", "os": null}, {"ip": "10.8.98.159", "hostname": "Martz-PC", "percent": 0.56999999999999995, "mac": "74:2f:68:78:f2:d0", "bw": 10.94, "device": "computer", "os": null}, {"ip": "10.8.102.17", "hostname": "TOSHE", "percent": 0.0, "mac": "74:e5:43:b0:26:66", "bw": 0.02, "device": "computer", "os": null}, {"ip": "10.8.103.109", "hostname": "", "percent": null, "mac": "58:b0:35:35:2b:5a", "bw": null, "device": "apple", "os": null}, {"ip": "10.8.104.61", "hostname": "Mouraghi-PC", "percent": 0.01, "mac": "bc:5f:f4:86:76:ad", "bw": 0.14999999999999999, "device": "computer", "os": null}, {"ip": "10.8.104.56", "hostname": "Raphael-PC", "percent": 0.10000000000000001, "mac": "94:db:c9:b1:da:e9", "bw": 1.97, "device": "computer", "os": null}, {"ip": "10.8.104.90", "hostname": "michuntu", "percent": 0.01, "mac": "8c:a9:82:69:01:32", "bw": 0.11, "device": "computer", "os": null}, {"ip": "10.8.103.68", "hostname": "pwned", "percent": 0.02, "mac": "6c:71:d9:2b:f3:59", "bw": 0.41999999999999998, "device": "computer", "os": null}, {"ip": "10.8.104.190", "hostname": "", "percent": 0.0, "mac": "40:a6:d9:2a:4f:a3", "bw": 0.0, "device": "apple", "os": null}, {"ip": "10.8.104.249", "hostname": "", "percent": 0.0, "mac": "00:19:99:43:2d:19", "bw": 0.059999999999999998, "device": "computer", "os": null}, {"ip": "10.8.105.31", "hostname": "", "percent": 0.0, "mac": "00:08:02:37:be:1d", "bw": 0.0, "device": "computer", "os": null}, {"ip": "10.8.104.27", "hostname": "3LK-LS4Tonio", "percent": 0.0, "mac": "68:5d:43:b7:3b:1c", "bw": 0.02, "device": "computer", "os": null}, {"ip": "10.8.106.7", "hostname": "mineur", "percent": 0.01, "mac": "bc:5f:f4:8b:9a:3d", "bw": 0.11, "device": "computer", "os": null}, {"ip": "10.8.106.50", "hostname": "", "percent": null, "mac": "00:0c:29:19:ce:a9", "bw": null, "device": "vm", "os": null}, {"ip": "10.8.106.116", "hostname": "", "percent": null, "mac": "00:0c:29:aa:cd:c3", "bw": null, "device": "vm", "os": null}, {"ip": "10.8.106.117", "hostname": "", "percent": null, "mac": "00:0c:29:44:a8:8e", "bw": null, "device": "vm", "os": null}, {"ip": "10.8.105.23", "hostname": "Riwan", "percent": 0.050000000000000003, "mac": "74:2f:68:55:e3:70", "bw": 0.91000000000000003, "device": "computer", "os": null}, {"ip": "10.8.108.100", "hostname": "android-c7e0becd82502419", "percent": null, "mac": "20:54:76:f9:a6:41", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.100.107", "hostname": "android-4ade9cdeda53982b", "percent": 0.0, "mac": "20:02:af:38:ca:60", "bw": 0.0, "device": "computer", "os": null}, {"ip": "10.8.109.70", "hostname": "Yopif_port", "percent": 2.3799999999999999, "mac": "c4:85:08:0b:c7:d7", "bw": 45.609999999999999, "device": "computer", "os": null}, {"ip": "10.8.110.95", "hostname": "Brice-pc", "percent": 0.02, "mac": "48:5d:60:c8:1e:10", "bw": 0.40000000000000002, "device": "computer", "os": null}, {"ip": "10.8.110.93", "hostname": "Admin-TOSH", "percent": 3.4900000000000002, "mac": "d0:df:9a:65:e5:ea", "bw": 67.049999999999997, "device": "computer", "os": null}, {"ip": "10.8.108.53", "hostname": "Yopino4life", "percent": 0.01, "mac": "20:10:7a:f9:8d:d6", "bw": 0.10000000000000001, "device": "computer", "os": null}, {"ip": "10.8.108.135", "hostname": "Bessalel-HP-W8", "percent": 0.040000000000000001, "mac": "a0:88:b4:85:ba:84", "bw": 0.84999999999999998, "device": "computer", "os": null}, {"ip": "10.8.111.111", "hostname": "", "percent": null, "mac": "00:24:81:f9:97:32", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.111.112", "hostname": "", "percent": null, "mac": "00:24:81:fe:a3:76", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.111.132", "hostname": "joshua", "percent": 0.01, "mac": "08:3e:8e:03:a5:37", "bw": 0.19, "device": "computer", "os": null}, {"ip": "10.8.111.244", "hostname": "", "percent": null, "mac": "00:16:01:af:48:f8", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.111.245", "hostname": "", "percent": null, "mac": "00:16:01:af:51:cc", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.111.246", "hostname": "", "percent": 0.0, "mac": "c0:8a:de:1d:d8:40", "bw": 0.02, "device": "computer", "os": null}, {"ip": "10.8.111.251", "hostname": "", "percent": 0.01, "mac": "00:08:02:3f:e0:b5", "bw": 0.26000000000000001, "device": "computer", "os": null}, {"ip": "10.8.109.65", "hostname": "ITI1001", "percent": 0.0, "mac": "00:26:82:cd:52:16", "bw": 0.050000000000000003, "device": "computer", "os": null}, {"ip": "10.8.110.44", "hostname": "rOm-Portable", "percent": null, "mac": "00:1b:b1:28:cc:55", "bw": null, "device": "computer", "os": null}, {"ip": "10.8.98.78", "hostname": "android-ad3df5d31d8c056d", "percent": 0.0, "mac": "38:aa:3c:d5:da:83", "bw": 0.029999999999999999, "device": "phone", "os": null}, {"ip": "10.8.111.252", "hostname": "", "percent": null, "mac": "00:1b:b1:28:cc:55", "bw": null, "device": "computer", "os": null}]},
                                        "BW":{
                                            "color":"",
                                            "width":0,
                                            "tbw":0,
                                            "pbw":0
                                        },
                                        "Hosts":[],
                                        "Info":{
                                            "cls":"",
                                            "why":""
                                        },
                                        "Param":{},
                                        "CurrentDevice":{
                                            "hostname":"",
                                            "ip":"",
                                            "mac":"",
                                            "bw":{"value":0, "percent":0}
                                        },
                                        "Available":{"os":0, "sniff":0},
                                        "InfoViz":{
                                            "Diameter":800,
                                            "Translate":{x:400,y:400}
                                        },
                                        "DnD":{
                                            "drag":0,
                                            "currentPos":{"x":null, "y":null}
                                        }
                                    };
                                });

    netpolling.factory("Cookies", function()
                                    {
                                        return {
                                            "GetCookie": function (sName)
                                                        {
                                                            var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
                                                            if (oRegex.test(document.cookie))
                                                                return decodeURIComponent(RegExp["$1"]);
                                                            else
                                                                return null;
                                                        }
                                        };
                                    });

    netpolling.factory('Ajax', function($http, Modal, Share)
                                {
                                    return {
                                        "Control": function(id)
                                                {
                                                    $http({
                                                        url:'/control/',
                                                        method:"POST",
                                                        headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Share.csrf, "X-Requested-With":"XMLHttpRequest"},
                                                        data:{"id":id}
                                                    }).success(function(data)
                                                                {
                                                                    Modal.Modal(data, id);
                                                                }).error(function()
                                                                        {
                                                                            alert("fail")
                                                                        });
                                                },
                                        "GetJson":function(url, getValue)
                                                    {
                                                        $http({
                                                            url:url,
                                                            method:"POST",
                                                            headers:{"Content-Type":"application/X-WWW-form-urlencoded", "X-CSRFToken": Share.csrf, "X-Requested-With":"XMLHttpRequest"}
                                                        }).success(function(data)
                                                                    {
                                                                        //Share.Network = data;
                                                                        getValue(data);
                                                                    }).error(function()
                                                                            {
                                                                                alert("fail")
                                                                            });
                                                    }
                                    };
                                });

    netpolling.factory("Redirect", function()
                                    {
                                        return {
                                            "Visu": function()
                                                    {
                                                         window.open("/visu/");
                                                    }
                                        };
                                    });

    netpolling.factory("Modal", function($modal)
                                {
                                    return {
                                        "Modal":function(data, id)
                                                {
                                                    $modal.open({
                                                        templateUrl: '/modal/'+id,
                                                        controller: function ($scope, $modalInstance)
                                                                    {
                                                                        //console.log(data);

                                                                        $scope.oneAtATime = true;
                                                                        $scope.content = data;
                                                                        $scope.ok = function ()
                                                                                    {
                                                                                        $modalInstance.close();
                                                                                    };

                                                                        $scope.cancel = function ()
                                                                                        {
                                                                                            $modalInstance.dismiss('cancel');
                                                                                        };
                                                                    }});
                                                }
                                    };
                                });

    netpolling.factory("RootCtrl", function(Ajax, Redirect)
                                    {
                                        return {
                                            "ViewCtrl":function(id)
                                                        {
                                                            if(id >= 0 && id <= 1 || id >= 3 && id <= 6)
                                                            {
                                                                Ajax.Control(id);
                                                            }
                                                            else if (id == 2)
                                                            {
                                                                Redirect.Visu();
                                                            }
                                                            else
                                                            {
                                                                alert("ID pb")
                                                            }
                                                        }
                                        };
                                    });

    netpolling.factory("Constructor", function(Share, Ajax)
                                        {
                                            return {
                                                "Device":  function(ip, mac, os, device, name, bandwidth, percent, context, x, y, dim)
                                                            {
                                                                var ip = ip;
                                                                var mac = mac;
                                                                var os = os;
                                                                var device = device;
                                                                var hostname = name;
                                                                var bw = {p:percent, b:bandwidth};
                                                                var img = "/public/img/device/"+device+".svg";
                                                                var context = context;
                                                                var x = x + Share.Param.GetGapX();
                                                                var y = y + Share.Param.GetGapY();
                                                                var coeff = {x:55, y:50};
                                                                var dim = dim;

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name Draw
                                                                 * @brief This is a method for drawing a device and attach events
                                                                 */

                                                                this.Draw = function()
                                                                            {
                                                                                /*context.image(img, x, y, 100, 100).scale(dim.x, dim.y).mouseover(function()
                                                                                                                                            {
                                                                                                                                                console.log("test")
                                                                                                                                                Share.CurrentDevice.hostname = hostname;
                                                                                                                                                Share.CurrentDevice.ip = ip;
                                                                                                                                                Share.CurrentDevice.mac = mac;
                                                                                                                                                Share.CurrentDevice.bw = bw;
                                                                                                                                            }).drag(function(){return(false);});/**/
                                                                                /**/context.image(img, x, y, 100, 100).scale(dim.x, dim.y).drag(function(){return(false);});/**/

                                                                            };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name GetX
                                                                 * @brief This is a getter
                                                                 * @returns {number}
                                                                 */

                                                                this.GetX = function()
                                                                            {
                                                                                return(x+coeff.x);
                                                                            };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name GetY
                                                                 * @brief This is a getter
                                                                 * @returns {number}
                                                                 */

                                                                this.GetY = function()
                                                                                {
                                                                                    return(y+coeff.y);
                                                                                };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name GetIp
                                                                 * @brief This is a getter
                                                                 * @returns {*}
                                                                 */

                                                                this.GetIp = function()
                                                                                {
                                                                                    return(ip);
                                                                                };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name GetBw
                                                                 * @brief This is a getter
                                                                 * @returns {{p: *, b: *}}
                                                                 */

                                                                this.GetBw = function()
                                                                                {
                                                                                    return(bw);
                                                                                };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name GetBw
                                                                 * @brief This is a getter
                                                                 * @returns {{p: *, b: *}}
                                                                 */

                                                                this.GetHostname = function()
                                                                                {
                                                                                    return(hostname);
                                                                                };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name SetBw
                                                                 * @brief This is a setter
                                                                 * @param percent
                                                                 * @param mega
                                                                 */

                                                                this.SetBw = function(percent, mega)
                                                                                {
                                                                                    /*if((parseFloat(percent) && percent > 0.0) && (parseFloat(mega) && mega > 0.0))
                                                                                    {*/
                                                                                        bw.percent = percent;
                                                                                        bw.mega = mega;
                                                                                       /* return 0
                                                                                    }
                                                                                    else
                                                                                        return 1*/
                                                                                };

                                                                /**
                                                                 * @author Damien Goldenberg
                                                                 * @name SetMac
                                                                 * @brief This is a setter
                                                                 * @param amac
                                                                 */

                                                                this.SetMac = function(amac)
                                                                                {
                                                                                    mac = amac;
                                                                                };
                                                            },
                                                "Parameters": function()
                                                                {
                                                                    var gap = {x:0, y:0}; // object to know the gap of all items
                                                                    var mouse = {x:0, y:0}; // object to know the currently position ofthe mouse for events mousedown and mouseup
                                                                    var scale = {device:0, connector:1}; //object for scaling all items
                                                                    var move = 17;
                                                                    var zdevice = 0.1;
                                                                    var zconnector = 0.25;
                                                                    var zoom = 1;
                                                                    var czoom = 0.1;

                                                                    this.Init = function()
                                                                                {
                                                                                    Ajax.GetJson("/param/", function(data)
                                                                                                            {
                                                                                                                Share.Info.cls = data.success == 1? 'success' : 'danger';
                                                                                                                Share.Info.why = data.why;
                                                                                                                obj = data.obj;
                                                                                                            });
                                                                                };

                                                                    Hydrate = function(obj)
                                                                                    {
                                                                                        move = parseFloat(obj.move);
                                                                                        zdevice = parseFloat(obj.zoomd);
                                                                                        zconnector = parseFloat(obj.zooml);
                                                                                    };

                                                                    this.UpdateParam = function(obj)
                                                                                        {
                                                                                            Hydrate(obj);
                                                                                        };

                                                                    this.Reset = function()
                                                                                {
                                                                                    gap.x = 0;
                                                                                    gap.y = 0;
                                                                                    zoom = 1;
                                                                                };

                                                                    this.GetGapX = function()
                                                                                    {
                                                                                        return(gap.x);
                                                                                    };

                                                                    this.GetGapY = function()
                                                                                    {
                                                                                        return(gap.y);
                                                                                    };

                                                                    this.SetGapX = function(s)
                                                                                    {
                                                                                        s == 0 ? gap.x -= move : gap.x += move;
                                                                                    };

                                                                    this.SetGapY = function(s)
                                                                                    {
                                                                                        s == 0 ? gap.y -= move : gap.y += move;
                                                                                    };

                                                                    this.UpdateGap = function(obj)
                                                                                    {
                                                                                        gap.x += obj.x;
                                                                                        gap.y += obj.y;
                                                                                    };

                                                                    this.GetMouseX = function()
                                                                                    {
                                                                                        return(mouse.x);
                                                                                    };

                                                                    this.GetMouseY = function()
                                                                                    {
                                                                                        return(mouse.y);
                                                                                    };

                                                                    this.SetMouseX = function(v)
                                                                                    {
                                                                                        mouse.x = parseFloat(v);
                                                                                    };

                                                                    this.SetMouseY = function(v)
                                                                                    {
                                                                                        mouse.y = parseFloat(v);
                                                                                    };

                                                                    this.GetMove = function()
                                                                                    {
                                                                                        return(move);
                                                                                    };

                                                                    this.SetMove = function(v)
                                                                                    {
                                                                                        move = parseInt(y);
                                                                                    };

                                                                    this.GetScaleDevice = function()
                                                                                    {
                                                                                        return(scale.device);
                                                                                    };

                                                                    this.GetScaleConnector = function()
                                                                                    {
                                                                                        return(scale.connector);
                                                                                    };

                                                                    this.SetScaleDevice = function(s)
                                                                                    {
                                                                                        s == 0 ? scale.device -= zdevice : scale.device += zdevice;
                                                                                    };

                                                                    this.SetScaleConnector = function(s)
                                                                                    {
                                                                                         s == 0 ? scale.connector -= zconnector : scale.connector += zconnector;
                                                                                    };

                                                                    this.GetZoom = function()
                                                                                        {
                                                                                            return(zoom);
                                                                                        };
                                                                    this.SetZoom = function(s)
                                                                                        {
                                                                                            s == 0 ? zoom -= czoom : zoom += czoom;
                                                                                        };
                                                                }
                                            };
                                        });

    netpolling.factory("Spy", function(Share)
                                {
                                    return {
                                        "OSFingerPrinting": function()
                                                            {

                                                            },
                                        "Sniff": function()
                                                    {

                                                    }
                                    };
                                    $("#dos").on("click", function()
                                    {
                                        if (available.os == 0)
                                        {
                                            available.os = 1;
                                            $("#inf").html("<div class=\"container alert alert-info\">L'os finger printing est lancée. Cette action peut prendre un certain temps</div>")
                                            $("#os").html();
                                            $.ajax({
                                                type: 'post',
                                                headers:
                                                {
                                                    "X-CSRFToken": csrftoken
                                                },
                                                data:
                                                {
                                                    ip:$("#aip").html()
                                                },
                                                url: '/os/',
                                                success:function(data)
                                                {
                                                    d = JSON.parse(data)
                                                    $("#os").html(d.rep);
                                                    available.os = 0;
                                                    if(d.success = 1)
                                                        $("#inf").html("<div class=\"container alert alert-info\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La fonctionnalité d'os finger printing est à nouveau disponible</div>")
                                                    else
                                                        $("#inf").html("<div class=\"container alert alert-warning\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>Un problème est survenu ... <br />Mais la fonctionnalité d'os finger printing est à nouveau disponible</div>")
                                                },
                                                error: function()
                                                {
                                                    alert('La requête n\'a pas abouti');
                                                    available.os = 0;
                                                }
                                            })
                                        }
                                        else
                                        {
                                            $("#inf").html("<div class=\"container alert alert-error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>La fonctionnalité d'os finger printing n'est pas encore disponible</div>")
                                        }
                                    });
                                });

    netpolling.factory("LoadData", function(Ajax, Share, $rootScope)
                                    {
                                        return {
                                            "JSON": function(url)
                                                    {
                                                       /* window.setInterval(pwned = function()
                                                                        {*/
                                                                            Ajax.GetJson(url, function(network)
                                                                                                        {
                                                                                                            Share.Network = network;
                                                                                                            $rootScope.$broadcast("networkReady");
                                                                                                            tbw = 0;
                                                                                                            pbw = 0;
                                                                                                            for(var w = 0; w < Share.Network.children.length; w++)
                                                                                                            {
                                                                                                                if (Share.Network.children[w].children)
                                                                                                                    console.log("okidoki");
                                                                                                                if (Share.Network.children[w].bw != null && Share.Network.children[w].percent != null)
                                                                                                                {
                                                                                                                    tbw += Share.Network.children[w].bw*8;
                                                                                                                    pbw += Share.Network.children[w].percent;
                                                                                                                }
                                                                                                            }
                                                                                                            Share.BW.color = pbw < 25 ? "green" : pbw < 50 ? "yellow" : pbw < 75 ? "orange" : "red";
                                                                                                            Share.BW.width = pbw*3.5;
                                                                                                            Share.BW.tbw = tbw.toFixed(2);
                                                                                                            Share.BW.pbw = pbw.toFixed(2);
                                                                                                        })
                                                                        //}, 30000);
                                                        //pwned();
                                                    }
                                           };
                                        });

    netpolling.factory("MapEdit", function(Share, $rootScope)
                                    {
                                        return {
                                            "Move":function(value)
                                                    {
                                                        value == "x+" ? Share.Param.SetGapX(1) : value == "x-" ? Share.Param.SetGapX(0) : value == "y+" ? Share.Param.SetGapY(0) : Share.Param.SetGapY(1);
                                                        $rootScope.$broadcast("mapMove");
                                                    },
                                            "Zoom":function(value)
                                                    {
                                                        value == "+" ? Share.Param.SetZoom(1)  : Share.Param.SetZoom(0);
                                                        $rootScope.$broadcast("mapZoom");
                                                    },
                                            "ZoomWheel":function($event, $delta, $deltaX, $deltaY)
                                                        {
                                                            console.log("inc zoomwheel");
                                                            console.log($delta);
                                                            console.log($deltaX);
                                                            console.log($deltaY);
                                                            $delta > 0 ? Share.Param.SetZoom(1)  : Share.Param.SetZoom(0);
                                                            $rootScope.$broadcast("mapZoom");
                                                        },
                                            "DragStart": function($event)
                                                            {
                                                                Share.DnD.drag = 1;
                                                                Share.DnD.currentPos = {"x":$event.clientX, "y":$event.clientY};
                                                            },
                                            "Drag": function($event)
                                                    {
                                                        Share.DnD.drag == 1 ? function(){ Share.Param.UpdateGap({"x":($event.clientX-Share.DnD.currentPos.x)/20,"y":($event.clientY-Share.DnD.currentPos.y)/20}); $rootScope.$broadcast("mapMove"); }() : {};
                                                    },
                                            "Drop": function($event)
                                                    {
                                                        Share.DnD.drag = 0;
                                                        Share.DnD.currentPos = {"x":null, "y":null};
                                                    },
                                            "Reset": function()
                                                        {
                                                            Share.Param.Reset();
                                                            $rootScope.$broadcast("mapZoom");
                                                            $rootScope.$broadcast("mapMove");
                                                        }
                                        };
                                    });

    netpolling.directive('nMap', ['Share', 'Constructor', function(Share, Constructor)
                                        {
                                            return{
                                                restrict: "E",
                                                template:'<div id="map" class="DesignCanvas" msd-wheel="mousezoom($event, $delta, $deltaX, $deltaY)" ng-mousedown="dragstart($event)" ng-mousemove="drag($event)" ng-mouseup="drop($event)"></div>',
                                                replace: true,
                                                transclude: false,
                                                /*controller: ['Share', '$scope', function(Share, $scope)
                                                                                {
                                                                                    $scope.network = Share.Network;
                                                                                    $scope.draw = Share.InfoViz;
                                                                                }],
                                                scope: {
                                                  device: "="
                                                },*/
                                                link: function ($scope)
                                                        {
                                                            /*$scope.$on('networkReady', function($scope, $rootScope)
                                                                                        {*/
                                                            var tree = d3.layout.tree()
                                                                .size([360, Share.InfoViz.Diameter/ 2])
                                                                .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
                                                            var diagonal = d3.svg.diagonal.radial()
                                                                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
                                                            var svg = d3.select("#map").append("svg")
                                                                .attr("width", 900)
                                                                .attr("height", 600)
                                                                .attr("transform", "scale("+Share.Param.GetZoom()+")")
                                                                .append("g")
                                                                //.attr("transform", "translate(400,400)");
                                                                //.attr("transform", "translate("+((diameter/2)+Share.Param.GetGapX())+","+((diameter/2)+Share.Param.GetGapX()-150)+")");
                                                                .attr("transform", "translate("+((400)+Share.Param.GetGapX())+","+((400)+Share.Param.GetGapX()-150)+")");
                                                                //.attr("transform", "translate("+((Share.InfoViz.Diameter/2)+Share.Param.GetGapX())+","+((Share.InfoViz.Diameter/2)+Share.Param.GetGapX()-150)+")");
                                                            //scope.$watch('network', function()
                                                            $scope.$on("mapZoom", function()
                                                                                    {
                                                                                        d3.select("svg").attr("transform", "scale("+Share.Param.GetZoom()+")")
                                                                                    });
                                                            $scope.$on("mapMove", function()
                                                                                    {
                                                                                        d3.select("#map>svg>g").attr("transform", "translate("+((400)+Share.Param.GetGapX())+","+((400)+Share.Param.GetGapY()-150)+")");
                                                                                    });
                                                            $scope.$on('networkReady', function($scope, $rootScope)
                                                                                        {
                                                                                            //var nodes = tree.nodes(Share.Network);
                                                                                            var nodes = tree.nodes(Share.Network);
                                                                                            var links = tree.links(nodes);
                                                                                            var link = svg.selectAll(".link")
                                                                                                .data(links)
                                                                                                .enter().append("path")
                                                                                                .attr("class", "link")
                                                                                                .attr("d", diagonal)
                                                                                                .attr("stroke", function(d)
                                                                                                                {
                                                                                                                    return d.target.percent == null ? "rgb(0, 0, 255)" : d.target.percent < 1 ? "rgb(0, 252, 0)" : d.target.percent < 2 ? "rgb(36, 216, 0)" : d.target.percent < 5 ? "rgb(72, 180, 0)" : d.target.percent < 10 ? "rgb(108, 144, 0)" : d.target.percent < 20 ? "rgb(144, 108, 0)" : d.target.percent < 50 ? "rgb(180, 72, 0)" : d.target.percent < 70 ? "rgb(216, 36, 0)" : "rgb(252, 0, 0)";
                                                                                                                });
                                                                                            var node = svg.selectAll(".node")
                                                                                                .data(nodes)
                                                                                                .enter().append("g")
                                                                                                .attr("class", "node")
                                                                                                //.attr("transform", function(d) {return d.y == 0 ? "translate(-20,-25)" : "rotate(" + (d.x - 90) + ")translate(" + (d.y -25) + ")"; })
                                                                                                .attr("transform", function(d)
                                                                                                                    {
                                                                                                                        Share.Hosts.push({"hostname": d.hostname, "ip": d.ip, "id":"Device"+ d.depth});
                                                                                                                        $scope.targetScope.$broadcast("UpdateListDevice");
                                                                                                                        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                                                                                                                    });
                                                                                                //.attr("transform", function(d) {return "rotate(" + (d.x - 90) + ")translate(" + (d.y-25) + ")"; })

                                                                                            node.append("circle")
                                                                                                .attr("r", 4.5)
                                                                                                .attr("fill", function(d)
                                                                                                                {
                                                                                                                    return d.device == "apple" ? "red" : d.device == "vm" ? "blue" : d.device == "computer" ? "grey" : d.device == "router" ? "green" : d.device == "phone" ? "orange" : "yellow"
                                                                                                                })
                                                                                                .attr("stroke", "black")
                                                                                                .attr("stroke-width", "1.5px")
                                                                                                .on("mouseover", function(d)
                                                                                                                    {
                                                                                                                        Share.CurrentDevice = {"hostname":d.hostname, "ip":d.ip, "mac":d.mac, "bw":{"value":d.bw, "percent": d.percent}, "img": d.device};
                                                                                                                        $scope.targetScope.$broadcast("UpdateDevice");
                                                                                                                    })

                                                                                            /*node.append("circle")
                                                                                                .attr("r", 10)
                                                                                                .attr("fill", "red")
                                                                                                .attr("stroke", "black")
                                                                                                .attr("stroke-width", "1.5px");*/
                                                                                        });
                                                        }
                                            };
                                        }]);

    netpolling.controller('MenuCtrl', function($scope,RootCtrl)
                                        {
                                            $scope.call = RootCtrl.ViewCtrl;
                                        });

    netpolling.controller('MapCtrl', function($scope, LoadData, Share, Constructor, MapEdit)
                                        {
                                            Share.Param = new Constructor.Parameters();
                                            Share.Param.Init();
                                            LoadData.JSON("/getjson/");
                                            $scope.bw = Share.BW;
                                            $scope.info = Share.Info;
                                            $scope.device = Share.CurrentDevice;
                                            $scope.$on('UpdateDevice', function()
                                                                        {
                                                                            $scope.$apply(function()
                                                                                            {
                                                                                                $scope.device = Share.CurrentDevice;
                                                                                            });
                                                                        }, true);
                                            $scope.$on('UpdateListDevice', function()
                                                                        {
                                                                            $scope.$apply(function()
                                                                                            {
                                                                                                $scope.listdevice = Share.Hosts;
                                                                                            });
                                                                        }, true);
                                            $scope.draw = Share.InfoViz;
                                            $scope.move = MapEdit.Move;
                                            $scope.zoom = MapEdit.Zoom;
                                            $scope.dragstart = MapEdit.DragStart;
                                            $scope.drag = MapEdit.Drag;
                                            $scope.drop = MapEdit.Drop;
                                            $scope.reset = MapEdit.Reset;
                                            $scope.mousezoom = MapEdit.ZoomWheel;
                                        });
})();