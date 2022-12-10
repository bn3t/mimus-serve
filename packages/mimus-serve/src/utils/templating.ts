import Handlebars from "handlebars";

export const processTemplate = (template: string | undefined, data: any) => {
  if (template === undefined) {
    return undefined;
  }
  const templateFunction = Handlebars.compile(template);
  return templateFunction(data);
};
