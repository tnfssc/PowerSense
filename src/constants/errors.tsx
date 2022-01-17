const ERRORS = {
  SINGLE_ROW_NOT_FOUND: {
    message: "JSON object requested, multiple (or no) rows returned",
    details: "Results contain 0 rows, application/vnd.pgrst.object+json requires 1 row",
  },
};

export default ERRORS;
