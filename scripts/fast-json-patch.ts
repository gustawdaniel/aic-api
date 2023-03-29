import jsonpatch from 'fast-json-patch';
import { Operation } from "fast-json-patch/commonjs/core";

function main() {
  let document = { firstName: "Albert", contactDetails: { phoneNumbers: [] } };
  const patch:Operation[] = [
    { op: "replace", path: "/firstName", value: "Joachim" },
    { op: "add", path: "/lastName", value: "Wester" },
    { op: "add", path: "/contactDetails/phoneNumbers/0", value: { number: "555-123" }  }
  ];
  document = jsonpatch.applyPatch(document, patch).newDocument;
  console.log(document);
}

main();
