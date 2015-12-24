import _ from 'underscore';

const title = [];

const getIndex = ({children}) => {
  let depth = 0;
  while (children && (children = children.props.children)) ++depth;
  return depth;
}

export default (segment, props) => {
  title.splice(getIndex(props), Infinity, segment);
  document.title = _.compact(title).join(' > ');
};
