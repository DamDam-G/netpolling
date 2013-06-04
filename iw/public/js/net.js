$(window).load((function()
                {
                    /**
                     * @author Damien Goldenberg
                     * @brief This function get the cookie specified in the in the input variable
                     * @param name
                     * @returns {null}
                     * @constructor
                     */
                    function GetCookie(name)
                    {
                        var cookieValue = null;
                        if (document.cookie && document.cookie != '')
                        {
                            var cookies = document.cookie.split(';');
                            for (var i = 0; i < cookies.length; i++)
                            {
                                var cookie = jQuery.trim(cookies[i]);
                                if (cookie.substring(0, name.length + 1) == (name + '='))
                                {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    }

                    function WriteModal(idModal, idDisplay, data)
                    {
                        $(idDisplay).html(data);
                        $(idModal).modal("show");
                    }

                    function Form(e)
                    {
                        e.preventDefault();
                        $.ajax({
                            type: 'post',
                            headers:
                                {
                                  "X-CSRFToken": csrftoken
                                },
                                data:$(this).serialize(),
                                url: '/ajaxform/'+id+'/',
                                timeout: 3000,
                                success:function(data)
                                        {
                                            data = JSON.parse(data)
                                            if (data.success == 1)
                                                cls = 'success';
                                            else if (data.success == 0)
                                                cls = 'danger';
                                            $("#info").html('<div class="alert alert-' +cls+ '"><button type="button" class="close" data-dismiss="alert">×</button>' +data.why+ '</div>');
                                        },
                                error:function()
                                      {
                                            $("#info").html('<div class="alert alert-warning"><button type="button" class="close" data-dismiss="alert">×</button>La requête n\'a pas pu aboutir</div>');
                                      }
                                });
                    }

                    function Device(ip, mac, os, device, context, x, y)
                    {
                        var ip = ip;
                        var mac = mac;
                        var os = os;
                        var device = device;
                        var hostname = "toto";
                        var img = "/public/img/device/"+device+".svg";
                        context = context;
                        var x = x;
                        var y = y;
                        var coeff = {x:55, y:50};
                        this.draw = function()
                                    {
                                        context.image(img, x, y, 100, 100).scale(0.5, 0.5).click(function()
                                                                                                                        {
                                                                                                                            var data = '<table><tr><td><label class="label">IP : </label></td><td>'+ip+'</td></tr><tr><td><label class="label">MAC : </label></td></td><td>'+mac+'</td></tr><tr><td><label class="label">OS : </label></td></td><td>'+os+'</td></tr></table>';
                                                                                                                            WriteModal("#option", "#dispopt", data);
                                                                                                                        });
                                    };
                        this.GetX = function()
                                    {
                                        return(x+coeff.x);
                                    };
                        this.GetY = function()
                                        {
                                            return(y+coeff.y);
                                        }
                        this.GetIp = function()
                                        {
                                            return(ip);
                                        }
                    }

                    function Map(obj)
                    {
                        var coef = 70;
                        var center = {x: ($("#main").width()/2)-coef, y:($("#main").height()/2)-coef};
                        var radius = 400;
                        var x = center.x;
                        var y = center.y;
                        var angleRad;
                        var angle = 0;
                        var dist = 360/obj.net.length;
                        //objnet[0] = new Device(obj.gw, obj.mac, obj.os, obj.device, n, x, y);
                        objnet[0] = new Device(obj.gw, "8c:89:a5:a3:ad:1f", "Linux", "router", n, x, y);
                        objnet[0].draw();
                        for(var i = 0; i < obj.net.length; i++)
                        {
                            angleRad = angle/180*Math.PI;
                            x=((radius/2)+(radius/2)*Math.cos(angleRad))+center.x - radius +180;
                            y=((radius/2)+(radius/2)*Math.sin(angleRad))+center.y - radius +180;
                            //objnet[i] = new Device(obj.net[i].ip, obj.net[i].mac, obj.net[i].os, obj.net[i].device, n, x, y);
                            objnet[i+1] = new Device(obj.net[i].ip, obj.net[i].mac, obj.net[i].os, "computer", n, x, y);
                            objnet[i+1].draw();
                            angle += dist;
                        }
                    }

                    function Connector(obj)
                    {
                        var x;
                        var y;
                        var router = {x:objnet[0].GetX(), y:objnet[0].GetY()};
                        for (var i = 0; i < obj.length; i++)
                        {
                            for (var j = 1; j < objnet.length; j++)
                            {
                                if(obj[i].ip == objnet[j].GetIp())
                                {
                                    x = objnet[j].GetX();
                                    y = objnet[j].GetY();
                                    break;
                                }
                            }
                            c.path("M"+x+" "+y+"L"+router.x+" "+router.y).attr({stroke: "rgb(200, 100, 0)", "stroke-width":5});//.animate(Raphael.animation({cx: 10, cy: 20}, 2e3));
                        }
                    }

                    function LoadJson(id)
                    {
                        var json = $.ajax({
                                            type: 'post',
                                            headers:
                                            {
                                                "X-CSRFToken": csrftoken
                                            },
                                            url: '/getjson/'+id,
                                            timeout: 3000,
                                            success:function(data)
                                                    {
                                                        if(id == 0)
                                                        {
                                                            Map(JSON.parse(data));
                                                        }
                                                        else
                                                        {
                                                            Connector(JSON.parse(data));
                                                        }
                                                    },
                                            error: function()
                                                    {
                                                        alert('La requête n\'a pas abouti');
                                                    }
                                           });
                        return(json)
                    }

                    $("a.menu").on("click", function()
                                               {
                                                   id = this.id
                                                   $.ajax({
                                                       type: 'post',
                                                       headers:
                                                        {
                                                            "X-CSRFToken": csrftoken
                                                        },
                                                       data:
                                                        {
                                                           id:this.id
                                                        },
                                                       url: '/control/',
                                                       timeout: 3000,
                                                       success:function(data)
                                                               {
                                                                   WriteModal("#option", "#dispopt", data);
                                                                   if (id == 0 || id == 1 || id == 2 || id == 4)
                                                                   {
                                                                       $("#form0").on("submit", Form);
                                                                       if(id == 0 || id== 4)
                                                                       {
                                                                           $("#form1").on("submit", Form);
                                                                       }
                                                                   }

                                                               },
                                                       error: function()
                                                               {
                                                                   alert('La requête n\'a pas abouti');
                                                               }
                                                   })
                                               });

                    $(window).on("resize", function()
                                            {
                                                //$('canvas').attr("width", $(window).width()*0.75);
                                            });
                    /*$("#cartoConnector").attr('position', 'relative')
                    $("#cartoConnector").attr('top', $("#cartoDevice").offset().top)
                    $("#cartoConnector").attr('left', $("#cartoDevice").offset().left)*/
                    var id;
                    var n = Raphael(document.getElementById('svgDevice'), 900, 600);
                    var c = Raphael(document.getElementById('svgBw'), 900, 600);
                    var csrftoken = GetCookie('csrftoken');
                    var network = LoadJson(0);
                    var bw = LoadJson(1);
                    var objnet = [];
                    //var bw = LoadJson(1);
                    //console.log("global = "+network)
                    //$('canvas').attr("width", $(window).width()*0.75);
                    $('svg').attr("style", "border:solid #000000 2px;");
                })());

