const express = require("express");
const db = require("../db");
const { validateTicket, STATUSES, PRIORITIES } = require("../validators/ticket.validator");

const router = express.Router();

// Reject ids that are not positive integers
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: { message: "id must be a positive integer" } });
    return null;
  }
  return id;
}

// GET /api/tickets?status=OPEN&priority=HIGH
router.get("/", (req, res) => {
  const { status, priority } = req.query;
  const errors = [];
  if (status && !STATUSES.includes(status)) errors.push("invalid status filter");
  if (priority && !PRIORITIES.includes(priority)) errors.push("invalid priority filter");
  if (errors.length) return res.status(400).json({ error: { message: "Validation failed", details: errors } });

  let sql = "SELECT * FROM tickets WHERE 1=1";
  const params = [];
  if (status) { sql += " AND status = ?"; params.push(status); }
  if (priority) { sql += " AND priority = ?"; params.push(priority); }
  sql += " ORDER BY id DESC";

  res.json(db.prepare(sql).all(...params));
});

// GET /api/tickets/:id
router.get("/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  if (!ticket) return res.status(404).json({ error: { message: "Ticket not found" } });
  res.json(ticket);
});

// POST /api/tickets
router.post("/", (req, res) => {
  const errors = validateTicket(req.body);
  if (errors.length) return res.status(400).json({ error: { message: "Validation failed", details: errors } });

  const { title, description, status = "OPEN", priority = "MEDIUM" } = req.body;
  const result = db
    .prepare("INSERT INTO tickets (title, description, status, priority) VALUES (?, ?, ?, ?)")
    .run(title.trim(), description.trim(), status, priority);

  const created = db.prepare("SELECT * FROM tickets WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PATCH /api/tickets/:id
router.patch("/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const existing = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: { message: "Ticket not found" } });

  const errors = validateTicket(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ error: { message: "Validation failed", details: errors } });

  const title = req.body.title !== undefined ? req.body.title.trim() : existing.title;
  const description = req.body.description !== undefined ? req.body.description.trim() : existing.description;
  const status = req.body.status ?? existing.status;
  const priority = req.body.priority ?? existing.priority;

  db.prepare(
    "UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?, updatedAt = datetime('now') WHERE id = ?"
  ).run(title, description, status, priority, id);

  res.json(db.prepare("SELECT * FROM tickets WHERE id = ?").get(id));
});

// DELETE /api/tickets/:id
router.delete("/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const result = db.prepare("DELETE FROM tickets WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: { message: "Ticket not found" } });
  res.status(204).send();
});

module.exports = router;