const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes); 