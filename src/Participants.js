import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import participantSchema from "./schema/participant.json";

delete participantSchema["$schema"];

const participantsSchema = {
  definitions: {
    participant: participantSchema,
    phenotype: participantSchema.definitions.phenotype,
  },
  type: "array",
  items: {
    $ref: "#/definitions/participant",
  },
};

const uiSchema = {
  "ui:options": { orderable: false },
  items: { phenotypes: { "ui:options": { orderable: false } } },
};

function Participants({ project, onSubmit }) {
  const [formData, setFormData] = React.useState(project.study.participants);
  const navigate = useNavigate();

  const handleSubmit = ({ formData }, e) => {
    onSubmit(formData);
    navigate("/");
  };

  const handleError = (errors) => {};

  const handleChange = (event) => {
    const formData = event.formData;
    setFormData(formData);
  };

  return (
    <Form
      noHtml5Validate
      schema={participantsSchema}
      formData={formData}
      uiSchema={uiSchema}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onError={handleError}
      showErrorList={false}
    />
  );
}

export default Participants;
