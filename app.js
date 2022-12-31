const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const download = require('image-downloader');
const path = require('path');
const fs = require('fs');
const message = require('./message');

let sender = []

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
})

client.initialize();

client.on('message', async msg => {
    if (msg.body == '!help') {
        client.sendMessage(msg.from, message.help);
    } 
    
    else if (msg.body == '!pendahuluan') {
        const media = MessageMedia.fromFilePath('./assets/pendahuluan.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.pendahuluan);
    } 
    
    else if (msg.body == '!kesiapsiagaan') {
        const media = MessageMedia.fromFilePath('./assets/kesiapsiagaan.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.kesiapsiagaan);
    } 
    
    else if (msg.body == '!rencanakss'){
        const media = MessageMedia.fromFilePath('./assets/rencanakss.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.rencanakss);
    }

    else if (msg.body == '!pragempa') {
        const media = MessageMedia.fromFilePath('./assets/pragempa.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.pragempa);
    }

    else if (msg.body == '!pasgempa'){
        const media = MessageMedia.fromFilePath('./assets/pasgempa.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.pasgempa.head);
        client.sendMessage(msg.from, message.pasgempa.first);
        client.sendMessage(msg.from, message.pasgempa.second);
    }

    else if (msg.body == '!pascagempa'){
        const media = MessageMedia.fromFilePath('./assets/pascagempa.mp3');
        client.sendMessage(msg.from, media);
        client.sendMessage(msg.from, message.pascagempa);
    }
    
    else if (msg.body == '!infogempa') {
        const url = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
        const res = await axios.get(url)
        const data = res.data.Infogempa.gempa;
        const imgURL = 'https://data.bmkg.go.id/DataMKG/TEWS/'+data.Shakemap;
        const image = await download.image({url: imgURL, dest: path.join(__dirname, 'assets/shakemap.jpg')});
        const media = MessageMedia.fromFilePath('./assets/shakemap.jpg');
        const caption =
            '*Informasi gempa bumi terkini*'+
            '\n\n*Waktu* : '+data.Jam+
            '\n*Tanggal* : '+data.Tanggal+
            '\n*Lokasi* : '+data.Lintang+', '+data.Bujur+
            '\n*Magnitudo* : '+data.Magnitude+
            '\n*Kedalaman* : '+data.Kedalaman+
            '\n*Wilayah* : '+data.Wilayah+
            '\n*Potensi* : '+data.Potensi+
            '\n*Dirasakan* : '+data.Dirasakan+
            '\n\n*Sumber* : BMKG';
        client.sendMessage(msg.from, media, { caption: caption });
        fs.unlinkSync(image.filename);
    } 

    else if (msg.body == '!bacaan') {
        const media1 = MessageMedia.fromFilePath('./assets/BukuSakuBNPB.pdf');
        const media2 = MessageMedia.fromFilePath('./assets/Pengenalan_Gempa_Bumi.pdf');
        const media3 = MessageMedia.fromFilePath('./assets/Penanganan_dan_Mitigasi_Bencana_Alam.pdf');
        client.sendMessage(msg.from, media1);
        client.sendMessage(msg.from, media2);
        client.sendMessage(msg.from, media3);

    }
    
    else {
        client.sendMessage(msg.from, `Halo *${msg._data.notifyName}*, saat ini anda sedang menghubungi WhatsApp Bot *Siaga Gempa Bumi*.\nSilahkan ketik *"!help"* untuk melihat daftar perintah yang tersedia.`);
    }
});

