define(['jquery', 'backbone', 'underscore', 'javascripts/templates'], 
    function($, Backbone, _, templates) {
  console.log(JSON.stringify(templates));
  var TitleModel = Backbone.Model.extend({
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
    TitleModel: TitleModel,
    TitleView: TitleView,
    ImageModel: ImageModel,
    ImageView: ImageView
  };
});
