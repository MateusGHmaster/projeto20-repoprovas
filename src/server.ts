import app from './app.js';
import './config/setup.js';

const PORT = +process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Working and running on port ${PORT}!`);

});