const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

// partial = true is used for updates, where fields are optional
function validateTicket(body, { partial = false } = {}) {
  const errors = [];
  const { title, description, status, priority } = body || {};

  if (!partial || title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 100) {
      errors.push("title is required and must be 3-100 characters");
    }
  }

  if (!partial || description !== undefined) {
    if (typeof description !== "string" || description.trim().length < 10 || description.trim().length > 1000) {
      errors.push("description is required and must be 10-1000 characters");
    }
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`status must be one of: ${STATUSES.join(", ")}`);
  }

  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(", ")}`);
  }

  return errors;
}

module.exports = { validateTicket, STATUSES, PRIORITIES };