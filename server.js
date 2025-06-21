const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Sirva o frontend da pasta 'public'

app.post('/download', async (req, res) => {
    const { url, format } = req.body;

    if (!ytdl.validateURL(url)) {
        return res.status(400).send('URL inválida.');
    }

    try {
        const info = await ytdl.getInfo(url);
        let stream;

        if (format === 'mp3') {
            stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
            res.setHeader('Content-Disposition', `attachment; filename="video.mp3"`);
            res.setHeader('Content-Type', 'audio/mpeg');
        } else {
            stream = ytdl(url, { quality: 'highestvideo', filter: format => format.container === format });
            res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
            res.setHeader('Content-Type', `video/${format}`);
        }

        stream.pipe(res);
    } catch (error) {
        res.status(500).send('Erro ao processar o vídeo.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});