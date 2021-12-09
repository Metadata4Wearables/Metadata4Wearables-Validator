import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import participantSchema from "./schema/participant.json";
import { Link } from "react-router-dom";

delete participantSchema["$schema"];

const participantsSchema = {
  definitions: {
    phenotype: participantSchema.definitions.phenotype,
  },
  type: "array",
  items: participantSchema,
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

  const handleError = (errors) => {
    console.error(errors);
  };

  const handleChange = (event) => {
    const formData = event.formData;
    setFormData(formData);
  };

  return (
    <>
      <ul>
        {project.study.participants.map((participant, index) => (
          <li key={index}>
            <Link to={`/participants/${index}/events`}>
              Participant {index} events
            </Link>
          </li>
        ))}
      </ul>
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
    </>
  );
}

export default Participants;
