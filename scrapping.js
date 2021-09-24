let chrome = {}
let puppeteer;

if (process.env.ENV === 'development') {
  puppeteer = require("puppeteer");
} else {
  chrome = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
}

const getCrowdfunding = async (username) => {
  // url del perfil de ko-fi
  const url = `https://ko-fi.com/${username}`;

  // hide testing browser
  const hideBrowser = true;

  // Lanzamos un nuevo navegador.
  const browser = await puppeteer.launch({ args: [...chrome.args, '--no-sandbox'], headless: hideBrowser, ignoreHTTPSErrors: true, executablePath: await chrome.executablePath, });

  // Abrimos una nueva página.
  const page = await browser.newPage();
  console.log(`Fetching data with user: ${username}`)
  await page.setViewport({ width: 19999, height: 100000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
  await page.setCacheEnabled(false);

  // Vamos a la URL.
  await page.goto(url);

  const crowdfundingSelector = '#second-col-v2 > div > div > div.mb.ds-order > div';
  await page.waitForSelector(crowdfundingSelector, { visible: true });

  let results = await page.evaluate(() => {
    let results = {
      type: 'success',
      title: '',
      current: '',
      goal: '',
      description: '',
    }
    // selectores
    const titleSelector = '#second-col-v2 > div > div > div.mb.ds-order > div > div.col-xs-12 > div:nth-child(1) > div';
    const currentSelector = '#second-col-v2 > div > div > div.mb.ds-order > div > div.col-xs-12 > div.text-left.kfds-btm-mrgn-16 > span.kfds-font-bold';
    const goalSelector = '#second-col-v2 > div > div > div.mb.ds-order > div > div.col-xs-12 > div.text-left.kfds-btm-mrgn-16 > span.goal-label';
    const descriptionSelector = '#second-col-v2 > div > div > div.mb.ds-order > div > div.col-xs-12 > div.kfds-c-show-more-wrapper.kfds-lyt-column-start > p';
    results.title = document.querySelector(titleSelector).textContent;
    results.current = document.querySelector(currentSelector).textContent;
    results.goal = document.querySelector(goalSelector).textContent;
    results.description = document.querySelector(descriptionSelector).textContent;
    return results;
  })

  // Cerramos la página y el navegador.
  await page.close();
  await browser.close();

  return results;
}

module.exports = {
  getCrowdfunding,
};
