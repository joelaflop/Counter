(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['track_object_full'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + " ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"songholder\">\n   <div class=\"albumcover\">\n      <img class=\"someClass\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"album") : depth0)) != null ? lookupProperty(stack1,"imageURL") : stack1), depth0))
    + "\" width=\"100\" height=\"100\">\n   </div>\n   <div class=\"songinfo\">\n      <div class=\"songtitle\">\n         <h4 class=\"m-0 textoverflow\">"
    + alias2(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":7,"column":38},"end":{"line":7,"column":46}}}) : helper)))
    + "</h4>\n      </div>\n      <div class=\"songalbum\">\n         <h6 class=\"m-0 textoverflow\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"album") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</h6>\n      </div>\n      <div class=\"songartist\">\n         <h5 class=\"m-0 textoverflow\">"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"artists") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":38},"end":{"line":13,"column":74}}})) != null ? stack1 : "")
    + "</h5>\n      </div>\n   </div>\n</div>\n";
},"useData":true});
})();