import { uniqueNamesGenerator } from 'unique-names-generator'
import pluralize from 'pluralize'
import { adjectives, animals } from '../../lib/dictionaries'

const generateName = () => {
  const nameParts = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
    style: 'capital',
    length: 2,
  }).split('-')

  return `${nameParts[0]} ${nameParts[1]}`
}

const searchNfts = async (name) => {
  const searchReq = await fetch(
    `https://deep-index.moralis.io/api/v2/nft/search?chain=eth&format=decimal&q=${name}&filter=name`,
    {
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY,
      },
    }
  )
  const searchJson = await searchReq.json()

  return searchJson.result
}

export default async function nameGenerator(req, res) {
  const nameStr = generateName()
  const nameParts = nameStr.split(' ')
  nameParts[nameParts.length - 1] = pluralize(nameParts[nameParts.length - 1])
  const name = nameParts.join(' ')
  const nft = await searchNfts(nameStr)
  res.status(200).json({ name, nft })
}
