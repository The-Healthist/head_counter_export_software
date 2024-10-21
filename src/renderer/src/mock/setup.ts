import { MockMethod } from 'vite-plugin-mock'

const getToiletsMock: MockMethod[] = [
  {
    url: '/api/toilets',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        // json 格式
        data: [
          'Shek Kip Mei, Hong Kong',
          'Shek Kip Mei, Hong Kong',
          '80 Tat Chee Ave, Kowloon Tong, Hong Kong',
          '80 Tat Chee Ave, Kowloon Tong, Hong Kong',
          'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
          'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
          'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong'
        ]
      }
    }
  }
]
export default getToiletsMock
