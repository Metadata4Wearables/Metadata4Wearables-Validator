import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import studySchema from "./schema/study.json";
import { Link } from "react-router-dom";

const participantsSchema = {
  ...studySchema.properties.participants,
  items: {
    ...studySchema.properties.participants.items,
    properties: {
      ...studySchema.properties.participants.items.properties,
      events: {},
    },
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
