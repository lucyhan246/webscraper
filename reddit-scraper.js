// const puppeteer = require('puppeteer');

// // const fs = require('fs');
// // const writeStream = fs.createWriteStream('table.csv');
// // writeStream.write(`Name,Position,Office \n`); //ideally want to parse this?

// async function search() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const page = await browser.newPage();

//   await page.goto('https://google.com');
// //   var array = fs.readFileSync("words.txt").toString().split('\n');
// //   var random = array[Math.floor(Math.random() * elements.length)];
//   // simple selector for search box
//   await page.click('[name=q]');
//   await page.keyboard.type("datatables");
//   // you forgot this
//   await page.keyboard.press('Enter');
//   // wait for search results
  
  
//   await page.waitForSelector('h3.LC20lb', {timeout: 10000});
//   await page.evaluate(() => {
//     let elements = document.querySelector('h3.LC20lb');

//     // "for loop" will click all element not random
//     // let randomIndex = Math.floor(Math.random() * elements.length) + 1
//     console.log(elements);

//     elements.click();
//   })

  

//   await page.waitForSelector('tr.odd', {timeout: 10000});
//     // const tableHandle = await page.$('tr');

//   const result = await page.$$eval('tr.odd', rows => { //get odd even :()
//     // let elements = document.querySelectorAll('tr');
//       return rows.map(row => {
//           const properties = {};
//           const name = row.querySelector('.sorting_1');
//           const position = name.nextSibling;
//           const office = position.nextSibling;
//         properties.name = name.innerText;
//         properties.position = position.innerText;
//         properties.office = office.innerText;
//         return properties;
//       });
//   })
//   console.log(result);

// //   browser.close();


// }

// search();


const puppeteer = require('puppeteer');
const fs = require('fs');

async function search() {
    const writeStream = await fs.createWriteStream('table.csv');
    await writeStream.write(`Name,Position,Office,Age,Startdate,Salary\n`); //ideally want to parse this?

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto('https://google.com');

  // simple selector for search box
  await page.click('[name=q]');
  await page.keyboard.type("datatables");
  await page.keyboard.press('Enter');  
  
  await page.waitForSelector('h3.LC20lb', {timeout: 10000});
  await page.evaluate(() => {
    let elements = document.querySelector('h3.LC20lb');

    elements.click();
  })

  await page.waitForSelector('tbody', {timeout: 10000});


  const result = await page.$$eval('tbody', rows => { //get odd even :()

    let obj = rows[0].querySelectorAll('tr');
    const arr = Object.values(obj);

    return arr.map(row => {
        const properties = {};
        const name = row.querySelector('.sorting_1');
        const position = name.nextSibling;
        const office = position.nextSibling;
        const age = office.nextSibling;
        const startdate = age.nextSibling;
        const salary = startdate.nextSibling;
      properties.name = name.innerText;
      properties.position = position.innerText;
      properties.office = office.innerText;
      properties.age = age.innerText;
      properties.startdate = startdate.innerText;
      properties.salary = salary.innerText;
    //   writeStream.write(`${name.innerText}, ${position.innerText}, ${office.innerText}, ${age.innerText}, ${startdate.innerText}, ${salary.innerText} \n`);
      return properties;
    });
  })

  console.log(result);
//   for (const item in result){
//     writeStream.write(`${item.name}, ${item.position}, ${item.office}, ${item.age}, ${item.startdate}, ${item.salary} \n`);

//   }

//   browser.close();


}

search();
