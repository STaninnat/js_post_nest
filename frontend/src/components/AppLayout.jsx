import "./AppLayout.css";
import PropTypes from "prop-types";

function AppLayout(props) {
  return (
    <section className="layout-app-section">
      <div className="layout-app-container">{props.children}</div>
    </section>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
