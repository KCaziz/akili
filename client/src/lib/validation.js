const NATIONAL_ID_REGEX = /^\d{18}$/;
const ALGERIAN_PHONE_REGEX = /^0[5-7]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Chaque validateur renvoie un code d'erreur (traduit ensuite via i18n avec
// `t(\`validation.${code}\`)`), jamais un texte brut, pour rester indépendant de la langue.

export function validateRequired(value) {
  if (!value || !value.trim()) return "required";
  return null;
}

export function validateNationalId(value) {
  if (!value || !value.trim()) return "required";
  if (!NATIONAL_ID_REGEX.test(value.trim())) return "invalidNationalId";
  return null;
}

export function validateAlgerianPhone(value) {
  if (!value || !value.trim()) return "required";
  if (!ALGERIAN_PHONE_REGEX.test(value.trim())) return "invalidPhone";
  return null;
}

export function validateEmail(value) {
  if (!value || !value.trim()) return "required";
  if (!EMAIL_REGEX.test(value.trim())) return "invalidEmail";
  return null;
}

export function validateContact(value) {
  if (!value || !value.trim()) return "required";
  if (!ALGERIAN_PHONE_REGEX.test(value.trim()) && !EMAIL_REGEX.test(value.trim())) return "invalidContact";
  return null;
}

// Exécute un set de { [champ]: code_erreur } et renvoie les codes non nuls.
export function runValidators(validators) {
  const errors = {};
  for (const [field, code] of Object.entries(validators)) {
    if (code) errors[field] = code;
  }
  return errors;
}
