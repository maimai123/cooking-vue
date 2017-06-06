<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="referrer" content="never">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <script type="text/javascript" src="http://baiduface.file.alimmdn.com/js/flexible.js?t=1492423512023"></script>
    <% for (var i in htmlWebpackPlugin.options.cdn.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.cdn.css[i] %>"><% } %>
    <style>
    body{
      margin:0;
    }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.bootcss.com/jquery/3.1.1/jquery.js"></script>
    <% for (var i in htmlWebpackPlugin.options.cdn.js) { %>
    <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script><% } %>
  </body>
</html>
