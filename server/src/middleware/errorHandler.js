export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route introuvable" });
}

export function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: isProd ? "Erreur interne du serveur" : err.message,
  });
}
