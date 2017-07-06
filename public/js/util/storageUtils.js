/**
 * 浏览器端数据存在的工具模块
 */
define([], function () {
    return {
        USER_KEY : '_user_',
        KEYS : {
        },
        session : {
            //保存到session
            setItem : function (key, value) {
                if(value != null && value instanceof Object) {
                    value = JSON.stringify(value);
                }
                sessionStorage.setItem(key, value);
            },

            //从session读取
            getItem : function (key) {
                var value = sessionStorage.getItem(key);
                if(value!=null && (value.indexOf('{')==0 || value.indexOf('[')==0)) {
                    value = JSON.parse(value);
                }
                return value;
            },

            //从session中移除
            removeItem : function (key) {
                sessionStorage.removeItem(key);
            }
        },
        local : {
            //保存到local
            setItem : function (key, value) {
                if(value != null && value instanceof Object) {
                    value = JSON.stringify(value);
                }
                localStorage.setItem(key, value);
            },

            //从local读取
            getItem : function (key) {
                var value = localStorage.getItem(key);
                if(value!=null && (value.indexOf('{')==0 || value.indexOf('[')==0)) {
                    value = JSON.parse(value);
                }
                return value;
            },

            //从local中移除
            removeItem : function (key) {
                localStorage.removeItem(key);
            }
        }
    }
})
