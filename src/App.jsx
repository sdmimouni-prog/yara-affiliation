import React, { useEffect, useState } from "react";
import {
  House,
  Link as LinkIcon,
  Bag,
  ChartBar,
  CreditCard,
  Image as ImageIcon,
  Gear,
  SignOut,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Copy,
  Eye,
  EyeSlash,
  Lock,
  Envelope,
  MagnifyingGlass,
  CaretDown,
  CaretRight,
  CheckCircle,
  Clock,
  Wallet,
  Coins,
  Info,
  Bank,
  DownloadSimple,
  List,
  X,
  Key,
  Trash,
  Check,
} from "@phosphor-icons/react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import catalog from "./catalog.json";
const money = (n) =>
  new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 2 }).format(n) +
  " DH";
const asset = (path) => import.meta.env.BASE_URL + path;
const nav = [
  ["overview", "Vue d’ensemble", House],
  ["links", "Mes liens", LinkIcon],
  ["orders", "Mes commandes", Bag],
  ["revenue", "Mes revenus", ChartBar],
  ["payments", "Paiements", CreditCard],
  ["products", "Produits et contenus", ImageIcon],
];
const authRoutes = ["login", "signup", "verify", "forgot", "reset"];
const allRoutes = [...authRoutes, ...nav.map((n) => n[0]), "account"];
const featured = catalog.filter((p) => p.gender === "femme" && p.price > 150);
const anania = featured[0];
const originalOrders = [
  {
    id: "YR-012",
    date: "20 sept. 2026",
    product: "ANANIA · 100 ml × 1",
    status: "À confirmer",
    commission: 90,
    state: "En attente",
  },
  {
    id: "YR-011",
    date: "19 sept. 2026",
    product: "ANANIA · 100 ml × 1",
    status: "Expédiée",
    commission: 90,
    state: "En attente",
  },
  {
    id: "YR-010",
    date: "14 sept. 2026",
    product: "ANANIA · 100 ml × 1",
    status: "Livrée",
    commission: 90,
    state: "Disponible",
  },
  {
    id: "YR-009",
    date: "12 sept. 2026",
    product: "ANANIA · 100 ml × 2",
    status: "Retour partiel",
    commission: 90,
    state: "Ajustée",
  },
  {
    id: "YR-008",
    date: "10 sept. 2026",
    product: "ANANIA · 100 ml × 1",
    status: "Annulée",
    commission: 0,
    state: "Annulée",
  },
];
const initialLinks = [
  {
    id: 1,
    name: "Ma boutique",
    destination: "Boutique YARA",
    url: "https://yara.vip/?ref=SARA",
    clicks: 720,
    orders: 7,
  },
  {
    id: 2,
    name: "ANANIA — Story Instagram",
    destination: "ANANIA · 100 ml",
    url: "https://yara.vip/" + anania.url + "&ref=SARA",
    clicks: 380,
    orders: 4,
  },
  {
    id: 3,
    name: "Mes favoris femme",
    destination: "Sélection · 3 produits",
    url: "https://yara.vip/?ref=SARA&selection=demo-femmes",
    clicks: 140,
    orders: 1,
  },
];
const go = (page) => {
  window.location.hash = page;
};
function Badge({ children }) {
  let cls = /Disponible|Livrée|Vérifié|actif|Payée/.test(children)
    ? "green"
    : /attente|Retour|traitement/.test(children)
      ? "amber"
      : /Annulée|Rejetée/.test(children)
        ? "red"
        : children === "Expédiée"
          ? "blue"
          : "gray";
  return <span className={"badge " + cls}>{children}</span>;
}
function Button({ children, secondary = false, ...props }) {
  return (
    <button className={secondary ? "button secondary" : "button"} {...props}>
      {children}
    </button>
  );
}
function Password({
  label,
  name = "password",
  minLength = 12,
  required = true,
}) {
  const [show, setShow] = useState(false);
  return (
    <label>
      {label}
      <span className="password">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={
            name === "current" ? "current-password" : "new-password"
          }
        />
        <button
          type="button"
          aria-label={
            show ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          onClick={() => setShow(!show)}
        >
          {show ? <EyeSlash /> : <Eye />}
        </button>
      </span>
    </label>
  );
}
function FormNotice({ children }) {
  return children ? (
    <p className="form-notice" role="status">
      {children}
    </p>
  ) : null;
}
function Footer() {
  return (
    <footer>
      <span>
        30 % après remise · Produits à plus de 150 DH avant remise · Hors
        livraison
      </span>
      <span>© YARA 2026</span>
    </footer>
  );
}
function DemoNote() {
  return (
    <p className="demo-note">
      Démonstration : utilisez des informations fictives. Aucun compte réel,
      e-mail ou virement n’est créé.
    </p>
  );
}
export function App() {
  return <DemoApp />;
}
function DemoApp() {
  const [route, setRoute] = useState(() =>
    allRoutes.includes(location.hash.slice(1))
      ? location.hash.slice(1)
      : "login",
  );
  const [toast, setToast] = useState("");
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState({
    first: "Sara",
    last: "",
    email: "sara@example.com",
    phone: "",
    social: "",
  });
  const [links, setLinks] = useState(initialLinks);
  const [payments, setPayments] = useState([]);
  const [productId, setProductId] = useState(anania.id);
  const [paymentAccount, setPaymentAccount] = useState(null);
  const reserved = payments.reduce((s, p) => s + p.amount, 0);
  const available = 900 - reserved;
  useEffect(() => {
    const fn = () => {
      setRoute(
        allRoutes.includes(location.hash.slice(1))
          ? location.hash.slice(1)
          : "login",
      );
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    document.title =
      (nav.find((n) => n[0] === route)?.[1] ||
        {
          login: "Connexion",
          signup: "Inscription",
          verify: "Vérification e-mail",
          forgot: "Mot de passe oublié",
          reset: "Nouveau mot de passe",
          account: "Mon compte",
        }[route]) + " · YARA Partenaires";
  }, [route]);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copié dans le presse-papiers.");
    } catch {
      setToast("Copie indisponible : sélectionnez le texte pour le copier.");
    }
  };
  const common = {
    profile,
    setProfile,
    setToast,
    copy,
    links,
    setLinks,
    available,
    reserved,
    payments,
    setPayments,
    productId,
    setProductId,
    paymentAccount,
    setPaymentAccount,
  };
  return (
    <>
      {authRoutes.includes(route) ? (
        <Auth route={route} {...common} />
      ) : (
        <div className="dashboard">
          <div className="mobile-bar">
            <button aria-label="Ouvrir le menu" onClick={() => setMenu(true)}>
              <List />
            </button>
            <span>YARA PARTENAIRES</span>
            <Badge>Démonstration</Badge>
          </div>
          {menu && (
            <button
              className="scrim"
              aria-label="Fermer le menu"
              onClick={() => setMenu(false)}
            />
          )}
          <aside className={"sidebar " + (menu ? "open" : "")}>
            <a className="brand" href="#overview">
              <img src={asset("assets/logo.webp")} alt="YARA" />
              <span>PARTENAIRES</span>
            </a>
            <button
              className="close-menu"
              aria-label="Fermer le menu"
              onClick={() => setMenu(false)}
            >
              <X />
            </button>
            <nav aria-label="Navigation principale">
              {nav.map(([id, title, Icon]) => (
                <a
                  key={id}
                  href={"#" + id}
                  className={route === id ? "active" : ""}
                  aria-current={route === id ? "page" : undefined}
                >
                  <Icon size={27} />
                  {title}
                </a>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="identity">
                <span className="avatar">
                  {profile.first.slice(0, 1)}
                  {profile.last.slice(0, 1) || "A"}
                </span>
                <div>
                  {profile.first}
                  <small>Partenaire YARA</small>
                </div>
              </div>
              <a
                href="#account"
                className={route === "account" ? "active" : ""}
              >
                <Gear />
                Mon compte
              </a>
              <a href="#login">
                <SignOut />
                Déconnexion
              </a>
              <p className="motto">
                Votre influence.
                <br />
                Vos revenus.
              </p>
            </div>
          </aside>
          <main className="workspace" data-page={route}>
            <header className="topbar">
              <span>
                Espace influenceur <span className="slash">/</span>{" "}
                <strong>
                  {route === "account"
                    ? "Mon compte"
                    : nav.find((n) => n[0] === route)?.[1]}
                </strong>
              </span>
              <div>
                <span className="demo-badge">Données de démonstration</span>
                <a href="https://yara.vip/" target="_blank" rel="noreferrer">
                  Voir la boutique <ArrowUpRight />
                </a>
              </div>
            </header>
            {route === "overview" && <Overview {...common} />}{" "}
            {route === "links" && <Links {...common} />}{" "}
            {route === "orders" && <Orders />}{" "}
            {route === "revenue" && <Revenue {...common} />}{" "}
            {route === "payments" && <Payments {...common} />}{" "}
            {route === "products" && <Products {...common} />}{" "}
            {route === "account" && <Account {...common} />}
            <Footer />
          </main>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle />
          {toast}
        </div>
      )}
    </>
  );
}
function Auth({ route, profile, setProfile, setToast }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setMessage("");
    setSent(false);
    setDone(false);
  }, [route]);
  function submit(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (route === "signup") {
      if (!socialValid(d.social)) {
        setMessage(
          "Ajoutez un lien de profil Instagram, TikTok ou YouTube valide.",
        );
        return;
      }
      setProfile({
        first: d.first,
        last: d.last,
        email: d.email,
        phone: d.phone,
        social: d.social,
      });
      go("verify");
    }
    if (route === "login") {
      go("overview");
      setToast(
        "Espace de démonstration ouvert. Aucune authentification réelle.",
      );
    }
    if (route === "forgot") {
      setSent(true);
    }
    if (route === "reset") {
      if (d.password !== d.confirm) {
        setMessage("Les deux mots de passe doivent être identiques.");
        return;
      }
      setDone(true);
    }
  }
  const title =
    route === "login"
      ? "Heureux de vous retrouver"
      : route === "signup"
        ? "Votre influence mérite de rayonner."
        : route === "verify"
          ? "Vérifiez votre adresse e-mail"
          : route === "forgot"
            ? sent
              ? "Consultez votre messagerie"
              : "Mot de passe oublié ?"
            : done
              ? "Mot de passe mis à jour"
              : "Nouveau mot de passe";
  return (
    <main className="auth" data-page={route}>
      <section
        className="auth-hero"
        aria-label="Influenceuse présentant un parfum YARA"
      >
        <img
          className="hero-photo"
          src={asset("assets/influencer.png")}
          alt="Influenceuse présentant le parfum ANANIA YARA"
        />
        <a className="brand auth-brand" href="#login">
          <img src={asset("assets/logo.webp")} alt="YARA" />
          <span>PARTENAIRES</span>
        </a>
        <div className="commission-badge">
          <strong>
            30 % de
            <br />
            commission
          </strong>
          <small>Sur les produits éligibles</small>
        </div>
        <div className="hero-copy">
          <h1>
            Votre influence.
            <br />
            Vos revenus.
          </h1>
          <span className="gold-line" />
          <p>
            Partagez vos coups de cœur. Récoltez les fruits de votre influence.
          </p>
        </div>
      </section>
      <section className={"auth-panel " + (route === "signup" ? "signup" : "")}>
        <a
          className="store-link"
          href="https://yara.vip/"
          target="_blank"
          rel="noreferrer"
        >
          Retour à la boutique <ArrowUpRight />
        </a>
        <div className="auth-content">
          {route === "login" && <a className="static-demo-entry" href="#overview">Ouvrir la démo sans compte →</a>}
          {!["login", "signup"].includes(route) && (
            <span className="large-icon">
              {route === "verify" || sent ? (
                <Envelope />
              ) : done ? (
                <CheckCircle />
              ) : (
                <Lock />
              )}
            </span>
          )}
          <p className="eyebrow">ESPACE INFLUENCEUR</p>
          <h2>{title}</h2>
          <p className="auth-subtitle">
            {route === "login" ? (
              "Connectez-vous pour suivre vos ventes et vos commissions."
            ) : route === "signup" ? (
              "Rejoignez les partenaires YARA et partagez vos coups de cœur."
            ) : route === "verify" ? (
              <>
                Un lien d’activation sera envoyé à{" "}
                <strong>{profile.email}</strong>.
              </>
            ) : route === "forgot" ? (
              sent ? (
                "Si un compte correspond à cette adresse, un lien de réinitialisation sera envoyé."
              ) : (
                "Saisissez l’adresse e-mail de votre compte pour recevoir un lien de réinitialisation."
              )
            ) : done ? (
              "Simulation terminée. Vous pouvez revenir à la connexion."
            ) : (
              "Choisissez un nouveau mot de passe pour retrouver votre espace influenceur."
            )}
          </p>
          {!sent && !done && route !== "verify" && (
            <form onSubmit={submit} key={route}>
              {route === "signup" && (
                <div className="two-fields">
                  <label>
                    Prénom
                    <input name="first" required autoComplete="given-name" />
                  </label>
                  <label>
                    Nom
                    <input name="last" required autoComplete="family-name" />
                  </label>
                </div>
              )}
              {route !== "reset" && (
                <label>
                  Adresse e-mail
                  <input
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    required
                    autoComplete="email"
                  />
                </label>
              )}
              {route === "signup" && (
                <>
                  <label>
                    Téléphone
                    <span className="phone">
                      <span>+212</span>
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="Votre numéro"
                      />
                    </span>
                  </label>
                  <label>
                    Lien Instagram, TikTok ou YouTube
                    <input
                      name="social"
                      type="url"
                      required
                      placeholder="https://www.instagram.com/votreprofil"
                    />
                    <small>Un lien vers au moins un de vos profils.</small>
                  </label>
                </>
              )}
              {["login", "signup", "reset"].includes(route) && (
                <>
                  <Password
                    label={
                      route === "reset"
                        ? "Nouveau mot de passe"
                        : "Mot de passe"
                    }
                    minLength={route === "login" ? 1 : 12}
                  />
                  {route !== "login" && <small>12 caractères minimum.</small>}
                </>
              )}
              {route === "reset" && (
                <Password label="Confirmer le mot de passe" name="confirm" />
              )}
              {route === "login" && (
                <div className="form-split">
                  <label className="check">
                    <input type="checkbox" />
                    Se souvenir de moi
                  </label>
                  <a href="#forgot">Mot de passe oublié ?</a>
                </div>
              )}
              {route === "signup" && (
                <label className="check">
                  <input type="checkbox" required />
                  J’accepte les règles du programme d’affiliation YARA.
                </label>
              )}
              <FormNotice>{message}</FormNotice>
              <Button type="submit">
                {route === "login"
                  ? "Se connecter"
                  : route === "signup"
                    ? "Créer mon compte"
                    : route === "forgot"
                      ? "Envoyer le lien"
                      : "Enregistrer le mot de passe"}
                <ArrowRight />
              </Button>
            </form>
          )}
          {route === "verify" && (
            <>
              <p>Cliquez sur le lien reçu pour activer votre compte.</p>
              <Button
                onClick={() =>
                  setMessage(
                    "Simulation : lien renvoyé. Aucun e-mail réel n’a été envoyé.",
                  )
                }
              >
                Renvoyer l’e-mail
              </Button>
              <a className="center-link" href="#signup">
                Modifier mon adresse e-mail
              </a>
              <Button
                secondary
                onClick={() => {
                  go("overview");
                  setToast("Vérification simulée.");
                }}
              >
                Simuler la vérification
              </Button>
              <FormNotice>{message}</FormNotice>
            </>
          )}
          {route === "forgot" && sent && (
            <>
              <Button
                secondary
                onClick={() => {
                  setMessage(
                    "Simulation : demande renouvelée. Aucun e-mail réel n’a été envoyé.",
                  );
                }}
              >
                Renvoyer le lien
              </Button>
              <a className="center-link" href="#reset">
                Tester la réinitialisation en démo
              </a>
              <FormNotice>{message}</FormNotice>
            </>
          )}
          {route === "reset" && done && (
            <Button onClick={() => go("login")}>Retour à la connexion</Button>
          )}
          {route === "login" ? (
            <p className="auth-switch">
              Pas encore de compte ? <a href="#signup">Créer mon compte</a>
            </p>
          ) : (
            <a className="auth-switch center-link" href="#login">
              <ArrowLeft />
              Retour à la connexion
            </a>
          )}
          <DemoNote />
        </div>
        <div className="auth-footer">
          <Lock size={14} /> Connexion sécurisée<span>© YARA 2026</span>
        </div>
      </section>
    </main>
  );
}
function PageTitle({ title, subtitle, children }) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
function CopyLine({ text, copy }) {
  return (
    <div className="copy-line">
      <input aria-label="Lien à partager" value={text} readOnly />
      <Button onClick={() => copy(text)}>
        <Copy />
        Copier
      </Button>
    </div>
  );
}
function Period({ value, onChange }) {
  return (
    <select
      aria-label="Période"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="month">1–20 septembre 2026</option>
      <option value="recent">19–20 septembre 2026</option>
    </select>
  );
}
function Overview({ profile, available, reserved, copy, setProductId }) {
  const [period, setPeriod] = useState("month");
  return (
    <>
      <PageTitle
        title={
          <>
            Bonjour {profile.first},<br />
            Votre influence prend vie.
          </>
        }
        subtitle="Suivez vos résultats et partagez votre prochain coup de cœur."
      >
        <div className="heading-actions">
          <Button onClick={() => go("links")}>
            <LinkIcon />
            Créer un lien
          </Button>
          <Period value={period} onChange={setPeriod} />
        </div>
      </PageTitle>
      <div className="kpi-strip">
        {[
          ["Clics", period === "month" ? "1 240" : "240"],
          ["Commandes attribuées", period === "month" ? "12" : "2"],
          ["Ventes attribuées", period === "month" ? "3 600 DH" : "600 DH"],
          ["Commissions générées", period === "month" ? "1 080 DH" : "180 DH"],
        ].map(([a, b]) => (
          <div key={a}>
            <span>{a}</span>
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <div className="grid overview-grid">
        <section className="card">
          <h2>
            Mes commissions <Info size={20} />
          </h2>
          <p className="muted">Solde disponible</p>
          <div className="big-amount">{money(available)}</div>
          <p>Disponibles</p>
          <div className="mini-stats">
            <div>
              En attente<strong>180 DH</strong>
            </div>
            <div>
              Réservées<strong>{money(reserved)}</strong>
            </div>
            <div>
              Payées<strong>0 DH</strong>
            </div>
          </div>
          <Button onClick={() => go("payments")} disabled={available < 500}>
            Demander un paiement
          </Button>
          <small className="center">
            Dès 500 DH · Virement traité sous 48 h
          </small>
          <small>
            Disponibles après livraison, encaissement et 96 h sans retour.
          </small>
        </section>
        <section className="card">
          <h2>Mon lien boutique</h2>
          <p className="muted">Un lien à partager sur tous vos réseaux.</p>
          <CopyLine text="https://yara.vip/?ref=SARA" copy={copy} />
          <p className="muted">
            Code partenaire : <strong>SARA</strong>
          </p>
          <a className="orange" href="#links">
            Voir mes liens <ArrowRight />
          </a>
        </section>
        <section className="card">
          <div className="section-heading">
            <h2>Dernières commandes</h2>
            <a href="#orders">
              Tout voir <ArrowRight />
            </a>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {originalOrders.slice(0, 3).map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.date.slice(0, 8)}</td>
                    <td>
                      <Badge>{o.status}</Badge>
                    </td>
                    <td>{money(o.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <small>Les coordonnées des clients restent confidentielles.</small>
        </section>
        <section className="card">
          <h2>À partager aujourd’hui</h2>
          <div className="featured-product">
            <img src={asset(anania.image)} alt="Parfum ANANIA" />
            <div>
              <strong>ANANIA · 100 ml</strong>
              <h3>300 DH</h3>
              <p className="orange">90 DH de commission</p>
              <button
                className="text-button"
                onClick={() => {
                  setProductId(anania.id);
                  go("products");
                }}
              >
                Voir le produit et son script <ArrowRight />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
function Links({ links, setLinks, copy, setToast }) {
  const [type, setType] = useState("Produit"),
    [id, setId] = useState(anania.id),
    [selected, setSelected] = useState([anania.id]),
    [name, setName] = useState("ANANIA — Story Instagram"),
    [search, setSearch] = useState("");
  function generate(e) {
    e.preventDefault();
    if (type === "Sélection" && !selected.length) {
      setToast("Choisissez au moins un produit.");
      return;
    }
    const p = catalog.find((p) => p.id === id);
    const token = "demo-" + Date.now().toString(36);
    const url =
      type === "Boutique"
        ? "https://yara.vip/?ref=SARA&campaign=" + token
        : type === "Produit"
          ? "https://yara.vip/" + p.url + "&ref=SARA&campaign=" + token
          : "https://yara.vip/?ref=SARA&selection=" + token;
    setLinks((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        url,
        destination:
          type === "Boutique"
            ? "Boutique YARA"
            : type === "Produit"
              ? p.name
              : type + " · " + selected.length + " produits",
        clicks: 0,
        orders: 0,
      },
      ...prev,
    ]);
    setToast(
      "Lien de démonstration créé. Le suivi sera branché à l’étape suivante.",
    );
  }
  return (
    <>
      <PageTitle
        title="Mes liens"
        subtitle="Créez votre lien. Partagez vos coups de cœur."
      />
      <div className="grid two-columns">
        <section className="card">
          <h2>Créer un lien</h2>
          <p className="muted">Choisissez ce que vous souhaitez promouvoir.</p>
          <div className="tabs" role="group" aria-label="Type de lien">
            {["Boutique", "Produit", "Sélection"].map((t) => (
              <button
                key={t}
                className={type === t ? "selected" : ""}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <form onSubmit={generate}>
            {type === "Produit" && (
              <label>
                Produit à partager
                <select value={id} onChange={(e) => setId(e.target.value)}>
                  {catalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.size}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {type === "Sélection" && (
              <fieldset className="selection-list">
                <legend>Produits de votre sélection</legend>
                {featured.map((p) => (
                  <label className="check" key={p.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked
                            ? [...s, p.id]
                            : s.filter((x) => x !== p.id),
                        )
                      }
                    />
                    {p.name} · {p.size}
                  </label>
                ))}
              </fieldset>
            )}
            <label>
              Nom du lien
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
              />
              <small>Un nom pour retrouver vos campagnes facilement.</small>
            </label>
            <Button type="submit">Générer mon lien</Button>
          </form>
        </section>
        <section className="card">
          <h2>Mon code partenaire</h2>
          <div className="big-amount code">SARA</div>
          <Button secondary onClick={() => copy("SARA")}>
            <Copy />
            Copier le code
          </Button>
          <p className="muted">À saisir lors de la commande.</p>
          <div className="rule-block">
            <Info />
            <div>
              <h3>Comment ça fonctionne ?</h3>
              <p>Le code saisi est prioritaire sur un lien.</p>
              <p>
                Sans code, le dernier lien éligible cliqué est retenu pendant 30
                jours.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="card section-gap">
        <div className="section-heading">
          <h2>Mes liens créés</h2>
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un lien"
          />
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Nom du lien",
                  "Destination",
                  "Clics",
                  "Commandes",
                  "Actions",
                ].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links
                .filter((l) =>
                  l.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((l) => (
                  <tr key={l.id}>
                    <td>
                      {l.name}
                      {l.id === 1 && (
                        <small className="url-preview">{l.url}</small>
                      )}
                    </td>
                    <td>{l.destination}</td>
                    <td>{l.clicks}</td>
                    <td>{l.orders}</td>
                    <td>
                      <div className="row-actions">
                        <Button secondary onClick={() => copy(l.url)}>
                          <Copy />
                          Copier
                        </Button>
                        <a
                          className="icon-button"
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={"Ouvrir " + l.name}
                        >
                          <ArrowUpRight />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!links.some((l) =>
            l.name.toLowerCase().includes(search.toLowerCase()),
          ) && (
            <p className="empty">Aucun lien ne correspond à votre recherche.</p>
          )}
        </div>
        <small>
          Liens de démonstration : attribution et sélections non connectées à la
          boutique.
        </small>
      </section>
    </>
  );
}
function Search({ value, onChange, placeholder }) {
  return (
    <label className="search">
      <MagnifyingGlass />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Orders() {
  const [period, setPeriod] = useState("month");
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("Tous les statuts"),
    [state, setState] = useState("Toutes les commissions"),
    [open, setOpen] = useState("YR-010");
  const orders = originalOrders.filter(
    (o) =>
      (period === "month" || ["YR-012", "YR-011"].includes(o.id)) &&
      o.id.toLowerCase().includes(search.toLowerCase()) &&
      (status === "Tous les statuts" || o.status === status) &&
      (state === "Toutes les commissions" || o.state === state),
  );
  const selected = orders.find((o) => o.id === open);
  return (
    <>
      <PageTitle
        title="Mes commandes"
        subtitle="Suivez vos ventes et les commissions associées."
      >
        <Period value={period} onChange={setPeriod} />
      </PageTitle>
      <div className="info-banner">
        <Info />
        Une commission devient disponible après livraison et encaissement, une
        fois les 96 h de retour écoulées.
      </div>
      <div className="filters">
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Rechercher une référence"
        />
        <select
          aria-label="Statut commande"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            "Tous les statuts",
            ...new Set(originalOrders.map((o) => o.status)),
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="État commission"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          {[
            "Toutes les commissions",
            ...new Set(originalOrders.map((o) => o.state)),
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <section className="card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Référence / Date",
                  "Produits",
                  "Statut commande",
                  "Commission",
                  "État commission",
                  "",
                ].map((t, i) => (
                  <th key={i}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr className={open === o.id ? "highlight" : ""} key={o.id}>
                  <td>
                    #{o.id}
                    <small>{o.date}</small>
                  </td>
                  <td>{o.product}</td>
                  <td>
                    <Badge>{o.status}</Badge>
                  </td>
                  <td>{money(o.commission)}</td>
                  <td>
                    <Badge>{o.state}</Badge>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={"Détail " + o.id}
                      aria-expanded={open === o.id}
                      onClick={() => setOpen(open === o.id ? "" : o.id)}
                    >
                      {open === o.id ? <CaretDown /> : <CaretRight />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders.length && (
          <p className="empty">Aucune commande ne correspond à ces filtres.</p>
        )}
        {selected && (
          <div className="order-detail">
            <h3>Détail de la commande #{selected.id}</h3>
            <div className="mini-stats">
              <div>
                Produits éligibles après remise
                <strong>{money(selected.commission / 0.3)}</strong>
              </div>
              <div>
                Taux de commission<strong>30 %</strong>
              </div>
              <div>
                Votre commission
                <strong className="orange">{money(selected.commission)}</strong>
              </div>
            </div>
            {selected.state === "Disponible" ? (
              <div className="timeline">
                {[
                  "Livrée le 15 sept.",
                  "Encaissement confirmé",
                  "Disponible depuis le 19 sept.",
                ].map((t) => (
                  <div key={t}>
                    <CheckCircle weight="fill" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">
                {selected.status === "Retour partiel"
                  ? "Un article retourné sur deux : commission ajustée de 180 DH à 90 DH."
                  : selected.status === "Annulée"
                    ? "Commande annulée : aucune commission."
                    : "Commission en attente de livraison, d’encaissement et de la fin du délai de retour de 96 h."}
              </p>
            )}
            <small>Livraison exclue du calcul.</small>
          </div>
        )}
        <div className="privacy-note">
          <Lock />
          <small>
            Les coordonnées personnelles des clients restent confidentielles.
          </small>
          <Info />
          <small>
            Annulation ou retour : commission annulée ou ajustée au prorata.
          </small>
        </div>
      </section>
    </>
  );
}
function BalanceCards({ available, reserved }) {
  return (
    <div className="balance-cards">
      {[
        [Coins, "Disponibles", available, "Prêts à être demandés"],
        [Clock, "En attente", 180, "Livraison ou délai de retour en cours"],
        [Lock, "Réservées", reserved, "Demandes de paiement en cours"],
        [Check, "Payées", 0, "Virements effectués"],
      ].map(([Icon, title, value, help], i) => (
        <section key={title} className={"card balance " + (!i ? "accent" : "")}>
          <span className="large-icon">
            <Icon />
          </span>
          <div>
            <span>{title}</span>
            <strong>{money(value)}</strong>
            <small>{help}</small>
          </div>
        </section>
      ))}
    </div>
  );
}
function Revenue({ available, reserved, payments }) {
  const [filter, setFilter] = useState("Tous les mouvements"),
    [showAll, setShowAll] = useState(false);
  const rows = [
    ...payments.map((p) => [
      p.date,
      p.id,
      "Demande de paiement",
      p.amount,
      "Disponible → Réservé",
    ]),
    [
      "20 sept. 2026",
      "YR-012",
      "Commission enregistrée",
      90,
      "En attente +90 DH",
    ],
    [
      "19 sept. 2026",
      "YR-010",
      "Commission disponible",
      90,
      "En attente → Disponible",
    ],
    [
      "19 sept. 2026",
      "YR-011",
      "Commission enregistrée",
      90,
      "En attente +90 DH",
    ],
    ["18 sept. 2026", "YR-009", "Retour partiel", -90, "Commission ajustée"],
  ];
  return (
    <>
      <PageTitle
        title="Mes revenus"
        subtitle="Comprenez votre solde et suivez vos commissions."
      />
      <BalanceCards available={available} reserved={reserved} />
      <div className="grid equal-columns section-gap">
        <section className="card">
          <h2>Votre prochain paiement</h2>
          <div className="payout-highlight">
            <Wallet />
            <div>
              <strong>{money(available)}</strong> disponibles
              <p className={available >= 500 ? "green-text" : "muted"}>
                {available >= 500 ? (
                  <>
                    <CheckCircle />
                    Seuil de 500 DH atteint
                  </>
                ) : (
                  <>Encore {money(500 - available)} pour atteindre le seuil.</>
                )}
              </p>
              <Button disabled={available < 500} onClick={() => go("payments")}>
                Demander un paiement
              </Button>
              <small>
                Virement bancaire traité par YARA sous 48 h après la demande.
              </small>
            </div>
          </div>
          <a href="#payments">
            Voir mes paiements <ArrowRight />
          </a>
        </section>
        <section className="card">
          <h2>Quand mes revenus sont-ils disponibles ?</h2>
          <ol className="conditions">
            <li>
              <strong>Commande livrée</strong>
              <small>Le client a bien reçu sa commande.</small>
            </li>
            <li>
              <strong>Encaissement confirmé</strong>
              <small>Le paiement du client est encaissé par YARA.</small>
            </li>
            <li>
              <strong>96 h écoulées depuis la livraison, sans retour</strong>
              <small>La commission peut alors être demandée.</small>
            </li>
          </ol>
          <small className="border-top">
            Les articles annulés ou retournés sont déduits au prorata.
          </small>
        </section>
      </div>
      <section className="card section-gap">
        <div className="section-heading">
          <div>
            <h2>Derniers mouvements</h2>
            <small>Les passages de statut ne sont pas de nouveaux gains.</small>
          </div>
          <select
            aria-label="Filtrer les mouvements"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {[
              "Tous les mouvements",
              "Commission enregistrée",
              "Commission disponible",
              "Retour partiel",
              "Demande de paiement",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Date",
                  "Référence",
                  "Mouvement",
                  "Montant",
                  "Effet sur le solde",
                ].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows
                .filter(
                  (r) => filter === "Tous les mouvements" || r[2] === filter,
                )
                .map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td>#{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{money(r[3])}</td>
                    <td>
                      <Badge>{r[4]}</Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!rows.some(
            (r) => filter === "Tous les mouvements" || r[2] === filter,
          ) && <p className="empty">Aucun mouvement de ce type.</p>}
        </div>
        <button className="text-button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Réduire l’historique" : "Voir tout l’historique"}
          <ArrowRight />
        </button>
        {showAll && (
          <p className="muted">
            Tous les mouvements de cette démonstration sont affichés.
            L’historique réel sera alimenté par les commandes.
          </p>
        )}
      </section>
    </>
  );
}
function Payments({
  available,
  reserved,
  payments,
  setPayments,
  paymentAccount,
  setPaymentAccount,
  setToast,
}) {
  const [amount, setAmount] = useState(available >= 500 ? available : 500),
    [holder, setHolder] = useState(paymentAccount?.holder || ""),
    [bank, setBank] = useState(paymentAccount?.bank || ""),
    [rib, setRib] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [error, setError] = useState("");
  const valid =
    available >= 500 &&
    Number(amount) >= 500 &&
    Number(amount) <= available &&
    holder.trim() &&
    bank &&
    /^\d{24}$/.test(rib.replace(/\s/g, "")) &&
    confirmed;
  function submit(e) {
    e.preventDefault();
    if (!valid) {
      setError(
        "Vérifiez le montant et le RIB (24 chiffres), puis confirmez les coordonnées.",
      );
      return;
    }
    const p = {
      id: "PAY-DEMO-" + (payments.length + 1).toString().padStart(3, "0"),
      amount: Number(amount),
      date: new Date().toLocaleDateString("fr-FR"),
      status: "En traitement",
      reference: "En attente de virement",
    };
    setPayments((prev) => [p, ...prev]);
    setPaymentAccount({ holder, bank });
    setRib("");
    setConfirmed(false);
    setError("");
    setToast(
      "Demande simulée : " +
        money(Number(amount)) +
        " réservés. Aucun virement réel.",
    );
  }
  return (
    <>
      <PageTitle
        title="Demander un paiement"
        subtitle="Recevez vos commissions par virement bancaire."
      />
      <div className="payment-balances">
        {[
          ["Disponible", available],
          ["En cours de paiement", reserved],
          ["Déjà payé", 0],
        ].map(([t, n]) => (
          <div className="card" key={t}>
            <span className="large-icon">
              {t === "Disponible" ? (
                <Coins />
              ) : t === "Déjà payé" ? (
                <Check />
              ) : (
                <Clock />
              )}
            </span>
            <div>
              <small>{t}</small>
              <strong>{money(n)}</strong>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit}>
        <div className="grid two-columns section-gap">
          <section className="card">
            <h2>Votre demande</h2>
            <label>
              Montant à demander
              <span className="amount-input">
                <input
                  type="number"
                  min="500"
                  max={Math.max(available, 500)}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <span>DH</span>
              </span>
              <span className="form-split">
                <small>Minimum 500 DH · Maximum {money(available)}</small>
                <button
                  type="button"
                  className="text-button"
                  disabled={available < 500}
                  onClick={() => setAmount(available)}
                >
                  Tout demander
                </button>
              </span>
            </label>
            <div className="border-top">
              <h3>Coordonnées bancaires</h3>
              <label>
                Titulaire du compte
                <input
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  placeholder="Nom et prénom du titulaire"
                  required
                  autoComplete="off"
                />
              </label>
              <label>
                Banque
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                >
                  <option value="">Sélectionner votre banque</option>
                  {[
                    "Attijariwafa bank",
                    "Banque Populaire",
                    "Bank of Africa",
                    "CIH Bank",
                    "Crédit Agricole du Maroc",
                    "Al Barid Bank",
                    "Autre banque",
                  ].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label>
                RIB
                <input
                  value={rib}
                  onChange={(e) => setRib(e.target.value)}
                  inputMode="numeric"
                  placeholder="24 chiffres fictifs pour la démonstration"
                  required
                  maxLength={32}
                  autoComplete="off"
                />
                <small>
                  24 chiffres. Utilisez uniquement des coordonnées fictives ici.
                </small>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                Je confirme que ces coordonnées bancaires sont exactes.
              </label>
            </div>
          </section>
          <section className="card">
            <h2>Récapitulatif</h2>
            <dl className="recap">
              <div>
                <dt>Montant demandé</dt>
                <dd>{money(Number(amount) || 0)}</dd>
              </div>
              <div>
                <dt>Solde restant après demande</dt>
                <dd>{money(Math.max(0, available - (Number(amount) || 0)))}</dd>
              </div>
            </dl>
            <div className="rule-block">
              <Clock />
              <div>
                <h3>Traitement sous 48 h</h3>
                <small>
                  YARA effectue le virement manuellement après votre demande.
                </small>
              </div>
            </div>
            <div className="info-banner">
              <Info />
              Les {money(Number(amount) || 0)} seront réservés pendant le
              traitement de votre demande.
            </div>
            <Button type="submit" disabled={!valid}>
              Confirmer ma demande
            </Button>
            <small className="center">
              {available < 500
                ? "Le solde disponible doit atteindre 500 DH."
                : !valid
                  ? "Complétez vos coordonnées pour continuer."
                  : "La demande sera simulée dans cette démonstration."}
            </small>
            <FormNotice>{error}</FormNotice>
            <small className="border-top">
              La référence du virement apparaîtra dans votre historique après
              paiement.
            </small>
            <DemoNote />
          </section>
        </div>
      </form>
      <section className="card section-gap">
        <h2>Historique des paiements</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {["Date", "Montant", "Statut", "Référence du virement"].map(
                  (t) => (
                    <th key={t}>{t}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.date}
                    <small>{p.id}</small>
                  </td>
                  <td>{money(p.amount)}</td>
                  <td>
                    <Badge>{p.status}</Badge>
                  </td>
                  <td>{p.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!payments.length && (
          <div className="empty">
            <Wallet size={40} />
            <p>Aucune demande pour le moment</p>
            <small>
              Vos demandes et leurs références de paiement apparaîtront ici.
            </small>
          </div>
        )}
      </section>
    </>
  );
}
const socialValid = (s) => {
  try {
    const u = new URL(s);
    return (
      ["https:", "http:"].includes(u.protocol) &&
      [
        "instagram.com",
        "www.instagram.com",
        "tiktok.com",
        "www.tiktok.com",
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
      ].includes(u.hostname) &&
      u.pathname.length > 1
    );
  } catch {
    return false;
  }
};
function Account({ profile, setProfile, setToast }) {
  const [error, setError] = useState(""),
    [editEmail, setEditEmail] = useState(false);
  function update(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (!socialValid(d.social)) {
      setError(
        "Indiquez un lien de profil Instagram, TikTok ou YouTube valide.",
      );
      return;
    }
    if (d.email !== profile.email) {
      setToast(
        "Modification simulée. Une vérification de la nouvelle adresse sera requise en production.",
      );
    } else {
      setToast("Profil de démonstration enregistré.");
    }
    setProfile(d);
    setError("");
    setEditEmail(false);
  }
  function password(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (d.password !== d.confirm) {
      setToast("Les deux nouveaux mots de passe doivent être identiques.");
      return;
    }
    e.currentTarget.reset();
    setToast("Modification simulée. Aucun mot de passe n’est conservé.");
  }
  return (
    <>
      <PageTitle
        title="Mon compte"
        subtitle="Gérez votre profil et la sécurité de votre compte."
      />
      <div className="card profile-header">
        <span className="avatar">
          {profile.first[0]}
          {profile.last[0] || "A"}
        </span>
        <div>
          <h3>{profile.first}</h3>
          <small>Partenaire YARA</small>
        </div>
        <Badge>Compte actif</Badge>
        <Badge>E-mail vérifié</Badge>
      </div>
      <div className="grid two-columns section-gap">
        <section className="card">
          <h2>Informations personnelles</h2>
          <form onSubmit={update}>
            <div className="two-fields">
              <label>
                Prénom
                <input name="first" defaultValue={profile.first} required />
              </label>
              <label>
                Nom
                <input
                  name="last"
                  defaultValue={profile.last}
                  placeholder="Votre nom"
                  required
                />
              </label>
            </div>
            <label>
              Adresse e-mail
              <div className="copy-line">
                <input
                  name="email"
                  defaultValue={profile.email}
                  type="email"
                  readOnly={!editEmail}
                  required
                />
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setEditEmail(!editEmail)}
                >
                  {editEmail ? "Terminer" : "Modifier"}
                </button>
              </div>
              <small>Toute nouvelle adresse doit être vérifiée.</small>
            </label>
            <label>
              Téléphone
              <span className="phone">
                <span>+212</span>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone}
                  placeholder="Votre numéro"
                  required
                />
              </span>
            </label>
            <div className="border-top">
              <h3>Votre présence sur les réseaux</h3>
              <label>
                Lien Instagram, TikTok ou YouTube *
                <input
                  name="social"
                  defaultValue={profile.social}
                  type="url"
                  required
                  placeholder="Collez le lien de votre profil"
                />
                <small>
                  Un lien vers au moins un de vos comptes est obligatoire.
                </small>
              </label>
            </div>
            <FormNotice>{error}</FormNotice>
            <Button type="submit">Enregistrer les modifications</Button>
          </form>
          <DemoNote />
        </section>
        <div className="stack">
          <section className="card">
            <h2>
              <Lock />
              Sécurité
            </h2>
            <p className="muted">
              Choisissez un mot de passe unique pour votre compte.
            </p>
            <form onSubmit={password}>
              <Password
                label="Mot de passe actuel"
                name="current"
                minLength={1}
              />
              <Password label="Nouveau mot de passe" />
              <Password
                label="Confirmer le nouveau mot de passe"
                name="confirm"
              />
              <small>12 caractères minimum.</small>
              <Button secondary type="submit">
                Mettre à jour le mot de passe
              </Button>
            </form>
          </section>
          <section className="card">
            <h2>
              <Bank />
              Coordonnées de paiement
            </h2>
            <p className="muted">
              Retrouvez votre RIB et vos demandes dans la rubrique Paiements.
            </p>
            <a href="#payments">
              Gérer mes coordonnées bancaires <ArrowRight />
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
function Products({ productId, setProductId, copy, setToast }) {
  const [gender, setGender] = useState("femme"),
    [eligible, setEligible] = useState(true),
    [search, setSearch] = useState(""),
    [tab, setTab] = useState("Script"),
    [format, setFormat] = useState("Reel / TikTok · 20 s"),
    [lang, setLang] = useState("Français"),
    [expanded, setExpanded] = useState(false);
  const product = catalog.find((p) => p.id === productId) || anania;
  const priorities = [
    anania.id,
    "eau-de-parfum-pour-femmes-100-ml-katya",
    "parfum-maya-pour-femme-modele-princesse-format-100ml",
  ];
  const ordered = [...catalog].sort(
    (a, b) =>
      (priorities.includes(a.id) ? priorities.indexOf(a.id) : 99) -
      (priorities.includes(b.id) ? priorities.indexOf(b.id) : 99),
  );
  const products = ordered.filter(
    (p) =>
      (!gender || p.gender === gender) &&
      (!eligible || p.price > 150) &&
      (p.name + " " + p.title).toLowerCase().includes(search.toLowerCase()),
  );
  const script =
    lang === "Français"
      ? `Envie de découvrir un nouveau parfum ?\nVoici ${product.name} de YARA, en format ${product.size}.\nRetrouvez-le sur la boutique grâce à mon lien.\nLien affilié : je peux recevoir une commission sur vos achats.`
      : `اكتشفوا ${product.name} من YARA بحجم ${product.size}.\nتجدونه في المتجر عبر الرابط الخاص بي.\nرابط تسويق بالعمولة: يمكن أن أحصل على عمولة على مشترياتكم.`;
  const url = "https://yara.vip/" + product.url + "&ref=SARA";
  return (
    <>
      <PageTitle
        title="Produits et contenus"
        subtitle="Vos produits, vos visuels et vos scripts au même endroit."
      />
      <div className="filters product-filters">
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un produit"
        />
        <div className="tabs" role="group" aria-label="Catégorie">
          {[
            ["", "Tous"],
            ["femme", "Femmes"],
            ["homme", "Hommes"],
          ].map(([g, t]) => (
            <button
              key={t}
              className={gender === g ? "selected" : ""}
              onClick={() => setGender(g)}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={eligible}
            onChange={(e) => setEligible(e.target.checked)}
          />
          Produits éligibles uniquement
        </label>
      </div>
      <div className="catalog-layout">
        <div>
          <h2>
            {gender === "femme"
              ? "La sélection femmes"
              : gender === "homme"
                ? "La sélection hommes"
                : "Tous les produits"}{" "}
            <small>{products.length} produits</small>
          </h2>
          <div className="product-grid">
            {(expanded ? products : products.slice(0, 3)).map((p) => (
              <article
                className={
                  "product-card " + (productId === p.id ? "chosen" : "")
                }
                key={p.id}
              >
                <img src={asset(p.image)} alt={p.title} loading="lazy" />
                <div>
                  <h3>{p.name}</h3>
                  <small>{p.size}</small>
                  <strong>{money(p.price)}</strong>
                  <p className={p.price > 150 ? "orange" : "muted"}>
                    {p.price > 150
                      ? money(p.price * 0.3) + " de commission*"
                      : "Non éligible à la commission"}
                  </p>
                  <Button
                    secondary={productId !== p.id}
                    onClick={() => {
                      setProductId(p.id);
                      if (window.innerWidth < 950)
                        document.querySelector(".content-kit")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    Voir les contenus
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {products.length > 3 && (
            <button
              className="text-button section-gap"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? "Réduire le catalogue"
                : `Voir les ${products.length} produits`}
              <CaretDown />
            </button>
          )}
          {!products.length && (
            <p className="empty">Aucun produit ne correspond à ces filtres.</p>
          )}
          <div className="card section-gap">
            <h2>Créez un contenu à votre image</h2>
            <ol className="content-steps">
              <li>Choisissez votre produit</li>
              <li>Téléchargez ses visuels et adaptez le script</li>
              <li>Partagez votre lien personnel</li>
            </ol>
          </div>
        </div>
        <section className="card content-kit">
          <h2>{product.name} · Kit de partage</h2>
          <p className="muted">{product.size}</p>
          <div className="tabs">
            {["Script", "Visuels"].map((t) => (
              <button
                key={t}
                className={tab === t ? "selected" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Script" ? (
            <>
              <div className="two-fields">
                <select
                  aria-label="Format du script"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  {[
                    "Reel / TikTok · 20 s",
                    "Story · 15 s",
                    "Légende Instagram",
                    "YouTube · Description",
                  ].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <select
                  aria-label="Langue du script"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option>Français</option>
                  <option>العربية</option>
                </select>
              </div>
              <span className="badge gray">Exemple de script</span>
              <div className="script" dir={lang === "Français" ? "ltr" : "rtl"}>
                {lang === "Français" ? (
                  <>
                    {format === "Reel / TikTok · 20 s" ? (
                      <>
                        <h4>Accroche</h4>
                        <p>Envie de découvrir un nouveau parfum ?</p>
                        <h4>Présentation</h4>
                        <p>
                          Voici {product.name} de YARA, en format {product.size}
                          .
                        </p>
                        <h4>Invitation</h4>
                        <p>Retrouvez-le sur la boutique grâce à mon lien.</p>
                      </>
                    ) : (
                      <>
                        <h4>{format}</h4>
                        <p>
                          {format === "Story · 15 s"
                            ? "À découvrir aujourd’hui : "
                            : format === "Légende Instagram"
                              ? "Un parfum à découvrir : "
                              : "Dans cette vidéo, découvrez "}
                          {product.name} de YARA, en format {product.size}.
                          Retrouvez-le grâce à mon lien.
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <p>{script.split("\n").slice(0, 2).join("\n")}</p>
                )}
              </div>
              <Button
                secondary
                onClick={() =>
                  copy(
                    format === "Reel / TikTok · 20 s" || lang !== "Français"
                      ? script
                      : `${product.name} de YARA, en format ${product.size}. Retrouvez-le grâce à mon lien.\nLien affilié : je peux recevoir une commission sur vos achats.`,
                  )
                }
              >
                <Copy />
                Copier le script
              </Button>
              <div className="border-top">
                <h4>Mention à inclure</h4>
                <p className="muted">
                  Lien affilié : je peux recevoir une commission sur vos achats.
                </p>
              </div>
            </>
          ) : (
            <div className="visual-download">
              <img src={asset(product.image)} alt={product.title} />
              <small>Visuel officiel du catalogue · WEBP</small>
            </div>
          )}
          <a
            className="button secondary"
            download={product.id + ".webp"}
            href={asset(product.image)}
          >
            <DownloadSimple />
            Télécharger le visuel
          </a>
          <Button onClick={() => copy(url)}>
            <LinkIcon />
            Copier mon lien produit
          </Button>
          <small>Adaptez le texte à votre style et à votre expérience.</small>
        </section>
      </div>
      <small className="section-gap">
        * Commission indicative sans remise. Le montant final dépend du prix
        après remise, hors livraison.
      </small>
    </>
  );
}
