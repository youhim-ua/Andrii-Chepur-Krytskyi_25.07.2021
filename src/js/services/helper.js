import Handlebars from 'handlebars/runtime';

Handlebars.registerHelper('sliceFunc', function (text) {
  return text.slice(0, 81) + '...';
});

Handlebars.registerHelper('toLowerCase', function (text) {
  return text.toLowerCase();
});

export default Handlebars;