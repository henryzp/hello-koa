// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

const json = require('koa-json');

const staticServer = require('koa-static');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(staticServer(__dirname + '/static'));

app.use(json({ pretty: false, param: 'pretty' }));

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// add url-route:
router.get('/ajax', async (ctx, next) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    ctx.body = {a: 1, b: 2}
});

router.get('/', async (ctx, next) => {
    ctx.response.body = env.render("index.html");
});

// add router middleware:
app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');