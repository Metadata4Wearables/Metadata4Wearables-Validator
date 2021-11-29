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

function App() {
  const [formData, setFormData] = React.useState();

  const handleSubmit = ({formData}, e) => {
    setFormData(formData);
  };

  const handleError = (errors) => {};

  const outputUrl = () => {
    const blob = new Blob([JSON.stringify(formData)], {type : 'application/json'});
    return URL.createObjectURL(blob);
  }

  if (!formData) {
    return <Form
      liveValidate
      noHtml5Validate
      schema={schema}
      onSubmit={handleSubmit}
      onError={handleError}
    />;
  } else {
    return <a download={"study.json"} href={outputUrl()}>Download</a>;
  };
}

export default App;
