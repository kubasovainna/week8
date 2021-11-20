export default function appScr(express, bodyParser, fs, crypto, http, CORS, User, m) {
    const app = express();
    const path = import.meta.url.substring(7);
    const headersHTML = {'Content-Type':'text/html; charset=utf-8',...CORS}
    const headersTEXT = {'Content-Type':'text/plain',...CORS}
    const headersJSON={'Content-Type':'application/json',...CORS}
    const headersCORS={...CORS};

    const isu = 'itmo224658';
    app
        .use(bodyParser.urlencoded({ extended: true }))
        .all('/wordpress/', (r) => {
            r.res.set(headersJSON).send({
                id: 1,
                title: login,
            });

        })
        .all('/wordpress/wp-json/wp/v2/posts/', (r) => {
            r.res.set(headersJSON).send([{
                id: 1,
                title: {
                    rendered: isu,
                },
            },
            ]);

        })
        .all('/login/', r => {
            r.res.set(headersTEXT).send(isu);
        })
        .all('/code/', r => {
            r.res.set(headersTEXT)
            fs.readFile(import.meta.url.substring(7), (err, data) => {
                if (err) throw err;
                r.res.end(data);
            });
        })
        .all('/sha1/:input/', r => {
            r.res.set(headersTEXT).send(crypto.createHash('sha1').update(r.params.input).digest('hex'))
        })
        .all('/req/', (req, res) => {
            res.set(headersTEXT);
            if (req.method === "GET" || req.method === "POST") {
                const address = req.method === "GET" ? req.query.addr : req.body.addr;
                if (address) {
                    http.get(address, (resp) => {
                        let data = '';
                        resp.on('data', (chunk) => { data += chunk; });
                        resp.on('end', () => {
                            res.send(data);
                        });
                    })
                }
                else {
                    res.send(isu);
                }
            }
            else {
                res.send(isu);
            }
        })
        .post('/req/', r => {
            r.res.set(headersTEXT);
            const { addr } = req.body;
            r.res.send(addr)
        })
        .post('/insert/', async r => {
            r.res.set(headersTEXT);
            const { login, password, URL } = r.body;
            const newUser = new User({ login, password });
            try {
                await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
                try {
                    await newUser.save();
                    r.res.status(201).json({ 'Добавлено: ': login });
                }
                catch (e) {
                    r.res.status(400).json({ 'Ошибка: ': 'Нет пароля' });
                }
            }
            catch (e) {
                console.log(e.codeName);
            }
        })
        .all('/render/', async (req, res) => {
            res.set(headersCORS);
            const { addr } = req.query;
            const { random2, random3 } = req.body;

            http.get(addr, (r, b = '') => {
                r
                    .on('data', d => b += d)
                    .on('end', () => {
                        fs.writeFileSync('views/index.pug', b);
                        res.render('index', { login: "itmo224658", random2, random3 })
                    })
            })
        })
        .all('/*', (req, res) => {
            res.set(headersHTML);
            res.send(isu);
        })
        .set('view engine', 'pug')
    return app;
}