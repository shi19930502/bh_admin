import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//引入VueRouter
import VueRouter from "vue-router"
Vue.use(VueRouter)
// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI, { size: 'mini' })
// 自定义样式
import './scss/custom.scss'
import './scss/overwrite.scss'
// 语法插件
import 'babel-polyfill'
// 自定义组件
import components from './components/index.js'
Vue.use(components)
//路由、全局状态
import routes from './router.js';
import stores from './store.js';
const router = new VueRouter({routes})
const store = new Vuex.Store(stores)
import local from './local.js'
// 全局路由拦截
router.beforeEach((to, from, next) => {
    NProgress.start();
    window.scroll(0, 0);
    var user = local.get('userinfo')
    var navlist = local.get('navlist')
    next()
    if(!user || !user.loginName) {        
        if(to.path !== '/login' && to.path !== '/customerRegist') {
            NProgress.done();
            next('/login');   
        }else {
            next()        
        }
    }else{
        if(to.name !== 'login' && to.name !== 'customerRegist' && to.name !== 'index' && !to.meta.modal) {
            forNavList(navlist, to.name, next)
        }else {
            next()
        }
    }
});
router.afterEach(transition => {
    NProgress.done();
});
// 标签名
var title = '商家系统管理后台'
document.title = title

// 解决前端计算精度问题
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};
Number.prototype.sub = function (arg) {
    return accMul(arg, this);
};
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};

String.prototype.add = function (arg) {
    return accAdd(arg, this);
};
String.prototype.sub = function (arg) {
    return accMul(arg, this);
};
String.prototype.mul = function (arg) {
    return accMul(arg, this);
};
String.prototype.div = function (arg) {
    return accDiv(this, arg);
};

Number.prototype.toFixed = function(s)
{
    return (parseInt(this * Math.pow( 10, s ) + 0.5)/ Math.pow( 10, s )).toString();
}
// render
import App from './App.vue'
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


function accAdd(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
function accSub(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
function accMul(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
function accDiv(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

function forNavList(navlist, name, next) {
    navlist.forEach(function(el) {
        if(el.caption == name) {
            next()
        }else {
            if(el.hasChildren === 1) {
                forNavList(el.children, name, next)
            }
        }
    })
}
import VueQr from 'vue'
import VueQriously from 'vue-qriously'
VueQr.use(VueQriously)












