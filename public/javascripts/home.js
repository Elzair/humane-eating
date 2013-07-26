define(['jquery', 'backbone', 'underscore', 'javascripts/templates'], 
    function($, Backbone, _, templates) {
  console.log(JSON.stringify(templates));
  var 
  //site = new Backbone.Model({
  //  name: "Nettuts+",
  //  url: "http://nettutsplus.com",
  //  twitter: "envatowebdev"
  //}),
  //SiteView = Backbone.View.extend({
  //  el: "#main",
  //  template: _.template('<p><a href="<%= url %>"<%= name %></a> | <a href="http://twitter.com/<%= twitter %>"@<%= twitter %></a></p>'),
  //  render: function() {
  //    this.el.innerHTML = this.template(this.model.toJSON());
  //    return this;
  //  }
  //}),
  TitleModel = Backbone.Model.extend({
    defaults: {
      title: 'Humane Eating',
    },
    initialize: function() {}
  }),
  TitleView = Backbone.View.extend({
    template: templates.title,
    initialize: function() {
      this.render();
    },
    render: function() {
      var html = _.template(this.template, this.model.toJSON());
      $(this.el).html(html);
      return this;
    }
  }),
  ImageModel = Backbone.Model.extend({
    defaults: {
      src: '',
      caption: '',
      classes: '',
      hidden: true
    },
    initialize: function() {}
  }),
  ImageView = Backbone.View.extend({
    template: templates.image,
    initialize: function() {
      this.render();
    },
    render: function() {
      this.model.set({classes: this.model.get('hidden') ? 'hidden' : ''});
      console.log(this.model.toJSON());
      var html = _.template(this.template, this.model.toJSON());
      console.log(html);
      $(this.el).html(html);
      return this;
    }
  });

  return {
    //site: site,
    //SiteView: SiteView,
    TitleModel: TitleModel,
    TitleView: TitleView,
    ImageModel: ImageModel,
    ImageView: ImageView
  };
});
