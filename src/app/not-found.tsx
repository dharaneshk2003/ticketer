export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>404</h1>
        <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>Page not found</p>
        <a href="/" style={{ marginTop: "1rem", display: "inline-block", color: "#2563eb" }}>
          Go back home
        </a>
      </div>
    </div>
  );
}
