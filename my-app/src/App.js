
import './App.css';

import React, { useState } from "react";


const apiResponses = {
  "User Information": {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  "Address Information": {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  "Payment Information": {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

function App() {
  const [formType, setFormType] = useState("");
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleFormTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormType(selectedType);
    setFields(apiResponses[selectedType]?.fields || []);
    setFormData({});
    setErrors({});
    setProgress(0);
  };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const completedFields = Object.keys({ ...formData, [name]: value }).filter(
      (key) => fields.find((f) => f.name === key)?.required && !!value
    );
    setProgress((completedFields.length / fields.filter((f) => f.required).length) * 100);
  };

  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setSubmittedData((prev) => [...prev, formData]);
      setFormData({});
      setProgress(0);
      alert("Form submitted successfully!");
    }
  };
  // Handle editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedData(submittedData[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    const updatedData = [...submittedData];
    updatedData[editingIndex] = editedData;
    setSubmittedData(updatedData);
    setEditingIndex(null);
    alert("Changes saved successfully!");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedData({});
  };
  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    alert("Entry deleted successfully!");
  };

  // Render dynamic fields
  const renderFields = () => {
    return fields.map((field) => (
      <div  key={field.name} className="form-group">
        <label>{field.label}</label>
        {field.type === "dropdown" ? (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(e, field)}
          >
            <option value="">Select...</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(e, field)}
          />
        )}
        {errors[field.name] && <span className="error">{errors[field.name]}</span>}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Dynamic Form</h1>
      </header>
      <main>
        <div className="form-container">
          <label>Select Form Type</label>
          <select onChange={handleFormTypeChange} value={formType}>
            <option value="">Select...</option>
            <option value="User Information">User Information</option>
            <option value="Address Information">Address Information</option>
            <option value="Payment Information">Payment Information</option>
          </select>
          <form onSubmit={handleSubmit}>
            {renderFields()}
            {fields.length > 0 && (
              <>
                <progress value={progress} max="100"></progress>

                <button type="submit">Submit</button>
              </>
            )}
          </form>
        </div>
        {submittedData.length > 0 && (
          <div className="table-container">
            <h2>Submitted Data</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(submittedData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    {editingIndex === index ? (
                      Object.keys(data).map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            name={key}
                            value={editedData[key] || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                      ))
                    ) : (
                      Object.values(data).map((value, i) => <td key={i}>{value}</td>)
                    )}
                    <td>
                      {editingIndex === index ? (
                        <>
                        <div class="dropdown">
  <button className="dropbtn">:</button>
  <div className="dropdown-content">
    <a onClick={saveEdit}>Save</a>
    <a onClick={cancelEdit}>Cancel</a>

    
  </div>
</div>
<div  className='gap'>
                          <button onClick={saveEdit}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                           <div class="dropdown">
  <button className="dropbtn">:</button>
  <div className="dropdown-content">
    <a onClick={() => handleEdit(index)}>Edit</a>
    <a onClick={() => handleDelete(index)}>Delete</a>

    
  </div>
</div>
<div  className='gap'>
                          <button onClick={() => handleEdit(index)}>Edit</button>
                         
                          <button onClick={() => handleDelete(index)}>Delete</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer className="footer">
        <p> 2024 Dynamic Form Implementation</p>
      </footer>
    </div>
  );
}

export default App;



