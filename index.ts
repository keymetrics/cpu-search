import load from './load'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as Minisearch from 'minisearch'
import * as cors from 'cors'

interface CPU {
  Rank: number
}

load().then((benchmark: Array<CPU>) => {
  const search = new Minisearch({ fields: ['CPU Name'], idField: 'Rank' })
  search.addAll(benchmark)
  const app = express()
  app.use(bodyParser.json())
  app.use(cors({
    origin: true,
    allowedHeaders: ['Content-Type']
  }))

  app.post('/search', (req: express.Request, res: express.Response) => {
    const results = search.search(req.body.text)
    return res.send(results.slice(0, 10).map(result => benchmark.find(cpu => result.id === cpu['Rank'])))
  })

  app.listen(process.env.PORT || 8080)
})
