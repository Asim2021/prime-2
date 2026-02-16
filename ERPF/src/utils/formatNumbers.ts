// import numeral from 'numeral'

// /**
//  * The function takes a number or string and formats it as a currency value with two decimal places

//  * @param value - The parameter `value` is a variable that can accept either a number
//  * or a string as input. It is used as an argument for the `parseMoney` function.
//  * @returns The function `parseMoney` takes a parameter `value` and returns a formatted string
//  * with two decimal places using the `numeral` library. If the parameter is an empty string, the
//  * function returns an empty string.
//  */
// export const parseMoney = (value : number | string) => {
//   if (value === '' || value === undefined) return 
//   return numeral(value).format('0.00');
// }

// /**
//  * Formats a number as money
//  * @param {string} value - Number to format
//  * @param {boolean} zeroToDash - true if you wish to include zeroes in format, false to return an em-dash
//  * @param {string} currencySymbol - currencySymbol to apply
//  * @returns formatted string 
//  */
// export const asMoney = (value: string | number, zeroToDash : boolean, currency:string) => {
//   const currencyCode = currency || 'USD'
//   if (value === '' || value === undefined) return 

//   if (zeroToDash && !parseFloat(String(value))) {
//     return '—'
//   }

//   const numericValue = numeral(value)._value !== null ? Number(value) : 0
//   const formattedCurrency = new Intl.NumberFormat(
//     localStorage.getItem('lng-list') || 'en-US',
//     { style: 'currency', currency: currencyCode }
//   ).format(numericValue)

//   return formattedCurrency.replace(/\s/g, '')
// }

// // Percentages

// export const parsePercentage = (value : string) => {
//   if (value === '') return 

//   let strippedValue = value

//   if (typeof strippedValue === 'string') {
//     strippedValue = value.replace('%', '')
//   }

//   const parsedValue = Number.isNaN(numeral(strippedValue).value())
//     ? null
//     : numeral(strippedValue).value()
//   return parsedValue
// }

// /**
//  * Formats a number as percentage
//  * @param {string } - Number to format
//  * @returns formatted string
//  */
// export const asPercentage = (number : string, zeroToDash:boolean) => {
//   if (number === '' ) return 

//   if (zeroToDash && !parseFloat(number)) {
//     return '—'
//   }

//   return numeral(Number(number) / 100).format('0.00%')
// }

// // Other numbers

// /**
//  * Formats a number as int or float
//  * @param {string|number} - Number to format
//  * @returns formatted string
//  */
// export const asIntOrFloat = (number: string | number) => {
//   return numeral(number).format('0[.][00]')
// }

// export const asTimeHHMM = (value: string | number) => {
//   let result = '00:00'
//   const number = Number(value)

//   if (number && number > 0) {
//     const hours = Math.trunc(number)
//     const minutes = Math.round((number * 60) % 60)

//     result = `${(hours < 10 ? '0' : '') + hours.toString()}:${
//       (minutes < 10 ? '0' : '') + minutes.toString()
//     }`
//   }

//   return result
// }

// /**
//  * Formats a number as int or float
//  * @param {number} - Number to format
//  * @param {boolean} - If we should use SI units (base 10) for this calculation (1024 v. 1000)
//  * @returns formatted string
//  */
// export const humanFileSize = (number: number, si:string) => {
//   let bytes = number
//   const thresh = si ? 1000 : 1024
//   if (Math.abs(bytes) < thresh) {
//     return `${bytes} B`
//   }
//   const units = si
//     ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
//     : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
//   let u = -1
//   do {
//     bytes /= thresh
//     u += 1
//   } while (Math.abs(bytes) >= thresh && u < units.length - 1)
//   return `${bytes.toFixed(1)} ${units[u]}`
// }
