// 正则匹配
let Pattern = {
  isEmpty: /(^\s*)|(\s*$)/g,
  isMobile: /^1[3|4|5|6|7|8][0-9]{9}$/,
  isCnAndEn: /^[\u4E00-\u9FA5]+$/,
  isCnAndEnAndNum: /^[\u4e00-\u9fa5-a-zA-Z0-9]+$/,
  isUserName: /^[(\u4e00-\u9fa5)a-zA-Z]+$/,
  isPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
  isAuthCode: /^[0-9]{6}$/,
  isTelAndMobile: /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/,
}

const validator = {
  /**
   * 执行正则表达式
   * @param pattern 校验的正则表达式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  executeExp: function (pattern, strValue) {
    return pattern.test(strValue)
  },
  /**
   * 判断字符串是否为空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isEmpty: function (strValue) {
    strValue = strValue.replace(Pattern.isEmpty, '')
    return strValue.length == 0
  },
  /**
   * 判断字符串是否非空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isNotEmpty: function (strValue) {
    return !this.isEmpty(strValue)
  },
  /**
   * 判断是否为中文
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEn: function (strValue) {
    if (this.isEmpty(strValue))
      return false

    return this.executeExp(Pattern.isCnAndEn, strValue)
  },
  /**
   * 判断是否为中英文、数字及'-'
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEnAndNum: function (strValue) {
    if (this.isEmpty(strValue))
      return false

    return this.executeExp(Pattern.isCnAndEnAndNum, strValue)
  },
  /**
   * 判断是否为用户名
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isUserName: function (strValue) {
    if (this.isEmpty(strValue))
      return false

    return this.executeExp(Pattern.isUserName, strValue)
  },
  /**
   * 判断验证码格式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isAuthCode: function (strValue) {
    if (this.isEmpty(strValue))
      return false
    return this.executeExp(Pattern.isAuthCode, strValue)
  },
  /**
   * 判断是否为手机号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isMobile: function (strValue) {
    if (this.isEmpty(strValue))
      return false
    return this.executeExp(Pattern.isMobile, strValue)
  },
  /**
   * 判断是否为手机或电话号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isTelAndMobile: function (strValue) {
    if (this.isEmpty(strValue))
      return false
    return this.executeExp(Pattern.isTelAndMobile, strValue)
  },
  /**
   * 判断是否符合密码规则
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isPassword: function (strValue) {
    if (this.isEmpty(strValue))
      return false
    return this.executeExp(Pattern.isPassword, strValue)
  },
  /**
   * 对象是否为空
   * @param obj 检验对象
   * @returns {boolean}
   */
  isEmptyObj: (obj) => {
    return Object.keys(obj).length === 0
  },
  /**
   * 是否在范围长度内
   * @param 范围数组 [1, 10] 长度在1-10内
   * @returns {boolean}
   */
  isLenRange: (strValue, lenArr) => {
    return strValue.length >= lenArr[0] && strValue.length <= lenArr[1]
  },
  /**
   * 是否在数值范围内
   * @param 范围数组 [1, 10] 数值在1-10内
   * @returns {boolean}
   */
  isNumRange: (numValue, numArr) => {
    return numValue >= numArr[0] && numValue <= numArr[1]
  }
}

// 初始化用户选项，在每个选项前补充字母
function addChoiceLetter (obj) {
  const choiceLetter = ['A', 'B', 'C', 'D', 'E']

  obj.Choices.forEach((item, index) => {
    item.value = `<b>${choiceLetter[index]}</b>. ${item.value}`
  })
  return obj
}

// 增加【我不确定】的选项
function addIndeterminateChoice (obj) {
  obj.choices.push({
    index: -1,
    value: '我不确定'
  })
  return obj.choices
}

function addMediaTagLink (testType, mediaTag) {
  let random = Math.random()
  return `https://ssl-public.langlib.com/CM/${testType}/${mediaTag}.mp3?${random}`
}

function finterpreter (type,str) {
  switch (type) {
    case 'sharedText':
      return str.replace(/####(.*)$/, '<p class="u-stem">$1</p>').replace(/####/g, '<br>')
      .replace(/##(.*)$/, '<p class="u-stem">$1</p>').replace(/##/g, '<br>')
      .replace(/\[u\]/g, '<span class="u-underline">')
      .replace(/\[\/u\]/g, '</span>')
    case 'underline':
      return str.replace(/\[u\]/, ' <span class="u-underline">')
      .replace(/\[\/u\]/, '</span>')
    case 'br':
      return str.replace(/\[br\]/g, '<br>')
    case 'questionAsset':
      return str.replace(/##/, '<br>')
    default:
      return ''
  }
}


function Base64() {

  // private property
  const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  // public method for encoding
  this.encode = function (input) {
    var output = ""
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0
    input = _utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
    }
    return output
  }

  // public method for decoding
  this.decode = function (input) {
    var output = ""
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = _utf8_decode(output)
    return output
  }

  // private method for UTF-8 encoding
  const _utf8_encode = function (string) {
    string = string.replace(/\r\n/g,"\n")
    var utftext = ""
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }

    }
    return utftext
  }

  // private method for UTF-8 decoding
  const _utf8_decode = function (utftext) {
    var string = ""
    var i = 0
    var c = 0
    var c1 = c1
    var c2 = 0
    while ( i < utftext.length ) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i+1)
        c3 = utftext.charCodeAt(i+2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }
    return string
  }
}

function decodeBase64 (text) {
  const base = new Base64()
  return base.decode(text)
}

function debounce (func, wait = 100, immediate) {
  let timeout
  return function () {
    const context = this, args = arguments
    let later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

function sort (arr) {
  if (typeof arr === 'object') {
    return arr.sort(function randomsort() {
      return Math.random() > .5 ? -1 : 1;
    })
  }
}

function aldEventName(testType, course) {
  return `提分体验营_${testType}_${course}开始上课`
}
// function formatString() {
//   if (arguments.length === 0){
//     return null
//   }
//
//   let str = arguments[0];
//
//   for (var i = 1; i < arguments.length; i++) {
//     const re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
//     str = str.replace(re, arguments[i]);
//   }
//
//   return str
// }

function render (template, context) {
  var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

  return template.replace(tokenReg, function (word, slash1, token, slash2) {
    if (slash1 || slash2) {
      return word.replace('\\', '');
    }

    let variables = token.replace(/\s/g, '').split('.');
    let currentObject = context;
    let i, length, variable;

    for (i = 0, length = variables.length; i < length; ++i) {
      variable = variables[i];
      currentObject = currentObject[variable]

      if (currentObject === undefined || currentObject === null) return ''
    }

    return currentObject
  })
}

export default {
  validator,
  addChoiceLetter,
  addIndeterminateChoice,
  addMediaTagLink,
  decodeBase64,
  debounce,
  finterpreter,
  aldEventName,
  sort,
  render
}
