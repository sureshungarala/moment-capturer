const fs = require("fs");

const htmlPath = "./build/index.html";
const resourceRegex = /.\/static\/\w+\/\w+.[a-z0-9]+.\w+.\w{2,3}/g;
const breakpoint = "</title>";

let htmlContent = fs.readFileSync(htmlPath).toString();
const resources = htmlContent.match(resourceRegex);
const slices = htmlContent.split(breakpoint);

/**
 * ***** Important *****
 * Update this for every react-scripts update.
 */

const newHTMLContent = [slices[0], breakpoint];
resources.forEach((resource) => {
  let resourceType = "script";
  if (/\.css$/.test(resource)) {
    resourceType = "style";
  }
  newHTMLContent.push(
    `<link rel="preload" href="${resource}" as="${resourceType}">`
  );
});
newHTMLContent.push(slices[1]);
fs.writeFileSync(htmlPath, newHTMLContent.join(""));
