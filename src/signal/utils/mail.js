import config from '../config';
import log from './log';
import nodemailer from 'nodemailer';
import {markdown} from 'nodemailer-markdown';
import nodemailerSesTransport from 'nodemailer-ses-transport';

const transport = nodemailer.createTransport(nodemailerSesTransport());
transport.use('compile', markdown());

const {enabled, from} = config.mail;

export default options => {
  options = {...options, from};
  const {to, subject, markdown} = options;
  if (enabled) return transport.sendMail(options);
  log.info(`
MAIL
TO ${JSON.stringify(to)}
FROM ${JSON.stringify(from)}
${subject}
${markdown}`);
  return Promise.resolve();
};
