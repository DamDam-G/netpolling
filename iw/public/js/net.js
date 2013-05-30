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

                    function Bw(obj)
                    {
                    }

                    function rand(min, max)
                    {
                        return Math.floor(Math.random() * (max - min + 1) + min);
                    }

                    function Device(img, context, x, y)
                    {
                        this.img = "/public/img/device/"+img+".svg";
                        this.context = context;
                        this.x = x;
                        this.y = y;
                        this.draw = function()
                                    {
                                        this.context.image(this.img, this.x, this.y, 100, 100).scale(0.5, 0.5).click(function(){ $("#option").modal("show"); });
                                    }
                    }

                    function Map(obj)
                    {
                        var n = Raphael(300, 300, $(window).width(), $(window).height());
                        var center = {x: $(window).height(), y:$(window).width()/4};
                        var radius = 200;
                        var pi = Math.PI
                        /*var x = center.x + radius;
                        var y = center.y - radius/2;*/
                        var x = 50;
                        var y = 50;
                        for(var i = 0; i < obj.net.length; i++)
                        {
                            x = (Math.cos(2 * i * pi / obj.net.length))*radius;
                        	y = Math.sin(2 * i * pi / obj.net.length)*radius;
                            t = new Device("computer", n, x, y);
                            t.draw();

                            //var c = n.image("/public/img/device/computer.svg", 50+i*50, 50+i*50, 80, 80).click(function(){ $("#option").modal("show"); });
                            /*var img = new Image()
                            img.src = "/public/img/computer.png"
                            img.onload= function()
                                        {
                                            jc.start("#cartoDevice");
                                            jc.image(img,100,100);
                                            //jc.start(idCanvas);
                                        };*/

                           /* var canvas = new fabric.Canvas('cartoDevice');
                            //canvas.className = "DesignCanvas";
                            var img = new Image()
                            img.src = "/public/img/computer.png"
                            var imgInstance = new fabric.Image(img, {
                              left: 50+(i*20),
                              top: 50+(i*20)
                            });
                            canvas.add(imgInstance);*/
                            /*$("canvas").drawPolygon({
                                layer: true,
                                fillStyle: "#c33",
                                x: 50+(i*60), y: 50+(i*60),
                                radius: 60,
                                sides: 6,
                                projection: -0.5,
                                click: function()
                                        {
                                            console.log("a");
                                        }
                              });/*
                            $("#cartoDevice").drawImage({
                                                    layer:true,
                                                    //source: "/public/img/computer.png",
                                                    source: "/public/img/test.svg",
                                                    scale:0.5,
                                                    x: 50+(i*100),
                                                    y: 50+(i*100),
                                                    click: function(layer)
                                                            {
                                                                console.log("a");
                                                                //$("#option").modal("show");
                                                            }
                                                });*/

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
                                            url: id == 0? '/getscan/' : '/getbw/',
                                            timeout: 3000,
                                            success:function(data)
                                                    {
                                                        if(id == 0)
                                                        {
                                                            Map(JSON.parse(data));
                                                        }
                                                        else
                                                        {
                                                            Bw(JSON.parse(data));
                                                        }
                                                    },
                                            error: function()
                                                    {
                                                        alert('La requête n\'a pas abouti');
                                                    }
                                           });
                        return json
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
                                                                   $("#dispopt").html(data);
                                                                   $("#option").modal("show");
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
                    var csrftoken = GetCookie('csrftoken');
                    var network = LoadJson(0);
                    //var bw = LoadJson(1);
                    //console.log("global = "+network)
                    //$('canvas').attr("width", $(window).width()*0.75);
                    $('svg').attr("style", "border:solid #000000 2px;");
                })());

