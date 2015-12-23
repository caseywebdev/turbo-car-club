import _ from 'underscore';

const title = [];

const getDepth =

export default (segment, props) => {
  let depth = 0;
  while (props && props = props.children.props) ++depth;
  
}

var i = this.context.routeHandlers.length - 2;
var segment = this.documentTitle;
if (this.getDocumentTitle) segment = this.getDocumentTitle();
title.splice(i, Infinity, segment);
document.title = _.compact(title).join(' > ');
