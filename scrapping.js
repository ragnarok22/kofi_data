const puppeteer = require("puppeteer");

const getCrowdfunding = async (username) => {
  // url del perfil de ko-fi
  const url = 'https://ko-fi.com/' + username;

  // hide testing browser
  const hideBrowser = true;

  // Lanzamos un nuevo navegador.
  const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: hideBrowser, ignoreHTTPSErrors: true});
  // Abrimos una nueva página.
  const page = await browser.newPage();
  
  // Vamos a la URL.
  await page.goto(url, {timeout: 10000});
  
  const crowdfundingSelector = '#second-col-v2 > div > div > div.mb.ds-order > div';
  await page.waitForSelector(crowdfundingSelector, { visible: true, timeout: 10000 });

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
