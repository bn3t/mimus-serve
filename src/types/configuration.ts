export interface Configuration {
  transform: boolean;
  files: string;
  mappings: string;
  datasets: string;
  cors: {
    origin: boolean | string | (string | RegExp)[] | RegExp;
    methods: string[];
    allowedHeaders?: string;
    exposedHeaders?: string;
    credentials?: boolean;
    maxAge?: number;
  };
}

export interface Options {
  help?: boolean;
  config?: string;
  port?: number;
  host?: string;
  logger?: string;
  files?: string;
  mappings?: string;
  datasets?: string;
  transform?: boolean;
}
