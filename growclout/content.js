$(document).ready(function() {

  const backend_api_key = "xxxx"
  const imgur_client_id = "xxxxx"
  const backend_base_api = "https://growclout.deta.dev/"
  const get_users_api = backend_base_api + "users/"
  const appName = "GrowClout";
  var key = "";

  function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
            return;
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  }

  function get_requestor(){
    var requestor = document.getElementsByClassName("change-account-selector__ellipsis-restriction")[0].innerText;
    return requestor.toLowerCase();
  }

  function get_user(){
    var pathname = window.location.pathname;
    return (pathname.slice(3)).toLowerCase();
  }

  function insertAnalyticsSideBar() {

    if (window.top != window.self) { return; }
    createPanel("Any URL", "Title")
  }

  function toggleElement(elemName) {
    var element = $(elemName);
    if (element.style.display == 'none') {
      element.style.display = 'block';
      return;
    }
    element.style.display = 'none';
  }

  function createPanel(url, title) {
    if ($(".embed").length > 0) { return; } // avoid situations where multiple results might be triggered.

    var tabTitle = appName;

    var embed = $("<div />").attr({'id' : 'embed'});
    var login = $("<div />").attr({'id' : 'login'});
    var login_site = $("<div />").attr({'id' : 'login_site'});

    var site = $("<div />").attr({'id' : 'site'});

    var tab = $("<div/>").attr({'id' : 'tab'});
    var logo = $("<div/>").attr({'id' : 'logo'});

    var sec1 = $("<div/>").attr({'id' : 'sec1'});

    var sec2 = $("<div/>").attr({'id' : 'sec2'});
    var sec3 = $("<div/>").attr({'id' : 'sec3'});

    var logo_icon = document.createElement("img")
    var followers_icon = document.createElement("img")
    var cp_icon = document.createElement("img")
    var mc_icon = document.createElement("img")

    var followers_title = document.createElement("p")
    var cp_title = document.createElement("p")
    var mc_title = document.createElement("p")
    followers_title.id = "sec1_title"
    cp_title.id = "sec2_title"
    mc_title.id = "sec3_title"


    var followers_icon_path = chrome.runtime.getURL("images/follower-w.png")
    var cp_icon_path = chrome.runtime.getURL("images/dollar-w.png")
    var mc_icon_path = chrome.runtime.getURL("images/market-w.png")
    var logo_path = chrome.runtime.getURL("images/finallogo.svg")
    logo_icon.src = logo_path
    logo_icon.id = "logo_icon"

    followers_icon.src = followers_icon_path
    followers_icon.id = "icon_followers"

    cp_icon.src = cp_icon_path
    cp_icon.id = "icon_cp"

    mc_icon.src = mc_icon_path
    mc_icon.id = "icon_mc"

    cp_title.innerText = "Coin Price"
    mc_title.innerText = "Market Capital"
    followers_title.innerText = "Follower"

    logo.append(logo_icon)
    sec1.append(cp_icon)
    sec1.append(cp_title)
    sec2.append(followers_icon)
    sec2.append(followers_title)
    sec3.append(mc_icon)
    sec3.append(mc_title)
    tab.append(logo)
    tab.append(sec1)
    tab.append(sec2)
    tab.append(sec3)

    var title = $('<span id="titleNormal">' + tabTitle + '</span>');
    var header_main = $("<div/>").attr({'id' : 'header_main'});
    var header = $("<div/>").attr({'id' : 'header', "class":"header-flex"});
    var signout_header = $("<button/>").attr({'id' : 'signout', "class": "flex-items"});
    var header_login = $("<div/>").attr({'id' : 'header_login'});
    var close_logo_address = chrome.runtime.getURL("images/close-w.png")
    console.log(close_logo_address)
    var back = document.createElement("img");
    back.src = close_logo_address;
    back.class = "header-flex"
    back.id = "close_img"
    header_main.append(signout_header)
    header_main.append(header)
    header_main.append(back)

    var back_login = document.createElement("img");
    back_login.src = close_logo_address;
    back_login.class = "header-flex"
    back_login.id = "close_img_login"

    header_login.append(back_login)

    $(window).resize(fixIframeHeight);

    function fixIframeHeight() {
      site.height("95%");
    }

    function togglePanel() {
      var openPanel = tab.is(":visible");

      var embedPosition = openPanel ? "0px" : "-700px";
      var tabPosition = openPanel ? "0px" : "0px";
      var loginPosition = openPanel ? "0px" : "-700px";

    var easing = "swing",
      tabAnimationTime = 50,
      embedAnimationTime = 100;

      if (openPanel) {
        chrome.storage.local.get(['login', 'username'], function(data) {
            console.log('value of login in : ' + data.login)
            var req = get_requestor()

            var login_flag = data.login
            if (login_flag !== true || (login_flag === true && req !== data.username)) {
              if (login_flag === true) {
                console.log("Switched account");
              } else {
                console.log("not logged in")

              }
              fixIframeHeight();
              tab.animate({right: tabPosition}, tabAnimationTime, easing, function() {
                tab.hide();
              });
              login.show();
              login.animate({right: embedPosition}, embedAnimationTime,easing);

            } else {
              console.log("logged in")
              fixIframeHeight();
              tab.animate({right: tabPosition}, tabAnimationTime, easing, function() {
                tab.hide();
              });
              embed.show();
              embed.animate({right: embedPosition}, embedAnimationTime,easing);

            }

        });

      } else {
        embed.animate({right: embedPosition}, embedAnimationTime, easing, function() {
      embed.hide();
        });
        login.animate({right: embedPosition}, embedAnimationTime, easing, function() {
      login.hide();
        });
      tab.show();
      tab.animate({right: tabPosition}, tabAnimationTime, easing);
      }
    }

    back.addEventListener('click', function(e) {
      togglePanel()
    })

    back_login.addEventListener('click', function(e) {
      togglePanel()
    })

    sec1.click(togglePanel);
    sec2.click(togglePanel)
    sec3.click(togglePanel)


    function populateEmbed(datatype) {

      chrome.storage.local.get(['login', 'username'], function(data) {
          console.log('value of login in : ' + data.login)
          var login = data.login
          var req = get_requestor()
          if (login !== true || (login === true && req !== data.username)) {
            if (login === true) {
              // switched account
              chrome.storage.local.get(['cache_cp', 'cache_cp_time', 'cache_fo', 'cache_fo_time', 'cache_mc', 'cache_mc_time'], function(items) {
                if (items.cache_cp) {

                      chrome.storage.local.set({cache_cp: null}, function() {
                        console.log("Cache CP Invalidated")
                      });
                }
                if (items.cache_fo) {

                      chrome.storage.local.set({cache_fo: null}, function() {
                        console.log("Cache Followers Invalidated")
                      });
                }
                if (items.cache_mc) {

                      chrome.storage.local.set({cache_mc: null}, function() {
                        console.log("Cache MC Invalidated")
                      });
                }


              });
            }
            console.log("not logged in")
            userSignUp();

          } else {
            console.log("logged in")
            displayStats(datatype)


          }

      });

    }

    async function displayStats(datatype) {
      console.log("Inside populate embed logged in")

      var doc = document.getElementById("site")
      doc.innerText = ""

      console.log(doc)
      var user = get_user();
      var requestor = get_requestor();

      $("#signout").html("Sign Out")

      document.getElementById("signout").addEventListener('click', function(e) {
      
        url = get_users_api + requestor
        chrome.storage.local.get(['key'], function(result) {
          console.log('Value of key currently is ' + result.key);
          const response = fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "X-API-Key": backend_api_key,
                    "key": result.key
                }
            }).then(response => response.json()).then(data=>{
              console.log(data)
              chrome.storage.local.set({"login": false}, function() {
                console.log('Value is set to ' + "false");
              });
              embed.hide();
              tab.show();
              var easing = "swing";
              tabAnimationTime = 50;
              var tabPosition = "0px";

              tab.animate({right: tabPosition}, tabAnimationTime, easing);

            });
        });

      });

      var preloader_gif = document.createElement("img");
      var preloader_gif_path = chrome.runtime.getURL("images/rocketloader.gif")
      preloader_gif.src = preloader_gif_path;
      preloader_gif.id = "preloader_gif"
      doc.append(preloader_gif)

      function isProfilePage() {
        var pathname = window.location.pathname;
        return (pathname.includes("/u/"));
      }

      async function userStatsAvailable(user) {
        const path = get_users_api + user
        var result = false
        await fetch(path, {
              method: "GET",
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "X-API-Key": backend_api_key,
                  "key": key
              }
          }).then(response => response.json()).then(data => {
          console.log(data)

          var status_code = data[1]
          console.log(status_code);
          if (status_code != 200) {
            result = false;
            console.log("User doesn't exist")
            return result;
          }
          else {
            if (data[0]["public_access"] === false && user!= requestor) {
              console.log("User has public access disabled")
              result = false;
              return result;
            } else {
              result = true;
              return result;
            }

          }
        })
        return result;
      }


      if (isProfilePage() === true) {

          console.log("on profile page")

          switch(datatype) {
            case "coinprice":
              $("#header").html("COIN PRICE TREND (USD)")
              break;
            case "followers":
              $("#header").html("FOLLOWERS TREND")
              break;
            case "marketcap":
              $("#header").html("MARKET CAPITAL TREND (USD)")
              break;
          }
          chrome.storage.local.get(['public_access'], async function(data) {
              if (data.public_access === false && user!= requestor) {
                  doc.innerText = ""
                  exceptionPublicAccessDenied();
              } else {
                var userStatsAvail = await userStatsAvailable(user)
                if (userStatsAvail === true) {
                  console.log("user stats available")
                  doc.innerText = ""

                  var container = $("<div />").attr({'id' : 'container'});
                  container.append(preloader_gif);
                  var _site = $('#site')
                  _site.append(container)
                  var hr = document.createElement("hr");
                  hr.setAttribute("width", "100%");
                  hr.setAttribute("id", "hr")
                  hr.setAttribute("margin", "2px");

                  var footer = $("<div/>").attr({"id":"footer"})
                  var average = $("<div/>").attr({"id":"average", "class": "flex-items"})
                  var growth = $("<div/>").attr({"id":"growth", "class": "flex-items"})

                  var share = $("<button/>").attr({'id' : 'share', 'value': 'Share some <3', "class": "flex-items"});
                  footer.append(average)
                  footer.append(growth)
                  footer.append(share)
                  _site.append(hr)
                  _site.append(footer)

                  var area_div = document.getElementById("container")

                  if (datatype === "coinprice") {

                    const url = "https://growclout.deta.dev/coinprice?user=" + user + "&requestor=" + requestor;

                    if (user === requestor) {
                      let start_time = new Date().getTime();
                      chrome.storage.local.get(['cache_cp', 'cache_cp_time'], function(items) {
                        if (items.cache_cp && items.cache_cp_time && items.cache_cp_time) {
                          if (items.cache_cp_time > Date.now() - 1*3600*1000) {
                            console.log("Cache Hit - coinprice")
                            plot(items.cache_cp, datatype); // Serialization is auto, so nested objects are no problem
                          } else {
                            const response = fetch(url, {
                                  method: "GET",
                                  headers: {
                                      "Content-type": "application/json; charset=UTF-8",
                                      "X-API-Key": backend_api_key,
                                      "key": key
                                  }
                              }).then(response => response.json()).then(data=>{
                              chrome.storage.local.set({cache_cp: data, cache_cp_time: Date.now()}, function() {
                                console.log("Cache Miss - coinprice")
                                plot(data, datatype);
                              });
                            });
                          }
                        }
                        else {
                          const response = fetch(url, {
                                method: "GET",
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                    "X-API-Key": backend_api_key,
                                    "key": key
                                }
                            }).then(response => response.json()).then(data=>{
                            chrome.storage.local.set({cache_cp: data, cache_cp_time: Date.now()}, function() {
                              console.log("Cache Miss - coinprice")
                              plot(data, datatype);
                            });
                          });
                        }

                      });
                    } else {
                      const response = fetch(url, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "X-API-Key": backend_api_key,
                                "key": key
                            }
                        }).then(response => response.json()).then(data=>{
                          plot(data, datatype);
                      });
                    }


                  }
                  else if (datatype === "followers") {

                    const url = "https://growclout.deta.dev/followers?user=" + user + "&requestor=" + requestor;
                    if (user === requestor) {
                      chrome.storage.local.get(['cache_fo', 'cache_fo_time'], function(items) {
                        if (items.cache_fo && items.cache_fo_time && items.cache_fo_time) {
                          if (items.cache_fo_time > Date.now() - 1*3600*1000) {
                            console.log("Cache Hit - Followers")
                            plot(items.cache_fo, datatype); // Serialization is auto, so nested objects are no problem
                          } else {
                            const response = fetch(url, {
                                  method: "GET",
                                  headers: {
                                      "Content-type": "application/json; charset=UTF-8",
                                      "X-API-Key": backend_api_key,
                                      "key": key
                                  }
                              }).then(response => response.json()).then(data=>{
                              chrome.storage.local.set({cache_fo: data, cache_fo_time: Date.now()}, function() {
                                console.log("Cache Miss - Followers")
                                plot(data, datatype);
                              });
                            });
                          }
                        }
                        else {
                          const response = fetch(url, {
                                method: "GET",
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                    "X-API-Key": backend_api_key,
                                    "key": key
                                }
                            }).then(response => response.json()).then(data=>{
                            chrome.storage.local.set({cache_fo: data, cache_fo_time: Date.now()}, function() {
                              console.log("Cache Miss - Followers")
                              plot(data, datatype);
                            });
                          });
                        }

                      });
                    } else {
                      const response = fetch(url, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "X-API-Key": backend_api_key,
                                "key": key
                            }
                        }).then(response => response.json()).then(data=>{plot(data, datatype);});
                    }
                  }
                  else if(datatype === "marketcap"){

                    const url = "https://growclout.deta.dev/marketcap?user=" + user + "&requestor=" + requestor;
                    if (user === requestor) {
                      chrome.storage.local.get(['cache_mc', 'cache_mc_time'], function(items) {
                        if (items.cache_mc && items.cache_mc_time && items.cache_mc_time) {
                          if (items.cache_mc_time > Date.now() - 1*3600*1000) {
                            console.log("Cache Hit - MarketCap")
                            plot(items.cache_mc, datatype); // Serialization is auto, so nested objects are no problem
                          } else {
                            const response = fetch(url, {
                                  method: "GET",
                                  headers: {
                                      "Content-type": "application/json; charset=UTF-8",
                                      "X-API-Key": backend_api_key,
                                      "key": key
                                  }
                              }).then(response => response.json()).then(data=>{
                              chrome.storage.local.set({cache_mc: data, cache_mc_time: Date.now()}, function() {
                                console.log("Cache Miss - MarketCap")
                                plot(data, datatype);
                              });
                            });
                          }
                        }
                        else {
                          const response = fetch(url, {
                                method: "GET",
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                    "X-API-Key": backend_api_key,
                                    "key": key
                                }
                            }).then(response => response.json()).then(data=>{
                            chrome.storage.local.set({cache_mc: data, cache_mc_time: Date.now()}, function() {
                              console.log("Cache Miss - MarketCap")
                              plot(data, datatype);
                            });
                          });
                        }

                      });
                    } else {
                      const response = fetch(url, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "X-API-Key": backend_api_key,
                                "key": key
                            }
                        }).then(response => response.json()).then(data=>{plot(data, datatype);});
                    }
                  }
                } else {
                  console.log("user stats not available")
                  doc.innerText = ""

                  exceptionUserStatsUnavailable();
                }
              }
          })

      } else {
        console.log("not on profile page")
        doc.innerText = ""

        exceptionNotProfilePage();
      }

      function exceptionUserStatsUnavailable() {
        var exception_container = $("<div />").attr({'id' : 'exception_container'});
        var _site = $('#site')
        var image_path = chrome.runtime.getURL("images/search.png")
        console.log(image_path)
        var exception_logo = document.createElement("img");
        exception_logo.src = image_path;
        exception_logo.id = "exception_image"

        var exception_text = document.createElement("p")
        exception_text.id = "exception_stats"
        exception_text.innerText = "Either User Not Found or Public Access Disabled"

        exception_container.append(exception_logo)
        exception_container.append(exception_text)

        _site.append(exception_container)

      }

      function exceptionNotProfilePage() {
        var exception_container = $("<div />").attr({'id' : 'exception_container'});
        var _site = $('#site')
        var image_path = chrome.runtime.getURL("images/search.png")
        console.log(image_path)
        var exception_logo = document.createElement("img");
        exception_logo.src = image_path;
        exception_logo.id = "exception_image"

        var exception_text = document.createElement("p")
        exception_text.innerText = "Not on a user profile page"
        exception_text.id = "exception_profile"
        exception_container.append(exception_logo)
        exception_container.append(exception_text)

        _site.append(exception_container)

      }

      function exceptionPublicAccessDenied() {
        var exception_container = $("<div />").attr({'id' : 'exception_container'});
        var _site = $('#site')
        var image_path = chrome.runtime.getURL("images/lock.png")
        console.log(image_path)
        var exception_logo = document.createElement("img");
        exception_logo.src = image_path;
        exception_logo.id = "exception_image"

        var exception_text = document.createElement("p")
        exception_text.innerText = "You can't see other creators's stats because you have disabled public access"
        exception_text.id = "exception_access"

        var enable_button = $("<button/>").attr({'id' : 'enable_access'});

        exception_container.append(exception_logo)
        exception_container.append(exception_text)
        exception_container.append(enable_button)

        _site.append(exception_container)
        $("#enable_access").html("Enable Public Access")

        document.getElementById("enable_access").addEventListener('click', function(e) {

          chrome.storage.local.get(['key'], function(result) {
              console.log("Key currently used is : " + result.key);
              const response = fetch(backend_base_api + "enable" , {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "X-API-Key": backend_api_key,
                    "key": result.key

                },
                body: JSON.stringify({
                    username: requestor
                }),

              }).then(response => response.json()).then(data=>{
                console.log(data)
                chrome.storage.local.set({"public_access": true}, function() {
                  console.log('public_access is set to ' + "true");
                });
                var image_path_unlock = chrome.runtime.getURL("images/rocket.png")
                console.log(image_path_unlock)
                exception_logo.src = image_path_unlock;
                exception_text.innerText = "Yay! You can now access other creators statistics and they can view yours too!"
                document.getElementById("enable_access").style.display = "none";
              });

          });


        })

      }

      function plot(response, datatype) {
        $("#preloader_gif").hide()
        $("#container").innerText = ""
        x_data = response[0]["tstamp_list"];
        y_data = response[0]["data"];
        for (i = 0; i < x_data.length; i++) {
          x_data[i] = new Date(x_data[i])
        }
        var user = get_user()
        var requestor = get_requestor()
        var date_now = new Date(Date.now() + 1* 24 * 60 * 60 * 1000).toISOString()
        var date_begin = new Date(Date.now() - 30* 24 * 60 * 60 * 1000).toISOString() // date before 30 days
        var title = "Last 30 Days (USD)"
        if (datatype === "followers") {
          title = "Last 30 Days"
        }


        var trace1 = {
          type: "scatter",
          fill: 'tonexty',
          type: 'scatter',
          name: 'Coin Price',
          x: x_data,
          y: y_data,
          line: {color: '#005bff'}
        }


        var data = [trace1];

        var layout = {
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 80,
            pad: 4


          },
          title: title,
          xaxis: {
            autorange: false,
            range: [date_begin, date_now],
            type: 'date'
          },
          yaxis: {
            autorange: true,
            range: [0,100],
            type: 'linear'
          }
        };
        var date_30days_back = new Date(Date.now() - 30* 24 * 60 * 60 * 1000)
        var average = calculate_average(x_data, y_data, date_30days_back)
        var growth = calculate_growth(x_data, y_data, date_30days_back)
        var difference = calculate_diff(x_data, y_data, date_30days_back)

        function calculate_diff(x_data, y_data, date_begin) {
          var size = y_data.length
          if (x_data[0] > date_begin) {
            return y_data[size-1] - y_data[0]
          }
          else {
            var start_idx = get_start_idx(x_data, date_begin);
            return y_data[size-1] - y_data[start_idx]
          }
        }

        function calculate_average(x_data, y_data, date_begin) {
          if (x_data[0] > date_begin) {
            return find_average(y_data, 0)
          }
          else {
            var start_idx = get_start_idx(x_data, date_begin);
            return find_average(y_data, start_idx)
          }
        }

        function calculate_growth(x_data, y_data, date_begin) {
          if (x_data[0] > date_begin) {
            return find_growth(y_data, 0)
          }
          else {
            var start_idx = get_start_idx(x_data, date_begin);
            return find_growth(y_data, start_idx)
          }
        }

        function find_average(arr, start_idx) {
            var sum = 0;
            for (let i = start_idx; i < arr.length; i++) {
              sum += arr[i]
            }
            return (sum/(arr.length - start_idx + 1)).toFixed(2);
        }

        function find_growth(arr, start_idx) {
          var start_val = arr[start_idx]
          if (start_val === 0) {
            start_val = 1

          }
          var curr_val = arr[arr.length - 1]
          return ((curr_val - start_val)/start_val * 100).toFixed(2)
        }

        function get_start_idx(arr, date_begin) {
          for (let i = 0; i < arr.length; i++) {
            var date = arr[i];
            if (date.getDate() === date_begin.getDate() &&
              date.getMonth() === date_begin.getMonth() &&
              date.getYear() === date_begin.getYear()) {
                return i;
              }
          }
          return 0
        }

        (async function(){
          const gd = await Plotly.newPlot("container", data, layout);
          document.getElementById("share").addEventListener('click', function(e) {
            (async function(){
              const url = await Plotly.toImage(gd, {height:400, width: 500});
              var hosted_url = await upload_image(url);
              var post = window.open("https://bitclout.com/browse?feedTab=Following");
              post.onload = function() {
                setTimeout(function(){ var classname = "feed-create-post__textarea";
                var textarea = post.document.getElementsByClassName(classname)[0];
                var datatype_map = {
                  "coinprice": "coin price(USD)",
                  "followers": "followers",
                  "marketcap": "market capital(USD)"
                }
                if (user === requestor) {
                  textarea.value = "Hey Guys! Check out my last 30 days " + datatype_map[datatype] + " trend here - " + hosted_url + ". Made by @growclout 🚀 with ❤️";
                } else {
                  textarea.value = "Hey Guys! Check out the last 30 days " + datatype_map[datatype] + " trend of @" + user+ " here - " + hosted_url + ". Made by @growclout 🚀 with ❤️";

                }

              }, 1000);}

              async function upload_image(base64) {

                base64 = base64.slice(22);
                const body = new FormData()
                body.append("image", '\"' + base64 + '\"')
                var result = "url";
                await fetch("https://api.imgur.com/3/image", {
                  body,
                  headers: {
                    Authorization: "Client-ID " + imgur_client_id
                  },
                  method: "POST"
                }).then(response => response.json())
                .then(data => {
                  console.log(data);
                  console.log(data["data"]["link"]);
                  result = data["data"]["link"];
                });

                return result;

              }
            })()

          });
        })()



        if (datatype === "followers") {
          $("#average").html("Followers Change Last 30 Days: " + difference)
        } else {
          $("#average").html("Average Last 30 Days: " + average + " USD")
        }
        $("#growth").html("% Growth Last 30 Days: " + growth +"%")
        $("#share").html("Share as Clout")

      }
    }
    function userSignUp() {

      var doc = document.getElementById("login_site")
      doc.innerText = ""

      var form = $("<form />").attr({'id' : 'myForm', 'method': 'post', 'action': 'myapi'});

      var heading = $("<h3/>").attr({'id': 'form_heading'})
      var subheading = $("<h4/>").attr({'id': 'form_subheading'})
      var useraccess = $("<p/>").attr({'id': 'useraccess', "class":"form-p"})
      var input = $("<input />").attr({'id' : 'user', 'type' : 'text','value':get_requestor(), 'readonly':true});
      var public_access = $("<p/>").attr({'id': 'publicaccess',"class":"form-p"})
      var public_access_sub = $("<p/>").attr({'id': 'publicaccess_sub',"class":"form-p"})

      var yes = $("<p/>").attr({'id': 'yes', 'class':'sameline form-p'})
      var no= $("<p/>").attr({'id': 'no', 'class':'sameline form-p'})

      var public_access_yes = $("<input />").attr({'id' : 'public_access_yes','class':'sameline', 'type' : 'radio', 'name':'public_access','value':true});
      var public_access_no = $("<input />").attr({'id' : 'public_access_no', 'class':'sameline','type' : 'radio', 'name':'public_access','value':false});

      var submit = $("<input />").attr({'id' : 'submit', 'type' : 'button', 'value': 'Submit'});

      form.append(heading)
      form.append(subheading)
      form.append(useraccess)
      form.append(input)
      form.append(public_access)
      form.append(public_access_sub)

      form.append(yes)
      form.append(public_access_yes)
      form.append(no)
      form.append(public_access_no)
      form.append(submit)

      var _site = $('#login_site')
      _site.append(form)

      $("#form_heading").html("Hi Amigo!")
      $("#form_subheading").html("Let's Begin Analyzing")
      $("#useraccess").html("Verify your username")
      $("#publicaccess").html("Allow Public Access?")
      $("#publicaccess_sub").html("Allowing public access would enable you to see other creators' stats and enable them to view yours")

      $("#yes").html("Yes")
      $("#no").html("No")

      document.getElementById("submit").addEventListener('click', function(e) {
        var username = get_requestor();
        console.log(username)
        var public_access_str = document.forms["myForm"]["public_access"].value
        var public_access = (public_access_str === "true") ? true : false;
        console.log(public_access)
        fetch("https://growclout.deta.dev/register", {
              method: "POST",
              body: JSON.stringify({
                  username: username,
                  public_access: public_access
              }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "X-API-Key": backend_api_key
              }
          })
          .then(response => response.json())
          .then(json => {console.log(json);
            chrome.storage.local.set({"key": json[0]["key"]}, function() {
              console.log('Key is set to ' + json[0]["key"]);
              key = json[0]["key"];
            });
          });

        chrome.storage.local.set({"username": username}, function() {
          console.log('Value is set to ' + username);
        });
        chrome.storage.local.set({"public_access": public_access}, function() {
          console.log('public_access is set to ' + public_access);
        });
        chrome.storage.local.set({"login": true}, function() {
          console.log('Value is set to ' + "true");
        });
        var doc = document.getElementById("login_site")
        doc.innerText = ""

        var registered_container = $("<div />").attr({'id' : 'registered_container'});
        var image_path = chrome.runtime.getURL("images/jet-pack-g.png")
        var img = document.createElement("img");
        img.src = image_path;
        img.id = "registered_image"

        var text = document.createElement("p")
        text.id = "centered-text"
        text.innerText = "Onboarded Successfully"

        registered_container.append(img)
        registered_container.append(text)
        $("#login_site").append(registered_container)
      })

    }


    header.append(title);

    embed.append(header_main);
    embed.append(site);
    login.append(header_login)
    login.append(login_site)
    embed.hide();
    login.hide()

    $('body').append(tab);
    $('body').append(embed);
    $('body').append(login);


    document.getElementById("sec1").onclick = function() {
      populateEmbed("coinprice")
    }
    document.getElementById("sec2").onclick = function() {
      populateEmbed("followers")
    }
    document.getElementById("sec3").onclick = function() {
      populateEmbed("marketcap")
    }

  }

  insertAnalyticsSideBar();

});
