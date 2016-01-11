import _ from 'underscore';
import _str from 'underscore.string';
import classNames from '../node_modules/classnames/bind';
import localizedClassNames from 'client/class-names';

const cx = classNames.bind({});
const camelize = str => _str.camelize(_str.slugify(str));
_.each(localizedClassNames, (names, key) =>
  _.extend(cx[camelize(key)] = classNames.bind(names), names)
);

export default cx;
