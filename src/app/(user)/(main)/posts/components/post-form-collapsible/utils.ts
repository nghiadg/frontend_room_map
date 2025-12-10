import {
  FormSectionKey,
  PostFormValues,
  SECTION_FIELDS,
  REQUIRED_SECTION_FIELDS,
} from "./schema";
import { FieldErrors } from "react-hook-form";

export type SectionStatus = "valid" | "error" | "pending";

/**
 * Get the validation status of a form section.
 * - "valid": All required fields in the section are filled and have no errors
 * - "error": Section has validation errors
 * - "pending": Section has empty required fields but no errors shown yet
 */
export function getSectionStatus(
  sectionKey: FormSectionKey,
  errors: FieldErrors<PostFormValues>,
  values: PostFormValues
): SectionStatus {
  // Check if any field in this section has an error
  const allFieldNames = SECTION_FIELDS[sectionKey];
  const hasErrors = allFieldNames.some((fieldName) => !!errors[fieldName]);
  if (hasErrors) {
    return "error";
  }

  // Check if all REQUIRED fields are filled (excludes optional fields like terms)
  const requiredFieldNames = REQUIRED_SECTION_FIELDS[sectionKey];
  const allRequiredFieldsFilled = requiredFieldNames.every((fieldName) => {
    const value = values[fieldName];
    if (value === undefined || value === null || value === "") {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  });

  if (allRequiredFieldsFilled) {
    return "valid";
  }

  return "pending";
}
