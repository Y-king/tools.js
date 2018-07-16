/** 
 * @author  739423210@qq.com  king900714@126.com
 * @date    2017-05-01
 * @description  
 * @filename 
 * @aboutfilename 
 */
//圣杯继承
var inherit = (function(){
    var F = function(){};
    return function(Target,Origin){
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}())

//深度克隆
function deepClone(origin,target){
    var target = target || {};
    var toStr = Object.prototype.toString;
    var arrStr = '[objiect Array]';
    for(var prop in origin){
        if(origin.hasOwnProperty(prop)){
            if(origin[prop] !== 'null'&& typeof(origin[prop]) == 'objiect'){
                if(toStr.call(origin[prop]) == arrStr){
                    target[prop] = [];
                }else{
                    target[prop] = {};
                }
                deepClone(origin[prop],target[prop]);
            }else{
                target[prop] = origin[prop];
            }
        }
    }
    return target;
};

//判断数据类型
function type(target){
    var ret = typeof(target);
    var template={
        '[objiect Array]':'array',
        '[objiect Object]':'objiect',
        '[objiect Number]':'number - objiect',
        '[objiect Boolean]':'boolean - objiect',
        '[objiect String]':'string - objiect',
    };
    if(target = 'null'){
        return 'null'
    }else if(ret = 'objiect'){
        var str = Object.prototype.toString.call(target);
        return template[str]
    }else{
        return ret;
    }
};

//封装函数，返回元素e的第n个兄弟元素节点，n为正返回后面的兄弟元素节点，n为负返回前面的兄弟元素节点，n为0返回自己
function retSinling(e,n){
    while(e && n){
        if(n>0){
            if(e.nextElementSibling){
                e =e.nextElementSibling;
            }else{
                for(e=e.nextSibling;e&&e.nodeType !==1;e = e.nextSibling);
            }
            n--;
        }else{
            if(e.previousElementSibling){
                e = e.previousElementSibling;

            }else{
                for(e=e.previousSibling;e&&e.nodeType !==1;e = e.previousSibling);
            }
            n++;
        }
    }
    return e;
};


//事件邦定，兼容各浏览器 
function addEvent(elem,type,handle){
    if(elem.addEventListener){
        elem.addEventListener(type,handle)
    }else if(elem.attachEvent){
        elem.attachEvent('on'+type,function(){
            handle.call(elem)
        })
    }else{
        elem['on'+type] =handle;
    }
};

//事件移除，兼容各浏览器 
function removeEvent(elem,type,handle){
    if(elem.removeEventListener){
        elem.removeEventListener(type,handle)
    }else if(elem.detachEvent){
        elem.detachEvent('on'+type,function(){
            handle.call(elem)
        })
    }else{
        elem['on'+type] =null;
    }
};

//获取样式
function getStyle(elem,prop){
    if(window.getComputedStyle){
        return window.getComputedStyle(elem,null)[prop];
    }else{
        return elem.currentStyle[prop];
    }
};

//阻止事件冒泡
function stopBubble(event){
    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
};

//阻止默认事件
function cancelHandler(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
};

//拖拽
function drag(elem){
    var disX,
        disY;
    addEvent(elem,'mousedown',function(e){
        var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(elem,'left'));
        disY = event.clientY - parseInt(getStyle(elem,'top'));
        addEvent(document,'mousemove',mouseMove);
        addEvent(document,'mouseup',mouseUp);
        stopBubble(event);
        cancelHandler(event);
    });
    function mouseMove(e){
        var event = e || window.event;
        elem.style.left = event.clientX - disX + 'px';
        elem.style.top = event.clientY - disY + 'px';
    };
    function mouseUp(e){
        var event = e ||window.event;
        removeEvent(document,'mousemove',mouseMove);
        removeEvent(document,'mouseup',mouseUp);
    }
};

//获取滚动条的位置
function getScrollOffset(){
    if(window.pageXOffset){
        return {
            x:window.pageXOffset,
            y:window.pageYOffset
        }
    }else{
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y:document.body.scrollTop + document.documentElement.scrollTop
        }
    }
};

//获取浏览器可视区的宽高
/*
 *1.BackCompat：标准兼容模式关闭。
 *2.CSS1Compat：标准兼容模式开启。
 *3.当document.compatMode等于BackCompat时，浏览器客户区宽度是document.body.clientWidth；
 *4.当document.compatMode等于CSS1Compat时，浏览器客户区宽度是document.documentElement.clientWidth。
**/
function getViewportOffset(){
    if(window.innerWidth){
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    }else{
        if(document.compatMode === 'BackCompat'){
            return {
                w:document.body.clientWidth,
                h:document.body.clientHeight
            }
        }else{
            return {
                w:document.documentElement.clientWidth,
                h:document.documentElement.clientHeight
            }
        }
    }
};

