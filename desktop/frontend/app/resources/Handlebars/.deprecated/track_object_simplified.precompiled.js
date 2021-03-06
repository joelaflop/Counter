(function() {
   var template = Handlebars.template,
      templates = Handlebars.templates = Handlebars.templates || {};
   templates['track_object_simplified'] = template({
      "1": function(container, depth0, helpers, partials, data) {
         var lookupProperty = container.lookupProperty || function(parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
               return parent[propertyName];
            }
            return undefined
         };

         return " " +
            container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0, "name") : depth0), depth0)) +
            " ";
      },
      "compiler": [8, ">= 4.3.0"],
      "main": function(container, depth0, helpers, partials, data) {
         var stack1, helper, alias1 = depth0 != null ? depth0 : (container.nullContext || {}),
            lookupProperty = container.lookupProperty || function(parent, propertyName) {
               if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                  return parent[propertyName];
               }
               return undefined
            };

         return "<p>Title: " +
            container.escapeExpression(((helper = (helper = lookupProperty(helpers, "name") || (depth0 != null ? lookupProperty(depth0, "name") : depth0)) != null ? helper : container.hooks.helperMissing), (typeof helper === "function" ? helper.call(alias1, {
               "name": "name",
               "hash": {},
               "data": data,
               "loc": {
                  "start": {
                     "line": 1,
                     "column": 10
                  },
                  "end": {
                     "line": 1,
                     "column": 18
                  }
               }
            }) : helper))) +
            " - Artist(s):" +
            ((stack1 = lookupProperty(helpers, "each").call(alias1, (depth0 != null ? lookupProperty(depth0, "artists") : depth0), {
               "name": "each",
               "hash": {},
               "fn": container.program(1, data, 0),
               "inverse": container.noop,
               "data": data,
               "loc": {
                  "start": {
                     "line": 1,
                     "column": 31
                  },
                  "end": {
                     "line": 1,
                     "column": 72
                  }
               }
            })) != null ? stack1 : "") +
            "</p>\n";
      },
      "useData": true
   });
})();
