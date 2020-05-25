(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['track_object_full'] = template({"1":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + " ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p> <img class=\"someClass\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"album") : depth0)) != null ? lookupProperty(stack1,"images") : stack1)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "\" width=\"100\" height=\"100\"> Title: "
    + alias2(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":91},"end":{"line":1,"column":99}}}) : helper)))
    + " - Artist(s):"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"artists") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":112},"end":{"line":1,"column":153}}})) != null ? stack1 : "")
    + " - Album: "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"album") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</p>\n";
},"useData":true});
})();