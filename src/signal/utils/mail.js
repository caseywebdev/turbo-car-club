import config from 'signal/config';
import log from 'signal/utils/log';
import nodemailer from 'nodemailer';
import {markdown} from 'nodemailer-markdown';
import nodemailerSesTransport from 'nodemailer-ses-transport';

const transport = nodemailer.createTransport(nodemailerSesTransport());
transport.use('compile', markdown());

const {enabled, from} = config.mail;

export default (options, cb) => {
  options = {...options, from};
  if (enabled) return transport.sendMail(options, cb);
  log.info([
    `MAIL`,
    `TO ${JSON.stringify(options.to)}`,
    `FROM ${JSON.stringify(options.from)}`,
    `${options.subject}`,
    `${options.markdown}`
  ].join('\n'));
  cb();
};
