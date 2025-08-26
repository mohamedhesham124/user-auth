module.exports = (err, req, res , next) => {
    console.error(err.message); // Log the error message for debugging
    res.status(500).send({ message: "Internal server error." }); // Send a generic error response
};
