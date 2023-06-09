import Handlebars from "handlebars";

/**
 * Processes a Handlebars template with the given data.
 * @param template The Handlebars template to process.
 * @param data The data to use when processing the template.
 * @returns The processed template, or undefined if the template is undefined.
 */
export const processTemplate = (template: string | undefined, data: any) => {
  if (template === undefined) {
    return undefined;
  }
  const templateFunction = Handlebars.compile(template);
  return templateFunction(data);
};
