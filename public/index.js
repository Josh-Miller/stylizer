{"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n  <title>Your Title</title>\n  <meta name=\"HandheldFriendly\" content=\"True\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"./stylizer/styles/stylizer.css\">\n\n</head>\n<body>\n  <header>\n    "
    + this.escapeExpression(((helper = (helper = helpers.test || (depth0 != null ? depth0.test : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"test","hash":{},"data":data}) : helper)))
    + "\n  </header>\n\n  <iframe id=\"patterns\" width=\"100%\" height=\"400px\" sandbox=\"allow-same-origin allow-scripts\"></iframe>\n\n  <script src=\"./stylizer/js/stylizer.js\"></script>\n</body>\n</html>\n";
},"useData":true}