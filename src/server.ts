import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Server]: Vedic Astrology API is running on port ${PORT} (0.0.0.0)`);
  // Keep the process alive forcefully if environment tries to exit
  setInterval(() => {}, 1000 * 60 * 60);
});
