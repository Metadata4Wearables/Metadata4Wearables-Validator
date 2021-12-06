import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "@rjsf/core";
import eventSchema from "./schema/event.json";

const eventsSchema = {
  definitions: {
    event: eventSchema,
  },
  title: "Events",
  type: "array",
  items: {
    $ref: "#/definitions/event",
  },
};

const uiSchema = {};

const Events = ({ project, onSubmit }) => {
  const params = useParams();
  const participantId = params.id;
  const participant = project.study.participants[participantId];
  const [formData, setFormData] = React.useState(participant.events);
  const navigate = useNavigate();

  const handleSubmit = ({ formData }, e) => {
    onSubmit(participantId, formData);
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
      <h1>Participant {participantId} events</h1>
      <Form
        noHtml5Validate
        schema={eventsSchema}
        formData={formData}
        uiSchema={uiSchema}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onError={handleError}
        showErrorList={false}
      />
    </>
  );
};

export default Events;
