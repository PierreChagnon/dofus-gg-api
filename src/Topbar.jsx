import "./styles.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <a href="https://www.dofus.com" className="topbar-logo">
        logo
      </a>
      <nav className="topbar-nav">
        <a href="https://www.dofus.com" className="active">
          Mon stuff
        </a>
        <a href="https://www.dofus.com">Builds</a>
        <a href="https://www.dofus.com">Nouveau</a>
      </nav>
    </header>
  );
}
