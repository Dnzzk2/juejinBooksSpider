/* eslint-disable no-case-declarations */
import path from 'node:path'
import process from 'node:process'
import puppeteer from 'puppeteer'
import fs from 'fs-extra'
import { anchorTagsSelector, ignoreStyle, mdContentSelector, waitElement } from './task'
import { ValidUrl, logger, setPageCookie, toMd, toPdf } from '@/utils'
import { evConfig } from '@/config'
import type { FileFormat } from '@/types'

const regex = /[\\/:\*\?"<>\|]/g
const windowsReservedNamesRegex = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i // 匹配Windows保留名称的正则表达式
const storeDirs = path.join(evConfig.storeDirs ?? __dirname, 'books')
function getFileExtension(fileFormat: FileFormat): string {
  switch (fileFormat) {
    case 'pdf':
      return 'pdf'
    case 'md':
      return 'md'
    case 'html':
      return 'html'
    default:
      return 'txt'
  }
}
// 保存内容到文件
async function saveContentToFile(
  directoryPath: string,
  filename: string,
  content: string,
  fileType: FileFormat,
) {
  const fullFilename = `${filename}.${getFileExtension(fileType)}`
  const fileExists = await fs.pathExists(fullFilename)

  if (fileExists) {
    const existingContent = await fs.readFile(fullFilename, 'utf-8')
    if (existingContent.trim().length > 0) {
      logger.info(`文件${fullFilename}已存在且内容不为空，跳过保存`)
      return
    }
  }

  const removeStyleContent = removeStyleTags(content)

  try {
    switch (fileType) {
      case 'pdf':
        const pdf = await toPdf(removeStyleContent)
        await fs.writeFile(`${fullFilename}`, pdf)
        break
      case 'md':
        const md = await toMd(removeStyleContent)
        await fs.writeFile(`${fullFilename}`, md)
        break
      case 'html':
        await fs.writeFile(`${fullFilename}`, removeStyleContent)
        break
      default:
        logger.warn(`不支持的文件类型: ${fileType}`)
        break
    }

    // logger.info(`保存小册${title}章节到本地成功`)
    logger.info(`保存文件${fullFilename}到本地成功`)
  } catch (e) {
    logger.error(`保存文件${fullFilename}到本地失败`)
  }
}

// 保存章节内容到文件
async function saveSectionToFile(
  directoryPath: string,
  title: string,
  index: number,
  content: string,
  fileType: FileFormat,
) {
  const filename = path.join(directoryPath, `${title}`)
  await saveContentToFile(directoryPath, filename, content, fileType)
}

// 保存介绍内容到文件
async function saveIntroToFile(
  directoryPath: string,
  title: string,
  intro: string,
  fileType: FileFormat,
) {
  const introWithoutStyles = intro.replace(new RegExp(ignoreStyle, 'g'), '')
  if (introWithoutStyles) {
    const filename = path.join(directoryPath, 'intro')
    logger.info(`保存小册${title}介绍到本地成功`)
    await saveContentToFile(directoryPath, filename, introWithoutStyles, fileType)
  } else {
    logger.warn(`小册${title}介绍内容为空`)
  }
}
// 移除样式标签
function removeStyleTags(markdown: string): string {
  const styleTagRegex = /<style[^>]*>[\s\S]*?<\/style>/g
  return markdown.replace(styleTagRegex, '')
}

// 抓取章节内容
async function spiderSection(page, anchorTag, directoryPath, title, index, anchorTags, browser) {
  await anchorTag.click()
  try {
    await page.waitForTimeout(4000) // 等待页面加载
    await page.waitForSelector(mdContentSelector, { timeout: 30000 })
    const elements = await page.$(mdContentSelector)
    const intro = await page.evaluate((elem) => elem.innerHTML, elements)
    await saveSectionToFile(directoryPath, title, index, intro, evConfig.filetype)
    await page.waitForTimeout(2000)
    if (anchorTags.indexOf(anchorTag) === anchorTags.length - 1) {
      logger.info(`小册${title}已成功保存到本地`)
      await page.browser().close()
      logger.info(`即将关闭浏览器 🚀 。若浏览器未关闭，可手动关闭`)
      // todo: 多线程爬取时，这里会导致浏览器关闭，导致其他线程无法爬取
      // if (!evConfig.spiderAll) {
      await browser.close()
      process.exit(0)
      // }
    }
  } catch (error) {
    logger.error(`出现错误：${error}`)
  }
}

async function addBookLinkToReadme(bookLink: string, dir: string) {
  try {
    // Check if README.md exists, if not, create it
    if (!fs.existsSync(dir)) {
      let tpl = ''
      if (!dir.endsWith('\\books\\README.md')) {
        tpl = `## 简介 \n- <a href="./intro">小册介绍</a>\n### 目录\n`
      } else {
        tpl = `## 本小册由 <a href="https://github.com/h7ml/juejinBooksSpider.git">juejinBooksSpider</a>爬取 项目主页 <a href="https://h7ml.github.io/juejinBooksSpider">h7ml.github.io/juejinBooksSpider</a> \n### 小册总览\n`
      }
      await fs.promises.writeFile(dir, tpl)
    }

    const readmeContent = await fs.promises.readFile(dir, 'utf-8')
    if (!readmeContent.includes(bookLink)) {
      await fs.promises.appendFile(dir, `\n${bookLink}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// 抓取图书
export async function spiderBooks(url: string, setCookie = false) {
  logger.info(`启动 ${url} 任务 🚀`)
  const browser = await puppeteer.launch({
    ...evConfig.puppeteerOptions,
    headless: Boolean(evConfig.headless),
    // headless: false,
  })

  try {
    const page = await browser.newPage()
    if (setCookie) {
      await setPageCookie(page, evConfig.cookie)
    }
    await page.goto(url)
    await page.setViewport({ width: 1920, height: 1080 })
    const match = url.match(ValidUrl)
    if (!match) {
      logger.info('链接格式不正确')
      return
    }

    const targetBookId = match[1]
    const selector = `${waitElement}"${targetBookId}"]`
    await page.waitForSelector(selector, { visible: true })

    const bookInfoElement = await page.$(selector)
    if (!bookInfoElement) {
      logger.info(`未找到地址为 ${url} 的小册`)
      return
    }

    const anchorElement = await page.$(anchorTagsSelector)
    if (!anchorElement) {
      logger.info('未找到符合条件的小册链接')
      return
    }

    const href = await page.evaluate((elem) => elem.getAttribute('href'), anchorElement)
    const title = await page.evaluate((elem) => elem.textContent?.trim(), anchorElement)
    if (!title) return
    logger.info(`即将保存小册${title}到本地`)
    const directoryPath = path.join(storeDirs, title)
    await fs.ensureDir(directoryPath)
    // 在storeDirs下的README.md中添加小册链接

    const bookLink = `- <a href="./${title}">${title}</a>\n`

    const readmePath = path.join(storeDirs, 'README.md')
    await addBookLinkToReadme(bookLink, readmePath)
    // 页面加载完毕执行

    await page.waitForTimeout(4000) // 等待页面加载

    const introElement = await page.$(mdContentSelector)
    if (introElement) {
      const intro = await page.evaluate((elem) => elem.innerHTML, introElement)
      await saveIntroToFile(directoryPath, title, intro, evConfig.filetype)
    }
    // 点击小册界面为目录元素的标签 classname 是 div class="book-menu" 下的第二个div classname为item的元素
    const menuItemsSelector = '.book-menu .item'
    const menuItems = await page.$$(menuItemsSelector)
    await menuItems[1].click()
    await page.waitForTimeout(4000) // 等待页面加载
    const sectionListSelector = '.book-content .section'
    const menuPath = path.join(storeDirs, title, 'README.md')
    const sectionList = await page.$(sectionListSelector)
    if (sectionList) {
      const items = await page.$$(sectionListSelector)
      logger.info(`共${items.length}章节,开始写入目录`)
      for (const item of items) {
        const index = await item.$eval('.left .index', (el) => el.textContent)
        const mtitle = await item.$eval('.center .title .title-text', (el) => el.textContent)
        const bookLink = `- ${index} <a href="./${mtitle}">${mtitle}</a>`
        await addBookLinkToReadme(bookLink, menuPath)
      }
    }
    const fullUrl = `https://juejin.cn${href}`
    await page.goto(fullUrl)
    page.on('response', async (response) => {
      const url = response.url()
      const regurl = `https://api.juejin.cn/booklet_api/v1/booklet/get?aid=2608&uuid=`
      if (!url.includes(regurl)) {
        return
      }

      const sectionListSelector = '.section-list'
      const anchorTags = await page.$$(`${sectionListSelector} a .center .main-line .title`)
      let index = 1
      for (const anchorTag of anchorTags) {
        const bookTitle = await page.evaluate((element) => element.textContent?.trim(), anchorTag)
        await spiderSection(
          page,
          anchorTag,
          directoryPath,
          bookTitle?.replaceAll(regex, '').replace(windowsReservedNamesRegex, '') ?? bookTitle,
          index,
          anchorTags,
          browser,
        )
        index++
      }
      if (index++ > anchorTags.length) {
        await page.browser().close()
      }
    })
  } finally {
    // await browser.close() // 关闭浏览器
  }
}
