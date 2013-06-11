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

                    function Device(ip, mac, os, device, bw, percent, context, x, y, dim)
                    {
                        var ip = ip;
                        var mac = mac;
                        var os = os;
                        var device = device;
                        var hostname = "toto";
                        var bw = {percent:percent, mega:bw};
                        var img = "/public/img/device/"+device+".svg";
                        var context = context;
                        var x = x + gap.x;
                        var y = y + gap.y;
                        var coeff = {x:55, y:50};
                        var dim = dim;
                        /*this.Draw = function()
                                    {
                                        context.image(img, x, y, 100, 100).scale(dim.x, dim.y).click(function()
                                                                                                    {
                                                                                                        var data = '<table><tr><td><label class="label">IP : </label></td><td>'+ip+'</td></tr><tr><td><label class="label">MAC : </label></td></td><td>'+mac+'</td></tr><tr><td><label class="label">OS : </label></td></td><td>'+os+'</td></tr><tr><td><label class="label">Bande passante : </label></td></td><td> '+bw.percent+'% ('+bw.mega+' mega)</td</tr></table>';
                                                                                                        WriteModal("#option", "#dispopt", data);
                                                                                                    });

                                    };*/
                        this.Draw = function()
                                    {
                                        context.image(img, x, y, 100, 100).scale(dim.x, dim.y).mouseover(function()
                                                                                                    {
                                                                                                        $("#d").html('<table><tr><td><label class="label">IP : </label></td><td>'+ip+'</td></tr><tr><td><label class="label">MAC : </label></td></td><td>'+mac+'</td></tr><tr><td><label class="label">OS : </label></td></td><td>'+os+'</td></tr><tr><td><label class="label">Bande passante : </label></td></td><td> '+bw.percent+'% ('+bw.mega+' mega)</td</tr></table>');
                                                                                                    });

                                    };
                        this.GetX = function()
                                    {
                                        return(x+coeff.x);
                                    };

                        this.GetY = function()
                                        {
                                            return(y+coeff.y);
                                        };

                        this.GetIp = function()
                                        {
                                            return(ip);
                                        };

                        this.GetBw = function()
                                        {
                                            return(bw)
                                        }

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
                                        }
                    }

                    function Map(obj)
                    {
                        var coef = 60;
                        var center = {x: ($("#main").width()/2)-coef, y:($("#main").height()/2)-coef};
                        //var center = {x: ($("#main").width()/2), y:($("#main").height()/2)};
                        var radius = 500+obj.net.length+500*0.25;
                        //var center = {x: (radius/2)-coef, y:(radius/2)-coef};
                        var x = center.x;
                        var y = center.y;
                        var angleRad;
                        var angle = 0;
                        var dist = (360/obj.net.length)+0.5; // coef d'espacement
                        //objnet[0] = new Device(obj.gw, obj.mac, obj.os, obj.device, n, x, y);
                        objnet[0] = new Device(obj.gw, "8c:89:a5:a3:ad:1f", "Linux", "router", 0, 0, n, x/scale.connector, y/scale.connector, {"x":0.6+scale.device, "y":0.6+scale.device});
                        objnet[0].Draw();
                        var router = {x:objnet[0].GetX(), y:objnet[0].GetY()};
                        for(var i = 0; i < obj.net.length; i++)
                        {
                            angleRad = angle/180*Math.PI;
                            x=(((radius/2)+(radius/2)*Math.cos(angleRad))+center.x - radius +340)/scale.connector;
                            y=(((radius/2)+(radius/2)*Math.sin(angleRad))+center.y - radius +340)/scale.connector;
                            objnet[i+1] = new Device(obj.net[i].ip, obj.net[i].mac, obj.net[i].os, "computer", obj.net[i].bw, obj.net[i].percent, n, x, y, {"x":0.4+scale.device, "y":0.4+scale.device});
                            objnet[i+1].Draw();
                            c.path("M"+objnet[i+1].GetX()+" "+objnet[i+1].GetY()+"L"+router.x+" "+router.y).attr({"stroke": "rgb(200, 100, 0)", "stroke-width":5});
                            objnet[i+1].SetBw(objnet[i+1].percent, objnet[i+1].mega);
                            angle += dist;
                        }
                    }

                    function LoadJson(getValue)
                    {
                        $.ajax({
                                            type: 'post',
                                            headers:
                                            {
                                                "X-CSRFToken": csrftoken
                                            },
                                            url: '/getjson/',
                                            timeout: 3000,
                                            success:function(data)
                                                    {
                                                            getValue(JSON.parse(data))
                                                            Map(JSON.parse(data));
                                                    },
                                            error: function()
                                                    {
                                                        alert('La requête n\'a pas abouti');
                                                    }
                                           });
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

                    function ReMake(obj)
                    {
                        $('path').remove();
                        $('image').remove();
                        Map(obj);
                    }

                    //var id;
                    var n = Raphael(document.getElementById('svgDevice'), 900, 600)
                    var c = Raphael(document.getElementById('svgBw'), 900, 600);
                    var csrftoken = GetCookie('csrftoken');
                    var objnet = [];
                    var gap = {x:0, y:0};
                    var mouse = {x:0, y:0, ok:0};
                    var scale = {device:0, connector:1}
                    $('#pop').resizable({animate: true}).draggable();

                    LoadJson(function(network)
                                {

                                    function handle(delta)
                                    {
                                        if (delta < 0)
                                        {
                                            scale.device += 0.1;
                                            scale.connector += 0.25;
                                        }
                                        else
                                        {
                                            scale.device -= 0.1;
                                            scale.connector -= 0.25;
                                        }
                                        ReMake(network)
                                    }

                                    function wheel(event)
                                    {
                                            var delta = 0;
                                            if (!event)
                                                event = window.event;
                                            if (event.wheelDelta)
                                            {
                                                delta = event.wheelDelta/120;
                                            }
                                            else if (event.detail)
                                            {
                                                delta = -event.detail/3;
                                            }

                                            if (delta)
                                                handle(delta);

                                            if (event.preventDefault)
                                                    event.preventDefault();
                                            else
                                                event.returnValue = false;
                                    }

                                    if (window.addEventListener)
                                        window.addEventListener('DOMMouseScroll', wheel, false);
                                    else
                                        window.onmousewheel = document.onmousewheel = wheel;

                                    //console.log(network);
                                    $('svg').on("mousedown", function(event)
                                                            {
                                                                mouse.x = event.clientX;
                                                                mouse.y = event.clientY;
                                                            });
                                    $('svg').on("mouseup", function(event)
                                                            {
                                                                gap.x -= mouse.x - event.clientX;
                                                                gap.y -= mouse.y - event.clientY;
                                                                ReMake(network);
                                                            });

                                    /*$('svg').draggable(
                                                        {
                                                            start: function(event)
                                                                    {
                                                                        //event.preventDefault();
                                                                        console.log("drag start");
                                                                        mouse.x = event.clientX;
                                                                        mouse.y = event.clientY;
                                                                       // $('svg').offset({left : 0, top : 0});
                                                                    },
                                                            drag: function(event)
                                                                    {
                                                                        console.log("drag move");
                                                                        gap.x -= mouse.x - event.clientX;
                                                                        console.log("eventclientX"+event.clientX+" | "+"mouseX"+mouse.x);
                                                                        gap.y -= mouse.y - event.clientY;
                                                                        console.log("eventclientY"+event.clientY+" | "+"mouseY"+mouse.y)
                                                                        console.log("gapX"+gap.x+" gapY"+gap.y);
                                                                        console.log("soustraction  = "+(mouse.x - event.clientX));
                                                                        //event.preventDefault();
                                                                        //$('svg').offset({left : 0, top : 0});
                                                                        ReMake(network);
                                                                    },
                                                            stop: function(event)
                                                                    {
                                                                        console.log("drag end");
                                                                        gap.x -= mouse.x - event.clientX;
                                                                        gap.y -= mouse.y - event.clientY;
                                                                        //$('svg').offset({left : 0, top : 0});
                                                                        ReMake(network);
                                                                    }
                                                        })*/

                                    $(document).on("keydown", function(event)
                                                                {
                                                                    event.keyCode == 38 ? gap.y -= 35 : event.keyCode == 39 ? gap.x -= 35 : event.keyCode == 40 ? gap.y += 35 : event.keyCode == 37 ? gap.x += 35 : gap.x += 0;
                                                                    ReMake(network);
                                                                });
                                    $("#m0").on("click", function()
                                                            {
                                                                gap.y -= 35;
                                                                ReMake(network)
                                                            });
                                    $("#m1").on("click", function()
                                                            {
                                                                gap.x += 35;
                                                                ReMake(network)
                                                            });
                                    $("#m2").on("click", function()
                                                            {
                                                                gap.x -= 35;
                                                                ReMake(network)
                                                            });
                                    $("#m3").on("click", function()
                                                            {
                                                                gap.y += 35;
                                                                ReMake(network)
                                                            });
                                });
                })());

