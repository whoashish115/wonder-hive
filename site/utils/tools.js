import moment from "moment"
import Image from "next/image";

export const textTools = {
  capitalize: (text) => {
    return text.replace(/^(.)/gm, (match, group) => group.toUpperCase());
  },
  title: (text) => {
    return text.replace(/\w\S*/g, function (text) { return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase(); });
  },
  isUrl:(text)=>{
	  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	  return !!urlPattern.test(text);
  }
}
export const functionalTools = {
  randomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  findAverage: (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }

}
export const mediaTools = {
  isImage: (url) => {
    return url && url.match(/(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/g)
  },
  isVideo: (url) => {
    return url && url.match(/video/i)
  },
}

export const sentenceTools = {
  slice: (sentence, threshold) => {
    if (sentence?.length > 125) {
      var trimmedString = sentence.substr(0, threshold);
      return `${trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))}...`
    }
    else {
      return sentence
    }
  },
}

export const dateAndTimeTools = {
  getExactDate: (JSdate) => {
    return moment(JSdate).format("DD MMM YYYY")
  },
}

export const dataTools = {
  editData: (data, id, post) => {
    const newData = data.map(item => item._id === id ? post : item)
    return newData
  },
  deleteData: (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData
  },
  serializeData: (data) => {
    let encodedData = encodeURIComponent(data)
    if (encodedData) return JSON.stringify(encodedData)
    else return ''
  },
  deserializeData: (data) => {
    let decodedData = decodeURIComponent(data)
    if (decodedData) return JSON.parse(decodedData)
    else return {}
  },
}

export const documentTools = {
  rgbaToHex: (rgba, forceRemoveAlpha = true) => {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '')
      .split(',')
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string))
      .map((number, index) => index === 3 ? Math.round(number * 255) : number)
      .map(number => number.toString(16))
      .map(string => string.length === 1 ? "0" + string : string)
      .join("")
  },
}
export const cookieTools = {
  setCookie: (data,document) => {
    document.cookie = data
  },
  getCookie: (cookieName, document) => {
    const cookieData = document.cookie.split(',')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(cookieName));
    if (cookieData) return cookieData.substring(cookieName.length);
    else return null
  }
}
