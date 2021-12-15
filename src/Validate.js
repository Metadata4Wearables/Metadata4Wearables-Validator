import Ajv from "ajv";
import applyAjvFormats from "ajv-formats-draft2019";
import studySchema from "./schema/study.json";

const Validate = ({ study }) => {
  const ajv = new Ajv({ allErrors: true });
  applyAjvFormats(ajv);
  const validate = ajv.compile(studySchema);
  const valid = validate(study);

  return (
    <>
      <h1>Validation status: {valid ? "Valid" : "Invalid"}</h1>
      {!valid && (
        <>
          <h2>Errors</h2>
          <ul>
            {validate.errors.map((e) => {
              return (
                <li>
                  <p>keyword: {e.keyword}</p>
                  <p>instancePath: {e.instancePath}</p>
                  <p>schemaPath: {e.schemaPath}</p>
                  <p>params: {JSON.stringify(e.params)}</p>
                  <p>propertyName: {e.propertyName}</p>
                  <p>message: {e.message}</p>
                  <p>schema: {e.schema}</p>
                  <p>parentSchema: {e.parentSchema}</p>
                  <p>data: {e.data}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Validate;
