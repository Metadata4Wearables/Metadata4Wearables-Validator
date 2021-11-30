import React from "react";
import Form from "@rjsf/core";
import studySchema from "./study";

const schema = {
  title: studySchema.title,
  description: studySchema.description,
  type: studySchema.type,
  properties: {
    name: studySchema.properties.name,
  },
  required: ["name"],
};

const objectUrl = (object) => {
  const blob = new Blob([JSON.stringify(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

function App() {
  const [formData, setFormData] = React.useState();

  const handleSubmit = ({ formData }, e) => {
    setFormData(formData);
  };

  const handleError = (errors) => {};

  if (!formData) {
    return (
      <Form
        liveValidate
        noHtml5Validate
        schema={schema}
        onSubmit={handleSubmit}
        onError={handleError}
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
