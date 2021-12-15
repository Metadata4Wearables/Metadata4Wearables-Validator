import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import studySchemaOrig from "./schema/study.json";
import md5 from "md5";

const studySchema = {
  ...studySchemaOrig,
  properties: {
    ...studySchemaOrig.properties,
    datasets: {},
    participants: {},
    devices: {},
  },
};

const uiSchema = {
  "ui:order": ["name", "clinical_trial", "clinical_trial_id", "*"],
  clinical_trial: {
    "ui:widget": "radio",
  },
  uuid: { "ui:readonly": true, "ui:widget": "hidden" },
  keywords: { "ui:options": { orderable: false } },
};

function Study({ study, onSubmit }) {
  const [formData, setFormData] = React.useState(study);
  const navigate = useNavigate();

  const handleSubmit = ({ formData }, e) => {
    onSubmit(formData);
    navigate("/");
  };

  const handleError = (errors) => {
    console.error(errors);
  };

  const handleChange = (event) => {
    const formData = event.formData;
    if (formData.name) formData.uuid = md5(formData.name);
    if (formData.clinical_trial === false) delete formData.clinical_trial_id;

    setFormData(formData);
  };

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
}

export default Study;
