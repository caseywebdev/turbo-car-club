import Promise from 'better-promise';

(typeof window === 'undefined' ? global : window).Promise = Promise;
