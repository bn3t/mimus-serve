export interface Configuration {
  general: {
    transform: boolean;
    files: string;
    mappings: string;
    datasets: string;
    fixedDelayMilliseconds: number;
    port: number;
    host: string;
  };
  logging: {
    logger?: string;
  };
  cors: {
    origin: boolean | string | string[];
    methods: string[];
    allowedHeaders?: string;
    exposedHeaders?: string;
    credentials?: boolean;
    maxAge?: number;
  };
}

export interface Options {
  help: boolean;
  verbose: boolean;
  config?: string;
  port?: number;
  host?: string;
  logger?: string;
  files?: string;
  mappings?: string;
  datasets?: string;
  transform?: boolean;
}
