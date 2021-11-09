export default function appScr(express, bodyParser, fs, crypto, http, CORS, User, m) {
    const app = express();
    const hu = {'Content-Type':'text/html; charset=utf-8'}
    let headers = {
        'Content-Type':'text/plain',
        ...CORS
    }
    const isu = 'itmo224658';
    app
        .use(bodyParser.urlencoded({extended:true}))       
        .all('/login/', r => {
            r.res.set(headers).send(isu);
        })
        .all('/code/', r => {
            r.res.set(headers)
            fs.readFile(import.meta.url.substring(7),(err, data) => {
                if (err) throw err;
                r.res.end(data);
              });           
        })
        .all('/sha1/:input/', r => {
            r.res.set(headers).send(crypto.createHash('sha1').update(r.params.input).digest('hex'))
        })
        .all('/req/', (req, res) => {
            res.set(headers);
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
        .post('/req/', r =>{
            r.res.set(headers);
            const {addr} = req.body;
            r.res.send(addr)
        })
        .post('/insert/', async r=>{
            r.res.set(headers);
            const {login,password,URL}=r.body;
            const newUser = new User({login,password});
            try{
                await m.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true});
                try{
                    await newUser.save();
                    r.res.status(201).json({'Добавлено: ':login});
                }
                catch(e){
                    r.res.status(400).json({'Ошибка: ':'Нет пароля'});
                }
            }
            catch(e){
                console.log(e.codeName);
            }      
        })
        .all('/*', (req, res) => {
            res.set(headers);
            res.send(isu);
            })
    return app;
}