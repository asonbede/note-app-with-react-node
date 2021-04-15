import React, { useState, useEffect } from "react";
import axios from "axios";
import noteServices from "../services/notes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = (baseUrl, deliteIndicator) => {
  const [resources, setResources] = useState([]);

  console.log("insideusecountry");

  useEffect(() => {
    console.log("effect");

    noteServices
      .getAll(baseUrl)
      .then((initialResoures) => {
        console.log("promise fulfilled");
        setResources(initialResoures);
      })
      .catch((errr) => {
        console.log("server is down, please refresh the browser and try again");
        //setCountry([]);
      });
  }, [deliteIndicator]);

  const create = async (newObject) => {
    console.log("expectingggg responswe");
    console.log({ newObject });
    console.log({ baseUrl });

    const response = await noteServices.create(baseUrl, newObject);
    //const response = await axios.post(baseUrl, newObject);
    console.log({ response });
    setResources(resources.concat(response));
  };

  const service = {
    create,
  };

  return [resources, service];
};
