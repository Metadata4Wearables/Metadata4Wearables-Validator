import React from "react";
import Form from "@rjsf/core";
import studySchema from "./study";
import md5 from "md5";

delete studySchema["$schema"];
delete studySchema.properties.prereg_doi;
delete studySchema.properties.sample_groups;
delete studySchema.properties.intervention;
delete studySchema.properties.contributors;

const uiSchema = {
  "ui:order": ["name", "clinical_trial", "clinical_trial_id", "*"],
  clinical_trial: {
    "ui:widget": "radio",
  },
  uuid: { "ui:readonly": true, "ui:widget": "hidden" },
};

const objectUrl = (object) => {
  const blob = new Blob([JSON.stringify(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

function App() {
  const [formData, setFormData] = React.useState();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = ({ formData }, e) => {
    setSubmitted(true);
  };

  const handleError = (errors) => {};

  const handleChange = (event) => {
    const formData = event.formData;
    if (formData.name) formData.uuid = md5(formData.name);
    if (formData.clinical_trial === false) delete formData.clinical_trial_id;

    setFormData(formData);
  };

  if (!submitted) {
    return (
      <Form
        noHtml5Validate
        schema={studySchema}
        formData={formData}
        uiSchema={uiSchema}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onError={handleError}
        showErrorList={false}
      />
    );
  } else {
    return (
      <a download={"study.json"} href={objectUrl(formData)}>
        Download
      </a>
    );
  }
}

export default App;
