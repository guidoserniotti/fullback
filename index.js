const app = require("./app");
const { info } = require("./utils/logger");
const { PORT } = require("./utils/config");

app.listen(PORT, () => {
    info(`Server running on http://localhost:${PORT}`);
});
