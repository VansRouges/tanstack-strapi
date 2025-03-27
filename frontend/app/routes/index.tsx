import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <section className="trust-section">
      <div className="content-wrapper">
        <h2>Why Businesses Trust Our Inventory Management</h2>
        <p>
          Our inventory management system ensures real-time tracking, reduces
          waste, and optimizes stock levels. Businesses rely on us for accuracy,
          efficiency, and seamless integration with their operations.
        </p>
      </div>
      <div className="trust-container">
        <div className="image-grid">
          <div className="image large"></div>
          <div className="image medium"></div>
          <div className="image medium"></div>
        </div>

        <div className="trust-list">
          <ul>
            <li>
              <span className="checkmark">✔</span>
              <p>
                <strong>Real-time Stock Updates</strong>
                <br />
                Always know your inventory levels to prevent shortages and
                overstocking.
              </p>
            </li>
            <li>
              <span className="checkmark">✔</span>
              <p>
                <strong>Automated Restocking</strong>
                <br />
                Set up automatic reorders to ensure stock never runs out.
              </p>
            </li>
            <li>
              <span className="checkmark">✔</span>
              <p>
                <strong>Seamless Integrations</strong>
                <br />
                Connect with your POS, e-commerce, and accounting systems
                effortlessly.
              </p>
            </li>
            <li>
              <span className="checkmark">✔</span>
              <p>
                <strong>Comprehensive Reports</strong>
                <br />
                Gain insights into trends, stock movements, and business
                performance.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <Link
        to="/inventories"
        activeProps={{
          className: "font-bold",
        }}
      >
        <button className="cta-button">Get Started</button>
      </Link>{" "}
    </section>
  );
} 
