import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import deviceSchema from "./schema/device.json";

const devicesSchema = {
  title: "Devices",
  type: "array",
  items: deviceSchema,
};

const uiSchema = {
  "ui:options": { orderable: false },
};

function Devices({ project, onSubmit }) {
  const [formData, setFormData] = React.useState(project.study.devices);
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
