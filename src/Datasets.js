import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import datasetSchema from "./schema/dataset.json";
import personSchema from "./schema/person.json";

datasetSchema.properties.contributors.items = personSchema;

const datasetsSchema = {
  definitions: {
    dataset: datasetSchema,
  },
  title: "Datasets",
  type: "array",
  items: {
    $ref: "#/definitions/dataset",
  },
};

const uiSchema = {
  "ui:options": { orderable: false },
};

function Datasets({ project, onSubmit }) {
  const [formData, setFormData] = React.useState(project.study.datasets);
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
      schema={datasetsSchema}
      formData={formData}
      uiSchema={uiSchema}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onError={handleError}
      showErrorList={false}
    />
  );
}

export default Datasets;