//数组去重
Array.prototype.unique = function(){
    var res = [];
    var b = {};
    var len =this.length;
    for(var i = 0;i<len;i++){
        if(!b[this[i]]){
            b[this[i]] = 'wangyao';
            res.push(this[i]);
        }
    }
    return res;
};

// 数组排序
Array.prototype.mySort = function(){
    if(this.length<=1){
        return this;
    };
    var index = Math.floor(this.length/2);
    var temp = this.splice(index,1);
    var left = [];
    var right = [];
    for(var i=0;i<this.length;i++){
        if(this[i]<temp){
            left.push(this[i])
        }else{
            right.push(this[i])
        }
    }
    return left.mySort().concat(temp,right.mySort())
};

// indexOf 兼容
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(ele) {
        // 获取数组长度
        var len = this.length;
        // 检查值为数字的第二个参数是否存在，默认值为0
        var fromIndex = Number(arguments[1]) || 0;
        // 当第二个参数小于0时，为倒序查找，相当于查找索引值为该索引加上数组长度后的值
        if(fromIndex < 0) {
            fromIndex += len;
        }
        // 从fromIndex起循环数组
        while(fromIndex < len) {
            // 检查fromIndex是否存在且对应的数组元素是否等于ele
            if(fromIndex in this && this[fromIndex] === ele) {
                return fromIndex;
            }
            fromIndex++;
        }
        // 当数组长度为0时返回不存在的信号：-1
        if (len === 0) {
            return -1;
        }
    }
};

//forEach 兼容
if ( !Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback) {
      // 获取数组长度
    var len = this.length;
    if(typeof callback != "function") {
        throw new TypeError();
    }
    // thisArg为callback 函数的执行上下文环境
    var thisArg = arguments[1];
    for(var i = 0; i < len; i++) {
        if(i in this) {
            // callback函数接收三个参数：当前项的值、当前项的索引和数组本身
            callback.call(thisArg, this[i], i, this);
        }
    }
  }
};

//map 兼容
if (!Array.prototype.map) {
  Array.prototype.map = function(callback) {
      // 获取数组长度
      var len = this.length;
      if(typeof callback != "function") {
          throw new TypeError();
      }
      // 创建跟原数组相同长度的新数组，用于承载经回调函数修改后的数组元素
      var newArr = new Array(len);
      // thisArg为callback 函数的执行上下文环境
      var thisArg = arguments[1];
      for(var i = 0; i < len; i++) {
          if(i in this) {
              newArr[i] = callback.call(thisArg, this[i], i, this);
          }
      }
      return newArr;
  }    
};

// filter 兼容
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback) {
      // 获取数组长度
      var len = this.length;
      if(typeof callback != "function") {
          throw new TypeError();
      }
      // 创建新数组，用于承载经回调函数修改后的数组元素
      var newArr = new Array();
      // thisArg为callback 函数的执行上下文环境
      var thisArg = arguments[1];
      for(var i = 0; i < len; i++) {
          if(i in this) {
              if(callback.call(thisArg, this[i], i, this)) {
                  newArr.push(val);
              }
          }
      }
      return newArr;
  }
};

//some 兼容
if (!Array.prototype.some) {
  Array.prototype.some = function(callback) {
      // 获取数组长度
      var len = this.length;
      if(typeof callback != "function") {
          throw new TypeError();
      }
      // thisArg为callback 函数的执行上下文环境
      var thisArg = arguments[1];
      for(var i = 0; i < len; i++) {
          if(i in this && callback.call(thisArg, this[i], i, this)) {
              return true;
          }
      }
      return false;
  }
};
//every 兼容
if (!Array.prototype.every) {
  Array.prototype.every = function(callback) {
      // 获取数组长度
      var len = this.length;
      if(typeof callback != "function") {
          throw new TypeError();
      }
      // thisArg为callback 函数的执行上下文环境
      var thisArg = arguments[1];
      for(var i = 0; i < len; i++) {
          if(i in this && !callback.call(thisArg, this[i], i, this)) {
              return false;
          }
      }
      return true;
  }
};

//查询字符串参数
function getQueryStringArgus(){
  //取得查询字符串并且去掉开头的的问号
  var qs = (location.search.length > 0 ? location.search.substring(1) : ''),
    //保存数据的对象
      args = {},
      //取得每一项
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length;
  //逐个将每一项添加到args对象中
  for(i = 0; i<len; i++){
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);
    if(name.length){
      args[name] = value
    }
  }
  return args
}
