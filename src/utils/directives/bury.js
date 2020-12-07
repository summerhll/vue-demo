
export const bury = {
    bind: function(el, binding) {
        let bindValue = binding.value;
        el.clickHandler = function() {
             //执行埋点操作
             console.log(JSON.stringify({...bindValue}));  
        }.bind(el);
        el.addEventListener("click", el.clickHandler, true);
    }
};


