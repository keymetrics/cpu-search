import * as parse from 'csv-parse/lib/sync'
import fetch from 'node-fetch'

export default async function load() {
  const benchmarkLink = process.env.BENCHMARK_LINK || 'https://www.cpubenchmark.net/datadump/cpu/CPUModelSummary.csv'
  let buffer = ''
  const res = await fetch(benchmarkLink, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.BENCHMARK_USERNAME}:${process.env.BENCHMARK_PASSWORD}`).toString('base64')}`
    }
  })
  if (res.status !== 200) {
    throw new Error(`Status code: ${res.status}`)
  }
  return new Promise((resolve) => {
    res.body.on('data', (buf: Buffer) => {
      buffer += buf.toString('utf8')
    })
    res.body.on('end', () => {
      const parsed = parse(buffer, { columns: true })
      return resolve(parsed.map(cpu => {
        return Object.keys(cpu).reduce((obj, key) => {
          obj[key.indexOf(' ') === 0 ? key.substr(1) : key] = cpu[key]
          return obj
        }, {})
      }))
    })
  })
}