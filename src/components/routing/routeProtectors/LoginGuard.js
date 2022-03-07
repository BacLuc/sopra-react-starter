import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {getUserId} from "helpers/api";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  if (!getUserId()) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /app
  return <Redirect to="/game"/>;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}