import { MockMethod } from 'vite-plugin-mock'

const getToiletsMock: MockMethod[] = [
  {
    url: '/api/toilets',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        // json 格式 包括名字,uuid
        data: [
          {
            name: 'Shek Kip Mei, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c1bf55e'
          },
          {
            name: '80 Tat Chee Ave, Kowloon Tong, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c2bf55e'
          },
          {
            name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c3bf55e'
          },
          {
            name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c4bf55e'
          },
          {
            name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c5bf55e'
          },
          {
            name: 'Wang Tau Hom Estate Wang Lai House, Wang Tau Hom, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c6bf55e'
          },
          {
            name: 'Wang Tau Hom Estate Wang Lai House, Wang Tau Hom, Hong Kong',
            uuid: '4c8f5398-b295-41fb-87f2-c8805c7bf55e'
          }
        ]
      }
    }
  }
]
export default getToiletsMock
