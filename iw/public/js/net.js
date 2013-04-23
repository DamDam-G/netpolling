$(window).load((function()
                {
                    function getCookie(name)
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

                    $("a.menu").on("click", function()
                                               {
                                                   var id = this.id
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
                                                           if (id == 0)
                                                           {
                                                               //$(".collapse").collapse({toggle:true});
                                                           }

                                                       },
                                                       error: function()
                                                       {
                                                           alert('La requête n\'a pas abouti');
                                                       }
                                                   })
                                               });

                    var csrftoken = getCookie('csrftoken');
                })());

