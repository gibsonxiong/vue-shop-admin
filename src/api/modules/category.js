import http from '../http'

const api = {
  async list(args, config) {
    return (await http.get('/categorys', config)).data
  },

  async create(args, config) {
    return (await http.post('/categorys', args, config)).data
  },

  async update(args, config) {
    return (await http.post(`/categorys/${args.id}`, args, config)).data
  },

  async delete(args, config) {
    return (await http.delete(`/categorys/${args.id}`, config)).data
  }
}

export default api
