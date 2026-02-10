export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT,
    allowedHosts: "all"
  }
});