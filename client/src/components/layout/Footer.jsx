const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {currentYear} Akili Immobilier — Tous droits réservés.</p>
        <p className="footer-links">
          <a href="/contact">Contact</a> · <a href="/admin/connexion">Espace Admin</a>
        </p>
      </div>
    </footer>
  );
}
