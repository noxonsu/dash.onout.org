import puppeteer from 'puppeteer'
import { Browser, Page } from 'puppeteer'
import fs from 'fs'
import { timeOut } from './time'

// if it's true then you will be able to see puppeteer's browser
// don't enable this mode in Github test flows. They don't work with that
const isDebug = false

export const createBrowser = async (): Promise<{
  browser: Browser
  page: Page
}> => {
  const browser = await puppeteer.launch({
    headless: !isDebug,
    // slowMo: 100,
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 1100,
    height: 1080,
  })

  page.on('error', (err) => {
    console.log('[puppeteer] error: ', err)
  })

  return { browser, page }
}

export const takeScreenshot = async (page: Page, fileName: string) => {
  const dir = 'tests/screenshots'
  // check if ./screenshots directory exists
  if (!fs.existsSync(dir)) {
    // create tests/e2e/screenshots directory
    await fs.mkdir(dir, (err) => {
      if (err) {
        throw err
      }
      console.log('tests/screenshots directory is created.')
    })
  }

  await page.screenshot({
    path: `${dir}/${fileName}.jpg`,
    type: 'jpeg',
  })
}

export const clickOn = async (params) => {
  const { page, selector } = params

  await page.$(selector).then(async (item) => {
    if (item) {
      item.click()
      await timeOut(1000)
    } else {
      throw new Error(`Selector (${selector}) is not found`)
    }
  })
}
