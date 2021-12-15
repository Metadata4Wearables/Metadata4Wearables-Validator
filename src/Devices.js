import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import studySchema from "./schema/study.json";

const devicesSchema = studySchema.properties.devices;

const uiSchema = {
  "ui:options": { orderable: false },
};

function Devices({ study, onSubmit }) {
  const [formData, setFormData] = React.useState(study.devices);
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
    setFormData(formData);
  };

  return (
    <Form
      noHtml5Validate
      schema={devicesSchema}
      formData={formData}
      uiSchema={uiSchema}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onError={handleError}
      showErrorList={false}
    />
  );
}

export default Devices;
