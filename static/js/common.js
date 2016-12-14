var common = {
    /**
     *
     * @param option jquery.ajax的option参数
     * @param context 上下文 object 上下文，通常为点击的DOM元素
     * @param useFirstReq boolean 是否使用第一次请求，如果false，则abort掉之前的请求
     * @param tipFunction 当useFirstReq为true时，要触发的函数，比如提示用户不能频繁点击
     * @returns {*}
     */
    ajax: function(option, context, useFirstReq, tipFunction) {

        if(context == null ) {
            console.error("第二个参数：上下文必须传");
            return;
        }

        if(typeof context == "boolean" || typeof context == "function") {
            console.error("上下文不能是boolean类型或者function类型");
            return;
        }

        if (useFirstReq == null) {
            useFirstReq =  true;
        }

        if(typeof useFirstReq == "function") {
            tipFunction = useFirstReq;
            useFirstReq = true;
        }

        if (context.promise_ && context.promise_.state() === 'pending') {

            if (useFirstReq) {
                tipFunction && tipFunction();
                return;
            }else {
                context.promise_.abort();
            }
        }
        return context.promise_  = $.ajax(option);

    }
}



