import config from './config';
import { Datasource, Local, S3 } from './datasources';
import Logger from './logger';

const logger = Logger.get('datasource');

if (!global.datasource) {
  switch (config.datasource.type) {
    case 's3':
      global.datasource = new S3(config.datasource.s3);
      logger.info(`using S3(${config.datasource.s3.bucket}) datasource`);
      break;
    case 'local':
      global.datasource = new Local(config.datasource.local.directory);
      logger.info(`using Local(${config.datasource.local.directory}) datasource`);
      break;
    default:
      throw new Error('Invalid datasource type');
  }
}

export default global.datasource as Datasource;

declare global {
  // eslint-disable-next-line no-var
  var datasource: Datasource;
}
