import PropTypes from "prop-types";

import "./AppLayout.css";

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
