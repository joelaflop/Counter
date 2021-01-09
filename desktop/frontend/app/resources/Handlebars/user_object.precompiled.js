(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['user_object'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"userholder text-white\">\n   <div class=\"userinfo\">\n      <div class=\"username\">\n         <h4 class=\"m-0\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"username") || (depth0 != null ? lookupProperty(depth0,"username") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"username","hash":{},"data":data,"loc":{"start":{"line":4,"column":25},"end":{"line":4,"column":37}}}) : helper)))
    + "</h4>\n      </div>\n      <div class=\"email\">\n         <h6 class=\"m-0\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"email") || (depth0 != null ? lookupProperty(depth0,"email") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data,"loc":{"start":{"line":7,"column":25},"end":{"line":7,"column":34}}}) : helper)))
    + "</h6>\n      </div>\n      <div class=\"platform\">\n         <h5 class=\"m-0\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"platform") || (depth0 != null ? lookupProperty(depth0,"platform") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"platform","hash":{},"data":data,"loc":{"start":{"line":10,"column":25},"end":{"line":10,"column":37}}}) : helper)))
    + "</h5>\n      </div>\n      <div class=\"created-on\">\n         <h5 class=\"m-0\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"created_on") || (depth0 != null ? lookupProperty(depth0,"created_on") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"created_on","hash":{},"data":data,"loc":{"start":{"line":13,"column":25},"end":{"line":13,"column":39}}}) : helper)))
    + "</h5>\n      </div>\n   </div>\n</div>";
},"useData":true});
})();