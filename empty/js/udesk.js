 ;(function() {
    var timeStamp = (new Date()).getTime();
   (function(a, h, c, b, f, g) {
     a["UdeskApiObject"] = f;
     a[f] = a[f] || function() {
       (a[f].d = a[f].d || []).push(arguments)
     };
     g = h.createElement(c);
     g.async = 1;
     g.src = b;
     c = h.getElementsByTagName(c)[0];
     c.parentNode.insertBefore(g, c)
   })(window, document, "script", "../js/udeskApi.js?"+timeStamp, "ud");
   ud({
     "code": "1cke9cf9",
     "manualInit": true,
     "link": "http://kefu253.udesk.cn/im_client?web_plugin_id=37818"

   });
 })()
