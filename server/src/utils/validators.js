const NATIONAL_ID_REGEX = /^\d{18}$/;
const ALGERIAN_PHONE_REGEX = /^0[5-7]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmptyString(value, { maxLength = 2000 } = {}) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export function isValidNationalId(value) {
  return typeof value === "string" && NATIONAL_ID_REGEX.test(value.trim());
}

export function isValidAlgerianPhone(value) {
  return typeof value === "string" && ALGERIAN_PHONE_REGEX.test(value.trim());
}

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

// Le champ "contact" accepte un téléphone ou un e-mail.
export function isValidContact(value) {
  return isValidAlgerianPhone(value) || isValidEmail(value);
}
