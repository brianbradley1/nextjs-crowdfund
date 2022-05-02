import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";

const LoadingButton = (props) => {
  const { classes, loading, ...other } = props;

  if (loading) {
    return (
      <Button {...other}>
        <CircularProgress />
      </Button>
    );
  } else {
    return <Button {...other} />;
  }
};

LoadingButton.defaultProps = {
  loading: false,
};

LoadingButton.propTypes = {
  loading: PropTypes.bool,
};

export default LoadingButton;
