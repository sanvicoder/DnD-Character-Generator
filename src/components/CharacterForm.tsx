import { useState } from "react";
import { CharacterInput } from "../types/character";
import "./CharacterForm.css";

type Props = {
  onGenerate: (data: CharacterInput) => void;
};

type ValidationErrors = {
  [key in keyof CharacterInput]?: string;
};

export default function CharacterForm({ onGenerate }: Props) {
  const [formData, setFormData] = useState<CharacterInput>({
    name: "",
    race: "",
    clazz: "",
    background: "",
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof CharacterInput]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name as keyof CharacterInput);
  };

  const validateField = (fieldName: keyof CharacterInput) => {
    let newErrors = { ...errors };
    
    switch (fieldName) {
      case "name":
        if (!formData.name.trim()) {
          newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          newErrors.name = undefined;
        }
        break;
      case "race":
        if (!formData.race.trim()) {
          newErrors.race = "Race is required";
        } else {
          newErrors.race = undefined;
        }
        break;
      case "clazz":
        if (!formData.clazz.trim()) {
          newErrors.clazz = "Class is required";
        } else {
          newErrors.clazz = undefined;
        }
        break;
      case "background":
        if (!formData.background.trim()) {
          newErrors.background = "Background is required";
        } else {
          newErrors.background = undefined;
        }
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[fieldName];
  };

  const validateForm = (): boolean => {
    let isValid = true;
    let newErrors: ValidationErrors = {};
    let newTouched = { ...touched };
    
    // Mark all fields as touched
    (Object.keys(formData) as Array<keyof CharacterInput>).forEach(key => {
      newTouched[key] = true;
      
      if (!formData[key].trim()) {
        newErrors[key] = `${getFieldLabel(key)} is required`;
        isValid = false;
      } else if (key === "name" && formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onGenerate(formData);
    }
  };

  const getFieldLabel = (field: string): string => {
    if (field === "clazz") return "Class";
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Create Your DnD Character</h2>

      {["name", "race", "clazz", "background"].map((field) => (
        <div className="form-group" key={field}>
          <label htmlFor={field} className="form-label">
            {getFieldLabel(field)}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched[field] && errors[field as keyof CharacterInput] ? "input-error" : ""}`}
            placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
          />
          {touched[field] && errors[field as keyof CharacterInput] && (
            <div className="error-message">{errors[field as keyof CharacterInput]}</div>
          )}
        </div>
      ))}

      <button 
        type="submit" 
        className="form-button"
        disabled={Object.values(errors).some(error => !!error)}
      >
        Generate Character
      </button>
    </form>
  );
}