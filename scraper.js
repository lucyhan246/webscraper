const puppeteer = require('puppeteer');
const fs = require('fs');

async function search() {

  //init csv file
  const writeStream = await fs.createWriteStream('table.csv');
  await writeStream.write(`Name,Position,Office,Age,Startdate,Salary\n`); //ideally want to parse this?

  //create new browswer
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  //go to google
  await page.goto('https://google.com');

  // simple selector for search box
  await page.click('[name=q]');
  await page.keyboard.type("datatables");
  await page.keyboard.press('Enter');  
  
  //select first search result (though may not always be the case)
  await page.waitForSelector('h3.LC20lb', {timeout: 10000});
  await page.evaluate(() => {
    let elements = document.querySelector('h3.LC20lb');
    elements.click();
  })

  //
  await page.waitForSelector('tbody', {timeout: 10000});
  const result = await page.$$eval('tbody', rows => { //get odd even :()

    //convert table object to array for mapping purposes
    let obj = rows[0].querySelectorAll('tr');
    const arr = Object.values(obj);

    return arr.map(row => {
      //(need to cut/optimize)
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
      return properties;
    });
  })

  console.log(result);

  //write results to csv file
  for (let i = 0; i < result.length; i++){
    const item = result[i];
    writeStream.write(`${item.name}, ${item.position}, ${item.office}, ${item.age}, ${item.startdate}, ${item.salary} \n`);

  }

  browser.close();

}

search();
